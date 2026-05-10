import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
];

const BudgetPieChart = ({ data }) => {
  return (
    <div className="bg-zinc-900 p-6 rounded-2xl mt-10 h-[400px]">
      <h2 className="text-2xl font-bold mb-6">
        Expense Breakdown
      </h2>

      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={120}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  COLORS[index % COLORS.length]
                }
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetPieChart;