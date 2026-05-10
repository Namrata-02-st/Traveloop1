const { Trip, Stop, City, StopActivity, CityActivity } = require('../models');

const number = (value) => Number(value || 0);

const activityCost = (item) => {
  if (item.city_activity_id && item.CityActivity) return number(item.CityActivity.est_cost);
  return number(item.custom_cost);
};

exports.calculateBudget = async (tripId) => {
  const trip = await Trip.findByPk(tripId, {
    include: [
      {
        model: Stop,
        include: [
          City,
          {
            model: StopActivity,
            include: [CityActivity]
          }
        ],
        order: [['order_index', 'ASC']]
      }
    ]
  });

  if (!trip) return null;

  const breakdownByStop = (trip.Stops || []).map((stop) => {
    const activities = (stop.StopActivities || []).reduce((sum, item) => sum + activityCost(item), 0);
    const stay = number(stop.est_stay_cost);
    return {
      stopId: stop.id,
      city: stop.City?.name || 'Unknown city',
      activities,
      accommodation: stay,
      estimated: activities + stay
    };
  });

  const activitiesTotal = breakdownByStop.reduce((sum, stop) => sum + stop.activities, 0);
  const accommodationTotal = breakdownByStop.reduce((sum, stop) => sum + stop.accommodation, 0);
  const totalEstimated = activitiesTotal + accommodationTotal;
  const totalBudget = number(trip.total_budget);
  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);
  const days = Math.max(1, Math.round((end - start) / 86400000) + 1);

  return {
    totalBudget,
    totalEstimated,
    remaining: totalBudget - totalEstimated,
    isOverBudget: totalEstimated > totalBudget,
    breakdownByStop,
    breakdownByCategory: {
      activities: activitiesTotal,
      accommodation: accommodationTotal,
      other: 0
    },
    avgCostPerDay: Math.round((totalEstimated / days) * 100) / 100
  };
};
