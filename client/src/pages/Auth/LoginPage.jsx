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
import Modal from '../../components/common/Modal';
import useAuthStore from '../../store/authStore';
import { showApiError } from '../../utils/errorHandler';

const schema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(1, 'Password is required.'),
  remember: z.boolean().optional()
});

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [email, setEmail] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { remember: false } });

  const submit = async (values) => {
    setLoading(true);
    try {
      const response = await authApi.login(values);
      login(response.data.data.user, response.data.data.token);
      toast.success('Welcome back.');
      navigate('/dashboard');
    } catch (err) {
      showApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const requestReset = async () => {
    try {
      const response = await authApi.forgotPassword({ email });
      setResetToken(response.data.data.resetToken);
      toast.success('Reset token generated.');
    } catch (err) {
      showApiError(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
            <Plane className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-950">Log in to Traveloop</h1>
          <p className="mt-2 text-sm text-gray-600">Plan trips, budgets, packing, and notes locally.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(submit)}>
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" {...register('remember')} />
              Remember me
            </label>
            <button type="button" className="font-medium text-primary-700" onClick={() => setForgotOpen(true)}>
              Forgot Password?
            </button>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            Login
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <Link className="font-semibold text-primary-700" to="/signup">Sign up</Link>
        </p>
      </div>
      <Modal open={forgotOpen} title="Generate reset token" onClose={() => setForgotOpen(false)}>
        <div className="space-y-4">
          <Input label="Account email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Button onClick={requestReset}>Generate Token</Button>
          {resetToken && (
            <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-700">
              <div className="mb-1 font-semibold">Reset token</div>
              <code className="break-all">{resetToken}</code>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
