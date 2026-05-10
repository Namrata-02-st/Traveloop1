import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plane } from 'lucide-react';
import { authApi } from '../../api/auth.api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import useAuthStore from '../../store/authStore';
import { showApiError } from '../../utils/errorHandler';

const schema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
    email: z.string().email('Enter a valid email.'),
    password: z.string().min(8, 'Password must be at least 8 characters.').regex(/\d/, 'Password must include a number.').regex(/[^A-Za-z0-9]/, 'Password must include a special character.'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, { path: ['confirmPassword'], message: 'Passwords must match.' });

export default function SignupPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const submit = async (values) => {
    setLoading(true);
    try {
      const response = await authApi.register(values);
      login(response.data.data.user, response.data.data.token);
      toast.success('Account created.');
      navigate('/dashboard');
    } catch (err) {
      showApiError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
            <Plane className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-950">Create your account</h1>
          <p className="mt-2 text-sm text-gray-600">Start planning a complete local-first itinerary.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(submit)}>
          <Input label="Full Name" {...register('name')} error={errors.name?.message} />
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
          <Input label="Confirm Password" type="password" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
          <Button type="submit" className="w-full" disabled={loading}>
            Sign Up
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link className="font-semibold text-primary-700" to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
