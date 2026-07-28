import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FileText, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Please enter your name');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/auth/register', { name: name.trim(), email, password });
            const { token, userId, name: responseName } = response.data;
            setAuth(token, userId, responseName || name.trim(), email);
            toast.success('Account created! Let\'s build your resume.');
            navigate('/editor');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to register');
        } finally {
            setIsLoading(false);
        }
    };

    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
    const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #3b82f6 100%)',
            }}>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
                </div>
                <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
                    <Link to="/" className="flex items-center gap-3 mb-8">
                        <img src="/logo-light.png" alt="Rezumely" className="h-10 w-auto object-contain" />
                    </Link>
                    <h1 className="text-4xl font-extrabold leading-tight mb-6">
                        Your career starts<br />
                        <span className="text-blue-300">with one click.</span>
                    </h1>

                    <div className="space-y-4">
                        {[
                            'AI-powered content suggestions',
                            'ATS-optimized templates',
                            'One-click PDF export',
                            'Real-time job matching',
                        ].map((feature) => (
                            <div key={feature} className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-blue-300 flex-shrink-0" />
                                <span className="text-white/80">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
                        <img src="/logo-dark.png" alt="Rezumely" className="h-8 w-auto object-contain" />
                    </Link>

                    <div className="mb-8">
                        <h2 className="sm:text-2xl text-xl font-bold text-slate-900">Create your account</h2>
                        <p className="text-slate-500 mt-1">Free forever. No credit card required.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Min. 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {password.length > 0 && password.length < 6 && (
                                <p className="text-xs text-red-500">Password must be at least 6 characters</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Re-enter your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className={`h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500 pr-10 ${passwordsMatch ? 'border-green-500 focus:border-green-500' : ''
                                        } ${passwordsMismatch ? 'border-red-500 focus:border-red-500' : ''
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {passwordsMismatch && (
                                <p className="text-xs text-red-500">Passwords do not match</p>
                            )}
                            {passwordsMatch && (
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" /> Passwords match
                                </p>
                            )}
                        </div>

                        <Button
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm mt-2"
                            type="submit"
                            disabled={isLoading || password.length < 6 || password !== confirmPassword}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
