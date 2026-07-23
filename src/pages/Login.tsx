import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FileText, Loader2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, userId } = response.data;
            setAuth(token, userId);
            toast.success('Welcome back!');
            navigate('/editor');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

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
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                            <FileText className="h-8 w-8" />
                        </div>
                        <span className="text-3xl font-bold tracking-tight">Rezumely</span>
                    </div>
                    <h1 className="text-4xl font-extrabold leading-tight mb-4">
                        Build resumes that<br />
                        <span className="text-blue-300">land interviews.</span>
                    </h1>
                    <p className="text-lg text-white/70 max-w-md">
                        AI-powered resume builder with ATS optimization, job matching, and professional templates.
                    </p>
                    <div className="mt-12 grid grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="sm:text-2xl text-xl font-bold">4+</div>
                            <div className="text-sm text-white/60">Templates</div>
                        </div>
                        <div>
                            <div className="sm:text-2xl text-xl font-bold">AI</div>
                            <div className="text-sm text-white/60">Powered</div>
                        </div>
                        <div>
                            <div className="sm:text-2xl text-xl font-bold">ATS</div>
                            <div className="text-sm text-white/60">Optimized</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <FileText className="h-6 w-6 text-blue-600" />
                        <span className="text-xl font-bold">Rezumely</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="sm:text-2xl text-xl font-bold text-slate-900">Welcome back</h2>
                        <p className="text-slate-500 mt-1">Sign in to continue building your resume.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
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
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
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
                        </div>

                        <Button
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 font-medium hover:text-blue-700 hover:underline">
                            Create one free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
