const fs = require('fs');
const path = require('path');
const { sequelize, City, CityActivity } = require('../models');

const citySlug = (name) => String(name || '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const templates = [
  ['sightseeing', 'Landmark Walk', 'Explore signature landmarks and photogenic streets with a flexible walking route.', 3],
  ['food', 'Local Food Trail', 'Taste classic local dishes across markets, cafes, and casual neighborhood spots.', 2.5],
  ['culture', 'Museum and Heritage Visit', 'Spend time with the city’s art, history, and cultural institutions.', 3],
  ['nature', 'Scenic Outdoor Escape', 'Visit a park, waterfront, garden, beach, or viewpoint suited to the destination.', 2],
  ['shopping', 'Market and Design Browse', 'Browse markets, boutiques, craft stalls, or design districts for local finds.', 2],
  ['nightlife', 'Evening Neighborhood Plan', 'Enjoy sunset views, live music, relaxed bars, or a night-market style route.', 2.5]
];

const costByRegion = {
  Europe: 38,
  Asia: 24,
  Americas: 34,
  Africa: 22,
  'Middle East': 32,
  Oceania: 42
};

const activityAssetsDir = path.join(__dirname, '..', 'assets', 'activities');
const activityImageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];

const activityImageFor = (cityName, category) => {
  const base = `${citySlug(cityName)}-${category || 'generic'}`;
  for (const ext of activityImageExtensions) {
    const filename = `${base}${ext}`;
    if (fs.existsSync(path.join(activityAssetsDir, filename))) return `/assets/activities/${filename}`;
  }

  const categoryFile = `category-${category || 'generic'}.svg`;
  if (fs.existsSync(path.join(activityAssetsDir, categoryFile))) return `/assets/activities/${categoryFile}`;
  return '/assets/activities/category-generic.svg';
};

const run = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    const cities = await City.findAll({ order: [['name', 'ASC']] });
    const activities = cities.flatMap((city) => {
      const base = costByRegion[city.region] || 30;
      return templates.map(([category, label, description, duration], index) => ({
        city_id: city.id,
        name: `${city.name} ${label}`,
        category,
        description,
        est_duration: duration,
        est_cost: Math.round((base + index * 9 + Number(city.cost_index || 100) * 0.08) * 100) / 100,
        image_url: activityImageFor(city.name, category)
      }));
    });

    await CityActivity.bulkCreate(activities, {
      updateOnDuplicate: ['category', 'description', 'est_duration', 'est_cost', 'image_url']
    });
    console.log(`Seeded ${activities.length} activities for ${cities.length} cities.`);
  } catch (err) {
    console.error('Activity seeder failed:', err);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

run();
