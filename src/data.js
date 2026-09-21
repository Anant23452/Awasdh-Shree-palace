import {
  AirVent,
  Bath,
  BedDouble,
  CarFront,
  Coffee,
  ConciergeBell,
  Clock3,
  Droplets,
  Hotel,
  HeartHandshake,
  BroomSparkles,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  UtensilsCrossed,
  Wifi,
  Zap,
} from 'lucide-react'

export const rooms = [
  {
    name: 'Deluxe Room',
    image: '/assets/hq-classic-room.png',
    guests: '2 guests',
    bed: '1 king bed',
    price: '₹1,799',
    description: 'A quiet, thoughtfully prepared room for restful nights after exploring Ayodhya.',
    amenities: ['Air conditioning', 'Private bathroom', 'Free Wi-Fi'],
  },
  {
    name: 'Family Room',
    image: '/assets/hq-family-suite.png',
    guests: 'Up to 4 guests',
    bed: '2 queen beds',
    price: '₹2,499',
    description: 'Generous space and two comfortable beds, made for families travelling together.',
    amenities: ['Family friendly', 'Room service', 'Hot water'],
    featured: true,
  },
  {
    name: 'Premium Room',
    image: '/assets/hq-family-premium.png',
    guests: 'Up to 4 guests',
    bed: '2 king beds',
    price: '₹2,999',
    description: 'Our most spacious room, with premium interiors and room for the family to unwind.',
    amenities: ['Modern interior', 'Air conditioning', 'Daily housekeeping'],
  },
]

export const facilities = [
  { icon: Wifi, title: 'Free Wi-Fi', copy: 'Stay connected throughout your visit.' },
  { icon: CarFront, title: 'Free parking', copy: 'Convenient parking for a simpler arrival.' },
  { icon: ConciergeBell, title: '24-hour assistance', copy: 'A helpful team whenever you need us.' },
  { icon: AirVent, title: 'Air-conditioned rooms', copy: 'Cool, comfortable rooms in every season.' },
  { icon: UtensilsCrossed, title: '24-hour food service', copy: 'Food and refreshments available around the clock.' },
  { icon: Droplets, title: 'Hot & cold water', copy: 'Hot and cold running water available 24 hours.' },
  { icon: BroomSparkles, title: 'Daily housekeeping', copy: 'Clean, cared-for spaces throughout your stay.' },
  { icon: Hotel, title: 'Lift access', copy: 'Comfortable access across the hotel.' },
  { icon: Zap, title: 'Power backup', copy: 'Backup support for a more comfortable, uninterrupted stay.' },
  { icon: Clock3, title: 'Anytime service', copy: 'Assistance, food and essential support day or night.' },
  { icon: ShieldCheck, title: 'Safe stay', copy: 'Attentive service and secure common areas.' },
]

export const gallery = [
  { src: '/assets/hq-reception.png', alt: 'Warm illuminated reception at Hotel Awadh Shree Palace', label: 'Welcome' },
  { src: '/assets/hq-family-premium.png', alt: 'Premium family room with two double beds', label: 'Family room' },
  { src: '/assets/hq-deluxe-king.png', alt: 'Deluxe king room at Hotel Awadh Shree Palace', label: 'Deluxe room' },
  { src: '/assets/hq-hotel-spaces.png', alt: 'Hotel interiors, corridors, lift and reception', label: 'Hotel spaces' },
  { src: '/assets/hq-family-suite.png', alt: 'Family suite with sitting area', label: 'Family suite' },
  { src: '/assets/hq-classic-room.png', alt: 'Classic double room', label: 'Classic room' },
]

export const trustItems = [
  { icon: Sparkles, value: 'Guest-loved', label: 'Warm hospitality' },
  { icon: MapPin, value: 'Ayodhya', label: 'Saketpuri, Deokali' },
  { icon: CarFront, value: 'Complimentary', label: 'On-site parking' },
  { icon: HeartHandshake, value: 'Family first', label: 'Comfortable group stays' },
]

export const roomIconMap = { guests: Users, bed: BedDouble, bath: Bath, coffee: Coffee }
