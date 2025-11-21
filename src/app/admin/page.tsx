"use client";

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Lock, User as UserIcon, LogOut, Bot, Smartphone, Database } from 'lucide-react';

export default function AdminDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            setError('Invalid credentials. (For demo, ensure you have a user in Firebase)');
        }
    };

    const handleLogout = () => signOut(auth);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass-panel p-8 w-full max-w-md">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
                            <Lock size={24} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-6">Admin Access</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded p-3 focus:border-blue-500 outline-none transition-colors"
                                placeholder="admin@bimotech.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded p-3 focus:border-blue-500 outline-none transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition-colors">
                            Authenticate
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container h-16 flex items-center justify-between">
                    <div className="font-bold text-xl">BimoTech <span className="text-blue-400 text-sm font-normal">/ Admin</span></div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400 flex items-center gap-2">
                            <UserIcon size={14} /> {user.email}
                        </span>
                        <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 container py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content - Business Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Recent Scans</h2>
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Live Feed</span>
                        </div>

                        {/* Mock Card List */}
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="glass-panel p-4 flex items-start gap-4 hover:bg-white/5 transition-colors cursor-pointer">
                                    <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center text-gray-500">
                                        <UserIcon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold">John Doe {i}</h3>
                                            <span className="text-xs text-gray-500">2m ago</span>
                                        </div>
                                        <p className="text-sm text-gray-400">CEO @ SteelCorp Industries</p>
                                        <div className="mt-2 flex gap-2">
                                            <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded">Supplier</span>
                                            <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded">High Priority</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar - Agent Status */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold">Agent Status</h2>

                        <div className="glass-panel p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500/20 text-green-400 rounded">
                                        <Bot size={18} />
                                    </div>
                                    <div>
                                        <div className="font-medium">Research Agent</div>
                                        <div className="text-xs text-gray-400">Autogen Swarm</div>
                                    </div>
                                </div>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            </div>

                            <div className="h-px bg-white/10" />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 text-blue-400 rounded">
                                        <Smartphone size={18} />
                                    </div>
                                    <div>
                                        <div className="font-medium">WhatsApp Listener</div>
                                        <div className="text-xs text-gray-400">n8n Webhook</div>
                                    </div>
                                </div>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            </div>

                            <div className="h-px bg-white/10" />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-500/20 text-orange-400 rounded">
                                        <Database size={18} />
                                    </div>
                                    <div>
                                        <div className="font-medium">CRM Sync</div>
                                        <div className="text-xs text-gray-400">Notion Integration</div>
                                    </div>
                                </div>
                                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
