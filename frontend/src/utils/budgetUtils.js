export const calculateBudget = ({
  hotel,
  food,
  transport,
  activities,
  days,
}) => {
  const total =
    Number(hotel) +
    Number(food) +
    Number(transport) +
    Number(activities);

  const dailyAverage =
    days > 0 ? Math.round(total / days) : 0;

  return {
    total,
    dailyAverage,
  };
};