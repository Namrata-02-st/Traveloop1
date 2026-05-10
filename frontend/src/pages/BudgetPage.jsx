import { useState } from "react";

import BudgetForm from "../components/budget/BudgetForm";
import BudgetSummary from "../components/budget/BudgetSummary";
import BudgetPieChart from "../components/charts/BudgetPieChart";

import { calculateBudget } from "../utils/budgetUtils";

const BudgetPage = () => {
  const [budgetData, setBudgetData] = useState({
    total: 0,
    dailyAverage: 0,
  });

  const [chartData, setChartData] = useState([]);

  const handleCalculation = (data) => {
    const result = calculateBudget(data);

    setBudgetData(result);

    setChartData([
      {
        name: "Hotel",
        value: Number(data.hotel) || 0,
      },
      {
        name: "Food",
        value: Number(data.food) || 0,
      },
      {
        name: "Transport",
        value: Number(data.transport) || 0,
      },
      {
        name: "Activities",
        value: Number(data.activities) || 0,
      },
    ]);
  };

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-5xl font-bold">
        Budget Planner
      </h1>

      <p className="text-zinc-400 mt-4">
        Plan your travel expenses smartly
      </p>

      <div className="mt-10">
        <BudgetForm
          onCalculate={handleCalculation}
        />
      </div>

      <BudgetSummary
        total={budgetData.total}
        dailyAverage={
          budgetData.dailyAverage
        }
      />

      <BudgetPieChart data={chartData} />
    </div>
  );
};

export default BudgetPage;