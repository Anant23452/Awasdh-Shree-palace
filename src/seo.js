export const SITE_URL = 'https://www.awadhshreepalace.com'
export const SITE_NAME = 'Hotel Awadh Shree Palace'
export const OG_IMAGE = `${SITE_URL}/assets/optimized/hotel-awadh-shree-palace-og.jpg`

export const HOTEL = {
  name: SITE_NAME,
  telephone: '+91 91964 22812',
  telephoneHref: 'tel:+919196422812',
  whatsappHref: 'https://wa.me/919196422812',
  addressLines: ['Behind Blinkit Store', 'Saketpuri, Deokali', 'Ayodhya, Uttar Pradesh 224001'],
  mapsUrl: 'https://maps.app.goo.gl/JJ7KRoCftp8ind83A?g_st=aw',
}

export const FAQ_ITEMS = [
  { question: 'Where is Hotel Awadh Shree Palace located?', answer: 'The hotel is behind Blinkit Store in Saketpuri, Deokali, Ayodhya, Uttar Pradesh 224001.' },
  { question: 'Does the hotel provide parking?', answer: 'Yes. Complimentary on-site parking is listed among the hotel facilities.' },
  { question: 'Is Wi-Fi available?', answer: 'Yes. Free Wi-Fi is available for hotel guests.' },
  { question: 'Is the hotel suitable for families?', answer: 'The hotel offers family rooms with capacity for up to four guests, subject to availability.' },
  { question: 'What are the hotel check-in and check-out times?', answer: 'Check-in is from 12:00 PM and check-out is by 11:00 AM. Early check-in or late check-out requests depend on availability.' },
  { question: 'How can I check room availability?', answer: 'Use the availability form or contact the hotel directly by phone or WhatsApp. The hotel team confirms availability personally.' },
  { question: 'Is non-vegetarian food or alcohol allowed inside the hotel?', answer: 'Non-vegetarian food and alcohol consumption are not permitted inside the hotel premises.' },
]

export const PAGE_SEO = {
  '/': {
    title: 'Hotel in Ayodhya | Hotel Awadh Shree Palace',
    description: 'Discover Hotel Awadh Shree Palace in Ayodhya. Explore comfortable rooms, verified facilities, location details and direct enquiry options.',
    eyebrow: 'Official hotel website',
    h1: 'Hotel Awadh Shree Palace, Ayodhya',
  },
  '/rooms': {
    title: 'Rooms in Ayodhya | Hotel Awadh Shree Palace',
    description: 'Explore Deluxe, Family and Premium rooms at Hotel Awadh Shree Palace in Ayodhya, with room details and direct availability enquiries.',
    eyebrow: 'Rooms in Ayodhya',
    h1: 'Comfortable rooms for your Ayodhya stay',
  },
  '/amenities': {
    title: 'Hotel Amenities in Ayodhya | Awadh Shree Palace',
    description: 'View verified facilities at Hotel Awadh Shree Palace, including Wi-Fi, parking, air-conditioned rooms, hot water and guest assistance.',
    eyebrow: 'Hotel facilities',
    h1: 'Useful comforts, clearly explained',
  },
  '/gallery': {
    title: 'Hotel Gallery | Awadh Shree Palace Ayodhya',
    description: 'See real photos of Hotel Awadh Shree Palace in Ayodhya, including guest rooms, reception, corridors and other hotel spaces.',
    eyebrow: 'Hotel photo gallery',
    h1: 'See the rooms and hotel before you arrive',
  },
  '/location': {
    title: 'Hotel Location in Ayodhya | Awadh Shree Palace',
    description: 'Find Hotel Awadh Shree Palace in Saketpuri, Deokali, Ayodhya. View the address, live directions and useful nearby place information.',
    eyebrow: 'Location and directions',
    h1: 'Find Hotel Awadh Shree Palace in Ayodhya',
  },
  '/about': {
    title: 'About Hotel Awadh Shree Palace Ayodhya',
    description: 'Learn about Hotel Awadh Shree Palace, a practical family stay in Saketpuri, Deokali, Ayodhya, with direct guest assistance.',
    eyebrow: 'About the hotel',
    h1: 'A calm base for time in Ayodhya',
  },
  '/contact': {
    title: 'Contact Hotel Awadh Shree Palace Ayodhya',
    description: 'Contact Hotel Awadh Shree Palace in Ayodhya by phone or WhatsApp for room enquiries, availability confirmation and directions.',
    eyebrow: 'Contact and booking',
    h1: 'Speak directly with the hotel team',
  },
  '/faq': {
    title: 'Hotel FAQs | Awadh Shree Palace Ayodhya',
    description: 'Find useful answers about the location, rooms, parking, Wi-Fi, check-in, check-out and hotel policies at Awadh Shree Palace Ayodhya.',
    eyebrow: 'Frequently asked questions',
    h1: 'Helpful details before your stay',
  },
  '/ayodhya-travel-guide': {
    title: 'Ayodhya Travel Guide | Awadh Shree Palace',
    description: 'Plan an Ayodhya visit with practical guidance on live routes, local transport, key places and preparing for a comfortable hotel stay.',
    eyebrow: 'Plan your visit',
    h1: 'A practical guide to visiting Ayodhya',
  },
  '/hotel-near-ram-mandir-ayodhya': {
    title: 'Hotel Near Ram Mandir Ayodhya | Awadh Shree Palace',
    description: 'Plan your route from Hotel Awadh Shree Palace to Ram Mandir Ayodhya, explore room options and contact the hotel for local guidance.',
    eyebrow: 'Visiting Ram Mandir',
    h1: 'Plan your Ayodhya stay for a Ram Mandir visit',
  },
}

export const INDEXABLE_PATHS = Object.keys(PAGE_SEO)

export function normalisePath(pathname = '/') {
  const cleaned = pathname.split('?')[0].replace(/\/+$/, '') || '/'
  return PAGE_SEO[cleaned] ? cleaned : '/404'
}

export function createSchemas(path) {
  const page = PAGE_SEO[path] || {
    title: 'Page not found | Hotel Awadh Shree Palace',
    description: 'Return to the official Hotel Awadh Shree Palace website.',
  }
  const canonical = `${SITE_URL}${path === '/' ? '/' : path}`
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Hotel',
      '@id': `${SITE_URL}/#hotel`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      description: PAGE_SEO['/'].description,
      image: [OG_IMAGE],
      telephone: '+919196422812',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Behind Blinkit Store, Saketpuri, Deokali',
        addressLocality: 'Ayodhya',
        addressRegion: 'Uttar Pradesh',
        postalCode: '224001',
        addressCountry: 'IN',
      },
      checkinTime: '12:00',
      checkoutTime: '11:00',
      sameAs: [HOTEL.mapsUrl],
      amenityFeature: [
        ['Free Wi-Fi', true], ['Free parking', true], ['Air-conditioned rooms', true],
        ['Hot and cold water', true], ['Lift access', true], ['Power backup', true],
      ].map(([name, value]) => ({ '@type': 'LocationFeatureSpecification', name, value })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      inLanguage: 'en-IN',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: page.title,
      description: page.description,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#hotel` },
      inLanguage: 'en-IN',
    },
  ]

  if (path !== '/') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: page.h1 || page.title, item: canonical },
      ],
    })
  }

  if (path === '/faq') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    })
  }

  return schemas
}
