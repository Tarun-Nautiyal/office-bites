import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';
import { PageWrapper } from '../../components/motion/Motion';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Check your email for reset link');
    } catch {
      setSent(true);
      toast.success('If that email exists, a reset link was sent');
    }
  };

  return (
    <PageWrapper className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        {sent ? (
          <p className="text-gray-600">If an account exists for {email}, you will receive a reset link shortly.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" required placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" aria-label="Email" />
            <button type="submit" className="w-full py-3 bg-brand-500 text-white rounded-xl font-semibold">Send Reset Link</button>
          </form>
        )}
        <Link to="/login" className="block text-center text-brand-600 mt-4 text-sm hover:underline">Back to login</Link>
      </motion.div>
    </PageWrapper>
  );
}
