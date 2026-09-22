import { timingSafeEqual } from 'node:crypto'
import { Redis } from '@upstash/redis'

const CONTENT_KEY = 'awadh-shree-palace:site-content:v1'
const EMPTY_CONTENT = {
  roomPrices: {},
  hiddenGallery: [],
  customGallery: [],
  hiddenFacilities: [],
  customFacilities: [],
  updatedAt: null,
}

function createRedisClient() {
  const url = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.STORAGE_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  return url && token ? new Redis({ url, token }) : null
}

function text(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function uniqueStrings(value, maxItems, maxLength) {
  if (!Array.isArray(value)) return []
  return [...new Set(value.map((item) => text(item, maxLength)).filter(Boolean))].slice(0, maxItems)
}

function formatPrice(value) {
  const digits = String(value ?? '').replace(/[^0-9]/g, '').slice(0, 8)
  const amount = Number(digits)
  return amount > 0 ? `₹${amount.toLocaleString('en-IN')}` : ''
}

export function sanitiseContent(input = {}) {
  const roomPrices = Object.fromEntries(
    Object.entries(input.roomPrices && typeof input.roomPrices === 'object' ? input.roomPrices : {})
      .slice(0, 12)
      .map(([name, value]) => [text(name, 80), formatPrice(value)])
      .filter(([name, value]) => name && value),
  )

  let galleryCharacters = 0
  const customGallery = (Array.isArray(input.customGallery) ? input.customGallery : [])
    .slice(0, 6)
    .map((item, index) => {
      const src = text(item?.src, 230_000)
      galleryCharacters += src.length
      if (!/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(src) || galleryCharacters > 1_350_000) return null
      return {
        id: text(item?.id, 80) || `photo-${index + 1}`,
        src,
        label: text(item?.label, 80) || 'Hotel photo',
        alt: text(item?.alt, 140) || 'Hotel Awadh Shree Palace gallery photo',
      }
    })
    .filter(Boolean)

  const customFacilities = (Array.isArray(input.customFacilities) ? input.customFacilities : [])
    .slice(0, 20)
    .map((item, index) => ({
      id: text(item?.id, 80) || `feature-${index + 1}`,
      title: text(item?.title, 45),
      copy: text(item?.copy, 120),
    }))
    .filter((item) => item.title && item.copy)

  return {
    roomPrices,
    hiddenGallery: uniqueStrings(input.hiddenGallery, 30, 240),
    customGallery,
    hiddenFacilities: uniqueStrings(input.hiddenFacilities, 30, 80),
    customFacilities,
    updatedAt: new Date().toISOString(),
  }
}

function secureMatch(provided, expected) {
  const providedBuffer = Buffer.from(provided || '')
  const expectedBuffer = Buffer.from(expected || '')
  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer)
}

function ownerKeyFromRequest(request) {
  const authorization = request.headers.authorization || ''
  return authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
}

async function authFailureCount(redis, request) {
  const forwarded = request.headers['x-forwarded-for']
  const ip = String(Array.isArray(forwarded) ? forwarded[0] : forwarded || request.socket?.remoteAddress || 'unknown')
    .split(',')[0]
    .trim()
    .replace(/[^a-z0-9.:_-]/gi, '')
    .slice(0, 80)
  const key = `awadh-shree-palace:owner-attempts:${ip}`
  const attempts = Number(await redis.get(key) || 0)
  return { attempts, key }
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'private, no-store, max-age=0')
  response.setHeader('X-Content-Type-Options', 'nosniff')

  const redis = createRedisClient()
  if (!redis) {
    return response.status(503).json({ error: 'storage_not_configured', message: 'Shared website storage is not configured yet.' })
  }

  try {
    if (request.method === 'GET') {
      const saved = await redis.get(CONTENT_KEY)
      return response.status(200).json({ content: { ...EMPTY_CONTENT, ...(saved || {}) } })
    }

    if (!['POST', 'PUT'].includes(request.method)) {
      response.setHeader('Allow', 'GET, POST, PUT')
      return response.status(405).json({ error: 'method_not_allowed' })
    }

    const expectedOwnerKey = process.env.OWNER_ADMIN_KEY || ''
    if (expectedOwnerKey.length < 16) {
      return response.status(503).json({ error: 'owner_access_not_configured', message: 'Owner access is not configured yet.' })
    }

    const rateLimit = await authFailureCount(redis, request)
    if (rateLimit.attempts >= 10) {
      return response.status(429).json({ error: 'too_many_attempts', message: 'Too many attempts. Please wait 15 minutes and try again.' })
    }

    if (!secureMatch(ownerKeyFromRequest(request), expectedOwnerKey)) {
      const attempts = await redis.incr(rateLimit.key)
      if (attempts === 1) await redis.expire(rateLimit.key, 15 * 60)
      return response.status(401).json({ error: 'invalid_owner_key', message: 'That owner passcode is not correct.' })
    }

    await redis.del(rateLimit.key)
    if (request.method === 'POST') return response.status(200).json({ ok: true })

    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body
    const content = sanitiseContent(body?.content)
    await redis.set(CONTENT_KEY, content)
    return response.status(200).json({ ok: true, content })
  } catch (error) {
    console.error('Site content API error:', error)
    return response.status(500).json({ error: 'server_error', message: 'The changes could not be saved. Please try again.' })
  }
}
