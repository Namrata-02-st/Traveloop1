import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { budgetApi } from '../../api/budget.api';
import BudgetBarChart from '../../components/budget/BudgetBarChart';
import BudgetPieChart from '../../components/budget/BudgetPieChart';
import BudgetSummary from '../../components/budget/BudgetSummary';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import useTripStore from '../../store/tripStore';
import { formatCurrency } from '../../utils/formatCurrency';
import { showApiError } from '../../utils/errorHandler';

export default function BudgetPage({ tripId, currency = 'USD' }) {
  const params = useParams();
  const id = tripId || params.id;
  const budgetVersion = useTripStore((state) => state.budgetVersion);
  const [budget, setBudget] = useState(null);
  const [cap, setCap] = useState('');

  const loadBudget = async () => {
    try {
      const response = await budgetApi.get(id);
      setBudget(response.data.data);
      setCap(response.data.data.totalBudget);
    } catch (err) {
      showApiError(err);
    }
  };

  useEffect(() => {
    loadBudget();
  }, [id, budgetVersion]);

  const updateCap = async (event) => {
    event.preventDefault();
    try {
      const response = await budgetApi.update(id, cap);
      setBudget(response.data.data);
      toast.success('Budget updated.');
    } catch (err) {
      showApiError(err);
    }
  };

  if (!budget) return <Card>Loading budget...</Card>;

  return (
    <div className="space-y-5">
      <BudgetSummary budget={budget} currency={currency} />
      {budget.isOverBudget && <div className="rounded-xl bg-red-50 p-4 font-medium text-red-700">Estimated costs are above your total budget.</div>}
      <div className="grid gap-5 lg:grid-cols-2">
        <BudgetPieChart breakdown={budget.breakdownByCategory} />
        <BudgetBarChart stops={budget.breakdownByStop} />
      </div>
      <Card>
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-semibold text-gray-950">Cost Breakdown</h3>
            <p className="text-sm text-gray-500">Average cost per day: {formatCurrency(budget.avgCostPerDay, currency)}</p>
          </div>
          <form className="flex gap-2" onSubmit={updateCap}>
            <Input type="number" min="0" value={cap} onChange={(event) => setCap(event.target.value)} />
            <Button type="submit">Update Budget Cap</Button>
          </form>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500">
              <tr>
                <th className="py-2">City</th>
                <th>Activity Costs</th>
                <th>Stay Costs</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {budget.breakdownByStop.map((stop) => (
                <tr key={stop.stopId} className="border-t border-gray-100">
                  <td className="py-3 font-medium text-gray-950">{stop.city}</td>
                  <td>{formatCurrency(stop.activities, currency)}</td>
                  <td>{formatCurrency(stop.accommodation, currency)}</td>
                  <td>{formatCurrency(stop.estimated, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
