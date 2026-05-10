const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { sequelize, City, User } = require('../models');

const citySlug = (name) => String(name || '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const regionSlug = (region) => {
  const slug = String(region || '').toLowerCase().replaceAll(' ', '-');
  return slug || 'generic';
};

const cityAssetsDir = path.join(__dirname, '..', 'assets', 'cities');
const cityImageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];

const cityImageFromAssets = (name) => {
  const slug = citySlug(name);
  for (const ext of cityImageExtensions) {
    const filename = `${slug}${ext}`;
    if (fs.existsSync(path.join(cityAssetsDir, filename))) return `/assets/cities/${filename}`;
  }
  return null;
};

const cityImageForRegion = (region) => {
  const filename = `region-${regionSlug(region)}.svg`;
  if (fs.existsSync(path.join(cityAssetsDir, filename))) return `/assets/cities/${filename}`;
  return '/assets/cities/region-generic.svg';
};

const cityImageFor = (name, region) => cityImageFromAssets(name) || cityImageForRegion(region);

const cities = [
  ['Paris', 'France', 'Europe', 'Paris blends iconic landmarks with intimate neighborhoods built for slow wandering. Its museums, cafes, and river walks make it a classic first stop for culture-heavy trips.', 180, 98],
  ['Tokyo', 'Japan', 'Asia', 'Tokyo balances neon scale with quiet temples and precise everyday hospitality. Travelers can move from food alleys to gardens to design districts in a single day.', 165, 99],
  ['New York', 'United States', 'Americas', 'New York is dense, energetic, and built for repeat discovery. Its boroughs offer world-class food, museums, parks, theater, and skyline views.', 220, 97],
  ['London', 'United Kingdom', 'Europe', 'London mixes royal history, global neighborhoods, and a deep arts calendar. It works well for travelers who want museums, markets, parks, and nightlife in one base.', 200, 96],
  ['Dubai', 'United Arab Emirates', 'Middle East', 'Dubai is polished, ambitious, and easy to navigate for short urban escapes. It pairs beaches and desert trips with shopping, dining, and high-rise viewpoints.', 190, 93],
  ['Singapore', 'Singapore', 'Asia', 'Singapore is compact, clean, and excellent for food-focused exploration. Gardens, hawker centers, waterfront walks, and efficient transit make planning simple.', 170, 94],
  ['Rome', 'Italy', 'Europe', 'Rome layers ancient ruins, churches, piazzas, and trattorias into a walkable city break. It rewards flexible days with history around nearly every corner.', 155, 95],
  ['Barcelona', 'Spain', 'Europe', 'Barcelona combines beach access, modernist architecture, and late-night dining. The city suits travelers who want art, food, design, and relaxed coastal energy.', 145, 94],
  ['Sydney', 'Australia', 'Oceania', 'Sydney is a bright harbor city with beaches, ferry rides, and outdoor dining. It is ideal for mixing urban sightseeing with coastal walks and day trips.', 185, 91],
  ['Mumbai', 'India', 'Asia', 'Mumbai is fast, cinematic, and rich with street food and colonial-era architecture. It offers a vivid look at India through markets, seaside promenades, and local neighborhoods.', 65, 89],
  ['Bangkok', 'Thailand', 'Asia', 'Bangkok is energetic, affordable, and packed with temples, markets, and street food. It is a strong hub for travelers building wider Southeast Asia itineraries.', 75, 92],
  ['Istanbul', 'Turkey', 'Middle East', 'Istanbul bridges continents with mosques, bazaars, ferries, and layered imperial history. Its food and waterfront neighborhoods make it rewarding over several days.', 95, 91],
  ['Amsterdam', 'Netherlands', 'Europe', 'Amsterdam offers canals, cycling culture, museums, and compact neighborhoods. It is easy to explore slowly while still fitting strong cultural highlights into a short stay.', 175, 90],
  ['Berlin', 'Germany', 'Europe', 'Berlin is creative, historic, and known for galleries, nightlife, and public memory sites. It suits travelers who like urban culture, music, and independent neighborhoods.', 140, 88],
  ['Toronto', 'Canada', 'Americas', 'Toronto is diverse, practical, and full of food districts, parks, and waterfront views. It is a good base for city exploration and Niagara-region side trips.', 160, 86],
  ['Cape Town', 'South Africa', 'Africa', 'Cape Town combines mountains, beaches, vineyards, and layered history. Outdoor travelers can pair dramatic views with markets, museums, and coastal drives.', 105, 90],
  ['Mexico City', 'Mexico', 'Americas', 'Mexico City is vast, artistic, and one of the world’s great food cities. Its museums, parks, markets, and historic center support a rich multi-day plan.', 90, 91],
  ['Buenos Aires', 'Argentina', 'Americas', 'Buenos Aires is elegant, literary, and deeply tied to music, cafes, and late dinners. It works well for travelers who enjoy neighborhoods, architecture, and cultural nights out.', 80, 86],
  ['Seoul', 'South Korea', 'Asia', 'Seoul is modern, efficient, and layered with palaces, markets, and mountain trails. Food, beauty, design, and pop culture make it especially dynamic.', 135, 91],
  ['Cairo', 'Egypt', 'Africa', 'Cairo is intense, historic, and anchored by ancient monuments and busy markets. It is best planned with time for museums, local food, and guided day trips.', 70, 88],
  ['Vienna', 'Austria', 'Europe', 'Vienna is refined, musical, and full of palaces, cafes, and museums. It is a comfortable city for travelers who want beauty, transit ease, and classical culture.', 150, 86],
  ['Prague', 'Czech Republic', 'Europe', 'Prague is picturesque, compact, and known for bridges, towers, and old-town streets. It offers strong value for travelers focused on architecture and atmosphere.', 110, 88],
  ['Lisbon', 'Portugal', 'Europe', 'Lisbon is hilly, sunny, and rich with viewpoints, tiles, seafood, and tram routes. It balances relaxed pacing with excellent day trips to nearby coast and palaces.', 120, 89],
  ['Bali', 'Indonesia', 'Asia', 'Bali mixes beaches, temples, rice terraces, wellness stays, and surf towns. It is best planned by region because traffic makes compact routing important.', 80, 92],
  ['Maldives', 'Maldives', 'Asia', 'Maldives is a tropical island destination built around beaches, reefs, and resort stays. It is ideal for travelers prioritizing rest, water activities, and privacy.', 300, 90],
  ['Santorini', 'Greece', 'Europe', 'Santorini is known for cliffside villages, caldera views, and dramatic sunsets. Its compact size makes it simple to pair scenery, food, and boat trips.', 210, 89],
  ['Reykjavik', 'Iceland', 'Europe', 'Reykjavik is a small capital with strong access to Iceland’s landscapes. Travelers often use it as a base for geothermal pools, waterfalls, and northern lights routes.', 230, 87],
  ['Marrakech', 'Morocco', 'Africa', 'Marrakech is sensory, colorful, and centered around souks, gardens, and riads. It works well for travelers who enjoy markets, design, and desert-edge excursions.', 85, 87],
  ['Nairobi', 'Kenya', 'Africa', 'Nairobi is a lively East African hub with national park access close to the city. It is a practical starting point for wildlife, culture, and regional travel.', 95, 82],
  ['Kyoto', 'Japan', 'Asia', 'Kyoto is calm, temple-rich, and deeply tied to gardens, tea, and seasonal beauty. It rewards early starts, neighborhood walks, and time away from crowds.', 145, 94],
  ['Hong Kong', 'China', 'Asia', 'Hong Kong is vertical, compact, and full of harbor views, food streets, and trails. It is excellent for travelers who want urban energy with quick nature access.', 175, 89],
  ['Shanghai', 'China', 'Asia', 'Shanghai is sleek, historic, and shaped by riverfront skylines and lane neighborhoods. It offers design, shopping, food, and strong transit for busy itineraries.', 135, 86],
  ['Los Angeles', 'United States', 'Americas', 'Los Angeles is spread out, sunny, and centered on neighborhoods, beaches, studios, and food. It needs careful routing but rewards travelers with variety.', 210, 90],
  ['Miami', 'United States', 'Americas', 'Miami mixes beaches, Latin food, art districts, and nightlife. It is a strong warm-weather trip for travelers who want water, design, and social energy.', 195, 87],
  ['Chicago', 'United States', 'Americas', 'Chicago is architectural, musical, and set on a dramatic lakefront. Museums, neighborhoods, food, and river views make it a balanced city trip.', 175, 86],
  ['Vancouver', 'Canada', 'Americas', 'Vancouver pairs glassy city views with mountains, forests, and coastline. It is ideal for travelers who want outdoor days without giving up urban comfort.', 180, 87],
  ['Edinburgh', 'United Kingdom', 'Europe', 'Edinburgh is atmospheric, walkable, and full of literary streets, castles, and viewpoints. It works well for history lovers and Scotland route starters.', 150, 85],
  ['Athens', 'Greece', 'Europe', 'Athens combines ancient sites with lively neighborhoods and Mediterranean food. It is a natural gateway to island trips and a rewarding city on its own.', 115, 88],
  ['Budapest', 'Hungary', 'Europe', 'Budapest is scenic, affordable, and known for thermal baths, river views, and grand architecture. It is a strong value city for culture and nightlife.', 95, 86],
  ['Dubrovnik', 'Croatia', 'Europe', 'Dubrovnik is a fortified coastal city with limestone streets and Adriatic views. It is best planned around shoulder seasons and nearby island outings.', 160, 84],
  ['Zurich', 'Switzerland', 'Europe', 'Zurich is polished, lakeside, and efficient, with easy access to Swiss rail routes. It suits travelers who want clean urban comfort and mountain day trips.', 260, 83],
  ['Florence', 'Italy', 'Europe', 'Florence is compact, art-filled, and central to Renaissance history. It is excellent for museums, Tuscan food, viewpoints, and nearby countryside routes.', 150, 90],
  ['Venice', 'Italy', 'Europe', 'Venice is singular, car-free, and built around canals, palaces, and quiet backstreets. It benefits from early mornings, slower walks, and thoughtful crowd timing.', 190, 89],
  ['Seville', 'Spain', 'Europe', 'Seville is warm, musical, and full of plazas, orange trees, tapas, and Moorish architecture. It supports relaxed itineraries with strong evening culture.', 105, 85],
  ['Hanoi', 'Vietnam', 'Asia', 'Hanoi is layered, affordable, and alive with lakes, markets, and old-quarter streets. It is a strong base for northern Vietnam routes.', 55, 87],
  ['Ho Chi Minh City', 'Vietnam', 'Asia', 'Ho Chi Minh City is fast-moving, food-rich, and full of markets, museums, and cafe culture. It works well for travelers linking southern Vietnam and Mekong trips.', 60, 85],
  ['Petra', 'Jordan', 'Middle East', 'Petra is an archaeological wonder carved into desert sandstone. It is best experienced with early starts, sturdy shoes, and time for nearby Jordan routes.', 115, 86],
  ['Colombo', 'Sri Lanka', 'Asia', 'Colombo is a coastal capital with markets, temples, colonial buildings, and growing food scenes. It is a practical start or finish for wider Sri Lanka itineraries.', 70, 80],
  ['Kathmandu', 'Nepal', 'Asia', 'Kathmandu is historic, textured, and a gateway to Himalayan travel. Temples, courtyards, trekking logistics, and local food define a compact stay.', 50, 84],
  ['Havana', 'Cuba', 'Americas', 'Havana is colorful, musical, and full of vintage streets, plazas, and seafront walks. It rewards travelers who enjoy history, live music, and slow neighborhood exploration.', 75, 83]
].map(([name, country, region, description, cost_index, popularity]) => ({
  name,
  country,
  region,
  description,
  cost_index,
  popularity,
  image_url: cityImageFor(name, region)
}));

const run = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    await City.bulkCreate(cities, {
      updateOnDuplicate: ['region', 'description', 'cost_index', 'popularity', 'image_url']
    });

    const [admin, created] = await User.findOrCreate({
      where: { email: 'admin@traveloop.com' },
      defaults: {
        name: 'Traveloop Admin',
        email: 'admin@traveloop.com',
        password: await bcrypt.hash('Admin@1234', 12),
        role: 'admin',
        language: 'en',
        is_active: true
      }
    });

    if (!created && admin.role !== 'admin') {
      admin.role = 'admin';
      admin.is_active = true;
      await admin.save();
    }

    console.log(`Seeded ${cities.length} cities.`);
    console.log('Admin account ready: admin@traveloop.com / Admin@1234');
  } catch (err) {
    console.error('City seeder failed:', err);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

run();
