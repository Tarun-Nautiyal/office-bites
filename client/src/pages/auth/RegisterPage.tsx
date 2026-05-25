import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { PageWrapper } from '../../components/motion/Motion';
import { useAuthStore } from '../../store/authStore';

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err: unknown) {
      toast.error((err as { message?: string }).message || 'Registration failed');
    }
  };

  return (
    <PageWrapper className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(['name', 'email', 'phone', 'password'] as const).map((field) => (
            <div key={field}>
              <label htmlFor={field} className="text-sm font-medium capitalize">{field}</label>
              <input
                id={field}
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                required={field !== 'phone'}
                value={form[field]}
                onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                className="w-full mt-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          ))}
          <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="w-full py-3 bg-brand-500 text-white rounded-xl font-semibold disabled:opacity-50">
            {isLoading ? 'Creating...' : 'Sign Up'}
          </motion.button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </PageWrapper>
  );
}
