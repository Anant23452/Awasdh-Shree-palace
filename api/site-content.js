import { timingSafeEqual } from 'node:crypto'
import { createClient } from 'redis'

const CONTENT_KEY = 'awadh-shree-palace:site-content:v1'

const EMPTY_CONTENT = {
  roomPrices: {},
  hiddenGallery: [],
  customGallery: [],
  hiddenFacilities: [],
  customFacilities: [],
  updatedAt: null,
}

/* -------------------------------------------------------------------------- */
/*                               REDIS CONNECTION                             */
/* -------------------------------------------------------------------------- */

let redisClient = null
let redisConnectPromise = null

async function getRedisClient() {
  const redisUrl = process.env.REDIS_URL

  // REDIS_URL must exist in Vercel Environment Variables
  if (!redisUrl) {
    return null
  }

  if (!redisClient) {
    redisClient = createClient({
      url: redisUrl,
    })

    redisClient.on('error', (error) => {
      console.error('Redis client error:', error)
    })
  }

  if (!redisClient.isOpen) {
    if (!redisConnectPromise) {
      redisConnectPromise = redisClient
        .connect()
        .catch((error) => {
          console.error('Redis connection failed:', error)

          // Reset client so a later request can try again
          redisClient = null

          throw error
        })
        .finally(() => {
          redisConnectPromise = null
        })
    }

    await redisConnectPromise
  }

  return redisClient
}

/* -------------------------------------------------------------------------- */
/*                              SANITISING HELPERS                             */
/* -------------------------------------------------------------------------- */

function text(value, maxLength) {
  return typeof value === 'string'
    ? value.trim().slice(0, maxLength)
    : ''
}

function uniqueStrings(value, maxItems, maxLength) {
  if (!Array.isArray(value)) {
    return []
  }

  return [
    ...new Set(
      value
        .map((item) => text(item, maxLength))
        .filter(Boolean),
    ),
  ].slice(0, maxItems)
}

function formatPrice(value) {
  const digits = String(value ?? '')
    .replace(/[^0-9]/g, '')
    .slice(0, 8)

  const amount = Number(digits)

  return amount > 0
    ? `₹${amount.toLocaleString('en-IN')}`
    : ''
}

/* -------------------------------------------------------------------------- */
/*                            CONTENT SANITISATION                             */
/* -------------------------------------------------------------------------- */

export function sanitiseContent(input = {}) {
  const roomPrices = Object.fromEntries(
    Object.entries(
      input.roomPrices &&
        typeof input.roomPrices === 'object'
        ? input.roomPrices
        : {},
    )
      .slice(0, 12)
      .map(([name, value]) => [
        text(name, 80),
        formatPrice(value),
      ])
      .filter(([name, value]) => name && value),
  )

  /*
   * NOTE:
   * This keeps your existing base64 image system working.
   *
   * Later, I strongly recommend storing actual images in
   * Vercel Blob / Cloudinary and keeping only image URLs in Redis.
   */
  let galleryCharacters = 0

  const customGallery = (
    Array.isArray(input.customGallery)
      ? input.customGallery
      : []
  )
    .slice(0, 6)
    .map((item, index) => {
      const src = text(item?.src, 230_000)

      galleryCharacters += src.length

      // Allow JPEG, PNG and WEBP base64 images
      const validImage =
        /^data:image\/(jpeg|jpg|png|webp);base64,[a-z0-9+/=]+$/i.test(
          src,
        )

      if (!validImage) {
        return null
      }

      // Prevent filling Redis with too much image data
      if (galleryCharacters > 1_350_000) {
        return null
      }

      return {
        id:
          text(item?.id, 80) ||
          `photo-${index + 1}`,

        src,

        label:
          text(item?.label, 80) ||
          'Hotel photo',

        alt:
          text(item?.alt, 140) ||
          'Hotel Awadh Shree Palace gallery photo',
      }
    })
    .filter(Boolean)

  const customFacilities = (
    Array.isArray(input.customFacilities)
      ? input.customFacilities
      : []
  )
    .slice(0, 20)
    .map((item, index) => ({
      id:
        text(item?.id, 80) ||
        `feature-${index + 1}`,

      title: text(item?.title, 45),

      copy: text(item?.copy, 120),
    }))
    .filter(
      (item) =>
        item.title &&
        item.copy,
    )

  return {
    roomPrices,

    hiddenGallery: uniqueStrings(
      input.hiddenGallery,
      30,
      240,
    ),

    customGallery,

    hiddenFacilities: uniqueStrings(
      input.hiddenFacilities,
      30,
      80,
    ),

    customFacilities,

    updatedAt: new Date().toISOString(),
  }
}

/* -------------------------------------------------------------------------- */
/*                              OWNER AUTH HELPERS                             */
/* -------------------------------------------------------------------------- */

function secureMatch(provided, expected) {
  const providedBuffer = Buffer.from(
    provided || '',
    'utf8',
  )

  const expectedBuffer = Buffer.from(
    expected || '',
    'utf8',
  )

  if (
    providedBuffer.length !==
    expectedBuffer.length
  ) {
    return false
  }

  return timingSafeEqual(
    providedBuffer,
    expectedBuffer,
  )
}

function ownerKeyFromRequest(request) {
  const authorization =
    request.headers.authorization || ''

  return authorization.startsWith('Bearer ')
    ? authorization.slice(7)
    : ''
}

/* -------------------------------------------------------------------------- */
/*                              RATE LIMIT OWNER                              */
/* -------------------------------------------------------------------------- */

