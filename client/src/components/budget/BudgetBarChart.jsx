import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../common/Card';

export default function BudgetBarChart({ stops }) {
  return (
    <Card className="h-80">
      <h3 className="mb-4 font-semibold text-gray-950">Cost per Stop</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={stops || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="city" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="estimated" fill="#2563eb" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
