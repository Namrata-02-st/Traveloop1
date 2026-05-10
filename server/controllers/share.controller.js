const { sequelize, Trip, Stop, StopActivity, PackingItem, User, City, CityActivity } = require('../models');
const { success, error } = require('../utils/responseHelper');

const publicInclude = [
  { model: User, attributes: ['id', 'name', 'avatar_url'] },
  {
    model: Stop,
    include: [City, { model: StopActivity, include: [CityActivity] }]
  }
];

exports.getSharedTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ where: { share_token: req.params.token, is_public: true }, include: publicInclude });
    if (!trip) return error(res, 'This itinerary does not exist or is no longer public.', 404);
    return success(res, trip, 'Shared itinerary');
  } catch (err) {
    return next(err);
  }
};

exports.copySharedTrip = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const original = await Trip.findOne({
      where: { share_token: req.params.token, is_public: true },
      include: [
        { model: Stop, include: [StopActivity] },
        PackingItem
      ],
      transaction
    });
    if (!original) {
      await transaction.rollback();
      return error(res, 'This itinerary does not exist or is no longer public.', 404);
    }

    const newTrip = await Trip.create(
      {
        user_id: req.user.id,
        title: `${original.title} (Copy)`,
        description: original.description,
        start_date: original.start_date,
        end_date: original.end_date,
        total_budget: original.total_budget,
        currency: original.currency,
        status: 'planning',
        is_public: false,
        share_token: null
      },
      { transaction }
    );

    for (const stop of original.Stops || []) {
      const newStop = await Stop.create(
        {
          trip_id: newTrip.id,
          city_id: stop.city_id,
          order_index: stop.order_index,
          arrive_date: stop.arrive_date,
          depart_date: stop.depart_date,
          notes: stop.notes,
          est_stay_cost: stop.est_stay_cost
        },
        { transaction }
      );

      for (const activity of stop.StopActivities || []) {
        await StopActivity.create(
          {
            stop_id: newStop.id,
            city_activity_id: activity.city_activity_id,
            custom_name: activity.custom_name,
            custom_cost: activity.custom_cost,
            custom_duration: activity.custom_duration,
            scheduled_date: activity.scheduled_date,
            scheduled_time: activity.scheduled_time,
            notes: activity.notes
          },
          { transaction }
        );
      }
    }

    for (const item of original.PackingItems || []) {
      await PackingItem.create(
        { trip_id: newTrip.id, name: item.name, category: item.category, is_packed: false },
        { transaction }
      );
    }

    await transaction.commit();
    return success(res, { tripId: newTrip.id }, 'Trip copied', 201);
  } catch (err) {
    await transaction.rollback();
    return next(err);
  }
};
