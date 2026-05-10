import { useEffect, useState } from "react";

import {
  saveToStorage,
  getFromStorage,
} from "../../utils/storage";

const BudgetForm = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    hotel: "",
    food: "",
    transport: "",
    activities: "",
    days: "",
  });

  useEffect(() => {
    const savedBudget =
      getFromStorage("traveloop-budget");

    if (savedBudget) {
      setFormData(savedBudget);
      onCalculate(savedBudget);
    }
  }, []);

  const handleChange = (e) => {
    const updatedData = {
      ...formData,
      [e.target.name]: e.target.value,
    };

    setFormData(updatedData);

    saveToStorage(
      "traveloop-budget",
      updatedData
    );

    onCalculate(updatedData);
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <input
        type="number"
        name="hotel"
        placeholder="Hotel Cost"
        value={formData.hotel}
        onChange={handleChange}
        className="p-4 rounded-xl bg-zinc-900 border border-zinc-700"
      />

      <input
        type="number"
        name="food"
        placeholder="Food Cost"
        value={formData.food}
        onChange={handleChange}
        className="p-4 rounded-xl bg-zinc-900 border border-zinc-700"
      />

      <input
        type="number"
        name="transport"
        placeholder="Transport Cost"
        value={formData.transport}
        onChange={handleChange}
        className="p-4 rounded-xl bg-zinc-900 border border-zinc-700"
      />

      <input
        type="number"
        name="activities"
        placeholder="Activities Cost"
        value={formData.activities}
        onChange={handleChange}
        className="p-4 rounded-xl bg-zinc-900 border border-zinc-700"
      />

      <input
        type="number"
        name="days"
        placeholder="Trip Days"
        value={formData.days}
        onChange={handleChange}
        className="p-4 rounded-xl bg-zinc-900 border border-zinc-700"
      />
    </div>
  );
};

export default BudgetForm;