const BudgetSummary = ({
  total,
  dailyAverage,
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-10">
      <div className="bg-zinc-900 p-6 rounded-2xl">
        <h2 className="text-zinc-400">
          Total Budget
        </h2>

        <p className="text-4xl font-bold mt-3">
          ₹ {total}
        </p>
      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl">
        <h2 className="text-zinc-400">
          Average Per Day
        </h2>

        <p className="text-4xl font-bold mt-3">
          ₹ {dailyAverage}
        </p>
      </div>
    </div>
  );
};

export default BudgetSummary;