import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Button from '../common/Button';
import Input from '../common/Input';
import { CURRENCIES } from '../../utils/constants';

const schema = z
  .object({
    title: z.string().trim().min(1, 'Trip title is required.'),
    description: z.string().optional(),
    start_date: z.string().min(1, 'Start date is required.'),
    end_date: z.string().min(1, 'End date is required.'),
    total_budget: z.coerce.number().min(0, 'Budget cannot be negative.'),
    currency: z.string().min(3),
    cover: z.any().optional()
  })
  .refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
    path: ['end_date'],
    message: 'End date must be after start date.'
  });

export default function TripForm({ initialValues, submitLabel = 'Save Trip', onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      start_date: initialValues?.start_date || '',
      end_date: initialValues?.end_date || '',
      total_budget: initialValues?.total_budget || 0,
      currency: initialValues?.currency || 'USD'
    }
  });

  const submit = (values) => {
    const file = values.cover?.[0];
    if (file) {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'cover') formData.append(key, value ?? '');
      });
      formData.append('cover', file);
      onSubmit(formData);
      return;
    }
    onSubmit({ ...values, title: values.title.trim(), description: values.description?.trim() });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(submit)}>
      <Input label="Trip Title" {...register('title')} error={errors.title?.message} />
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Description</span>
        <textarea
          rows="3"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-primary-500"
          {...register('description')}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Start Date" type="date" {...register('start_date')} error={errors.start_date?.message} />
        <Input label="End Date" type="date" {...register('end_date')} error={errors.end_date?.message} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Total Budget" type="number" min="0" step="0.01" {...register('total_budget')} error={errors.total_budget?.message} />
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Currency</span>
          <select className="w-full rounded-lg border-gray-300 focus:border-transparent focus:ring-2 focus:ring-primary-500" {...register('currency')}>
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Input label="Cover Photo" type="file" accept="image/png,image/jpeg" {...register('cover')} />
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