async function authFailureCount(redis, request) {
  const forwarded =
    request.headers['x-forwarded-for']

  const ip = String(
    Array.isArray(forwarded)
      ? forwarded[0]
      : forwarded ||
          request.socket?.remoteAddress ||
          'unknown',
  )
    .split(',')[0]
    .trim()
    .replace(/[^a-z0-9.:\_-]/gi, '')
    .slice(0, 80)

  const key =
    `awadh-shree-palace:owner-attempts:${ip}`

  const value = await redis.get(key)

  const attempts = Number(value || 0)

  return {
    attempts,
    key,
  }
}

/* -------------------------------------------------------------------------- */
/*                             PARSE REDIS CONTENT                             */
/* -------------------------------------------------------------------------- */

function parseStoredContent(value) {
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value)
  } catch (error) {
    console.error(
      'Unable to parse stored site content:',
      error,
    )

    return null
  }
}

/* -------------------------------------------------------------------------- */
/*                                  API                                       */
/* -------------------------------------------------------------------------- */

export default async function handler(
  request,
  response,
) {
  /*
   * Owner/site data should never be cached by browser/CDN.
   */
  response.setHeader(
    'Cache-Control',
    'private, no-store, max-age=0',
  )

  response.setHeader(
    'X-Content-Type-Options',
    'nosniff',
  )

  try {
    /* ---------------------------------------------------------------------- */
    /*                           CONNECT TO REDIS                              */
    /* ---------------------------------------------------------------------- */

    const redis =
      await getRedisClient()

    if (!redis) {
      return response.status(503).json({
        error: 'storage_not_configured',
        message:
          'Shared website storage is not configured yet.',
      })
    }

    /* ---------------------------------------------------------------------- */
    /*                                  GET                                   */
    /* ---------------------------------------------------------------------- */

    /*
     * GET is public because your main hotel website needs
     * to read the content saved by Owner Studio.
     */
    if (request.method === 'GET') {
      const rawSaved =
        await redis.get(CONTENT_KEY)

      const saved =
        parseStoredContent(rawSaved)

      return response.status(200).json({
        content: {
          ...EMPTY_CONTENT,
          ...(saved || {}),
        },
      })
    }

    /* ---------------------------------------------------------------------- */
    /*                          METHOD VALIDATION                              */
    /* ---------------------------------------------------------------------- */

    if (
      !['POST', 'PUT'].includes(
        request.method,
      )
    ) {
      response.setHeader(
        'Allow',
        'GET, POST, PUT',
      )

      return response.status(405).json({
        error: 'method_not_allowed',
        message:
          'This request method is not allowed.',
      })
    }

    /* ---------------------------------------------------------------------- */
    /*                           OWNER CONFIG                                  */
    /* ---------------------------------------------------------------------- */

    const expectedOwnerKey =
      process.env.OWNER_ADMIN_KEY || ''

    /*
     * Require a reasonably strong owner password.
     */
    if (expectedOwnerKey.length < 16) {
      return response.status(503).json({
        error:
          'owner_access_not_configured',

        message:
          'Owner access is not configured yet.',
      })
    }

    /* ---------------------------------------------------------------------- */
    /*                             RATE LIMIT                                  */
    /* ---------------------------------------------------------------------- */

    const rateLimit =
      await authFailureCount(
        redis,
        request,
      )

    if (
      rateLimit.attempts >= 10
    ) {
      return response.status(429).json({
        error: 'too_many_attempts',

        message:
          'Too many attempts. Please wait 15 minutes and try again.',
      })
    }

    /* ---------------------------------------------------------------------- */
    /*                         OWNER AUTHENTICATION                            */
    /* ---------------------------------------------------------------------- */

    const suppliedOwnerKey =
      ownerKeyFromRequest(request)

    if (
      !secureMatch(
        suppliedOwnerKey,
        expectedOwnerKey,
      )
    ) {
      const attempts =
        await redis.incr(
          rateLimit.key,
        )

      /*
       * On first failed attempt,
       * expire rate limit after 15 minutes.
       */
      if (attempts === 1) {
        await redis.expire(
          rateLimit.key,
          15 * 60,
        )
      }

      return response.status(401).json({
        error: 'invalid_owner_key',

        message:
          'That owner passcode is not correct.',
      })
    }

    /*
     * Successful authentication.
     * Remove previous failed attempts.
     */
    await redis.del(rateLimit.key)

    /* ---------------------------------------------------------------------- */
    /*                                  POST                                  */
    /* ---------------------------------------------------------------------- */

    /*
     * POST is used only to verify owner authentication.
     */
    if (request.method === 'POST') {
      return response.status(200).json({
        ok: true,
      })
    }

    /* ---------------------------------------------------------------------- */
    /*                                   PUT                                  */
    /* ---------------------------------------------------------------------- */

    let body = request.body

    /*
     * Depending on Vercel/body parser configuration,
     * request.body may already be an object.
     */
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch {
        return response.status(400).json({
          error: 'invalid_json',

          message:
            'The submitted data is not valid.',
        })
      }
    }

    if (
      !body ||
      typeof body !== 'object'
    ) {
      return response.status(400).json({
        error: 'invalid_body',

        message:
          'No valid content was provided.',
      })
    }

    const content =
      sanitiseContent(
        body.content,
      )

    /*
     * Standard node-redis stores strings.
     * Therefore serialize object to JSON.
     */
    await redis.set(
      CONTENT_KEY,
      JSON.stringify(content),
    )

    return response.status(200).json({
      ok: true,
      content,
    })
  } catch (error) {
    console.error(
      'Site content API error:',
      error,
    )

    return response.status(500).json({
      error: 'server_error',

      message:
        'The changes could not be saved. Please try again.',
    })
  }
}