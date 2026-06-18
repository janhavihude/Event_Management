import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Event from '../models/Event.js';
import Organizer from '../models/Organizer.js';
import { generateSeats } from './ticket.js';

dotenv.config();

const seedDatabase = async () => {
  await connectDB();

  // Clear existing data
  await Promise.all([
    User.deleteMany(),
    Category.deleteMany(),
    Event.deleteMany(),
    Organizer.deleteMany(),
  ]);

  console.log('Cleared existing data');

  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@eventorganizer.com',
    password: 'admin123',
    role: 'admin',
    isVerified: true,
  });

  // Create organizer user
  const organizerUser = await User.create({
    name: 'John Organizer',
    email: 'organizer@eventorganizer.com',
    password: 'organizer123',
    role: 'organizer',
    isVerified: true,
  });

  // Create regular user
  const user = await User.create({
    name: 'Jane User',
    email: 'user@eventorganizer.com',
    password: 'user123',
    role: 'user',
    isVerified: true,
  });

  console.log('Created users');

  // Create categories
  const categories = await Category.insertMany([
    { name: 'Music', icon: '🎵', description: 'Concerts, festivals, and live performances' },
    { name: 'Technology', icon: '💻', description: 'Tech conferences, hackathons, and workshops' },
    { name: 'Sports', icon: '⚽', description: 'Sporting events and tournaments' },
    { name: 'Arts & Culture', icon: '🎨', description: 'Art exhibitions, theater, and cultural events' },
    { name: 'Business', icon: '💼', description: 'Networking events, seminars, and trade shows' },
    { name: 'Food & Drink', icon: '🍽️', description: 'Food festivals, wine tastings, and culinary events' },
    { name: 'Education', icon: '📚', description: 'Workshops, courses, and educational seminars' },
    { name: 'Health & Wellness', icon: '🧘', description: 'Yoga retreats, fitness events, and wellness workshops' },
  ]);

  console.log('Created categories');

  // Create organizer profile
  const organizer = await Organizer.create({
    user: organizerUser._id,
    organizationName: 'EventPro India',
    description: 'Leading event management company in India',
    isVerified: true,
    isApproved: true,
  });

  // Create sample events
  const futureDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  };

  const events = [
    {
      title: 'Mumbai Music Festival 2026',
      description: 'Experience the biggest music festival in Mumbai featuring top Indian and international artists. Three days of non-stop music, food, and entertainment.',
      images: ['https://images.unsplash.com/photo-1459749411175-04bf52929827?w=800'],
      category: categories[0]._id,
      organizer: organizer._id,
      date: futureDate(30),
      venue: {
        name: 'MMRDA Grounds',
        address: 'Bandra Kurla Complex',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        coordinates: { lat: 19.0596, lng: 72.8656 },
      },
      ticketPricing: { regular: 1500, vip: 3500, premium: 5000 },
      totalSeats: 100,
      availableSeats: 100,
      status: 'approved',
      isFeatured: true,
      tags: ['music', 'festival', 'live'],
    },
    {
      title: 'Tech Summit India 2026',
      description: 'Join 5000+ developers, entrepreneurs, and tech leaders for India\'s premier technology conference. Keynotes, workshops, and networking.',
      images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'],
      category: categories[1]._id,
      organizer: organizer._id,
      date: futureDate(45),
      venue: {
        name: 'NESCO Exhibition Center',
        address: 'Goregaon East',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        coordinates: { lat: 19.1557, lng: 72.8531 },
      },
      ticketPricing: { regular: 2500, vip: 5000, premium: 8000 },
      totalSeats: 80,
      availableSeats: 80,
      status: 'approved',
      isFeatured: true,
      tags: ['technology', 'conference', 'networking'],
    },
    {
      title: 'Yoga & Wellness Retreat',
      description: 'A transformative 2-day wellness retreat featuring yoga sessions, meditation workshops, and healthy cooking classes.',
      images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'],
      category: categories[7]._id,
      organizer: organizer._id,
      date: futureDate(20),
      venue: {
        name: 'Lonavala Hill Resort',
        address: 'Tiger Point Road',
        city: 'Lonavala',
        state: 'Maharashtra',
        country: 'India',
        coordinates: { lat: 18.7505, lng: 73.4065 },
      },
      ticketPricing: { regular: 3000, vip: 5500, premium: 7500 },
      totalSeats: 50,
      availableSeats: 50,
      status: 'approved',
      tags: ['wellness', 'yoga', 'retreat'],
    },
    {
      title: 'Startup Pitch Night',
      description: 'Watch 10 innovative startups pitch their ideas to top VCs and angel investors. Network with founders and investors.',
      images: ['https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800'],
      category: categories[4]._id,
      organizer: organizer._id,
      date: futureDate(15),
      venue: {
        name: 'WeWork BKC',
        address: 'One BKC, Bandra Kurla Complex',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        coordinates: { lat: 19.0663, lng: 72.8707 },
      },
      ticketPricing: { regular: 500, vip: 1500, premium: 2500 },
      totalSeats: 60,
      availableSeats: 60,
      status: 'approved',
      tags: ['startup', 'business', 'networking'],
    },
  ];

  for (const eventData of events) {
    const seats = generateSeats(eventData.totalSeats, eventData.ticketPricing);
    await Event.create({ ...eventData, seats });
  }

  console.log('Created sample events');
  console.log('\n--- Seed Data Summary ---');
  console.log('Admin: admin@eventorganizer.com / admin123');
  console.log('Organizer: organizer@eventorganizer.com / organizer123');
  console.log('User: user@eventorganizer.com / user123');
  console.log(`Categories: ${categories.length}`);
  console.log(`Events: ${events.length}`);
  console.log('------------------------\n');

  process.exit(0);
};

seedDatabase().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
