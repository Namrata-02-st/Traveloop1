import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatCurrency } from '../../utils/formatCurrency';

export default function BudgetSummary({ budget, currency }) {
  const cards = [
    ['Total Budget', formatCurrency(budget.totalBudget, currency)],
    ['Estimated Cost', formatCurrency(budget.totalEstimated, currency)],
    ['Remaining', formatCurrency(budget.remaining, currency)],
    ['Status', budget.isOverBudget ? 'Over Budget' : 'On Track']
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(([label, value]) => (
        <Card key={label}>
          <p className="text-sm text-gray-500">{label}</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <strong className="text-xl text-gray-950">{value}</strong>
            {label === 'Status' && <Badge variant={budget.isOverBudget ? 'danger' : 'ongoing'}>{value}</Badge>}
          </div>
        </Card>
      ))}
    </div>
  );
}
