import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../common/Card';

const colors = ['#2563eb', '#10b981', '#f59e0b'];

export default function BudgetPieChart({ breakdown }) {
  const data = Object.entries(breakdown || {}).map(([name, value]) => ({ name, value: Number(value) }));

  return (
    <Card className="h-80">
      <h3 className="mb-4 font-semibold text-gray-950">Cost by Category</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={90}>
            {data.map((item, index) => (
              <Cell key={item.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
