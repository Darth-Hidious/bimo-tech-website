"use client";

import { useState, useEffect } from 'react';
import { ArrowUpRight, AlertTriangle, CheckCircle, XCircle, RefreshCw, Lock } from 'lucide-react';
import { onAuthStateChanged, signInWithEmailAndPassword, User, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Mock Data - To be replaced by Notion/Firestore integration
// const projects = ... (removed)

const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case "Success":
            return <span className="flex items-center gap-1 text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs"><CheckCircle size={12} /> Success</span>;
        case "Failed":
            return <span className="flex items-center gap-1 text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs"><XCircle size={12} /> Failed</span>;
        case "Deathloop":
            return <span className="flex items-center gap-1 text-orange-400 bg-orange-400/10 px-2 py-1 rounded text-xs"><RefreshCw size={12} /> Deathloop</span>;
        default:
            return <span className="text-gray-400">{status}</span>;
    }
};

export default function InvestorRelations() {
    const [projects, setProjects] = useState<any[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch projects from backend
        const fetchProjects = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/v1/investors/projects');
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data);
                }
            } catch (err) {
                console.error("Failed to fetch projects", err);
            }
        };
        fetchProjects();

        // Check if auth is initialized (it might be undefined during build/SSR if keys are missing)
        if (!auth) {
            setLoading(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!auth) {
            setError("Auth not initialized (missing config)");
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            setError('Invalid credentials.');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass-panel p-8 w-full max-w-md text-center">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-orange-500/20 rounded-full text-orange-400">
                            <Lock size={24} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Investor Portal</h2>
                    <p className="text-gray-400 mb-6 text-sm">Authorized personnel only. Please authenticate to view project status and financials.</p>

                    <form onSubmit={handleLogin} className="space-y-4 text-left">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded p-3 focus:border-orange-500 outline-none transition-colors"
                                placeholder="investor@bimotech.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded p-3 focus:border-orange-500 outline-none transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded transition-colors">
                            Access Portal
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen p-8 md:p-24">
            <div className="container">
                <header className="mb-16 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">Investor <span className="text-gradient">Relations</span></h1>
                        <p className="text-xl text-gray-400 max-w-2xl">
                            Transparent tracking of our project portfolio, financials, and strategic initiatives.
                        </p>
                    </div>
                    <button onClick={() => signOut(auth)} className="text-sm text-gray-400 hover:text-white transition-colors">
                        Sign Out
                    </button>
                </header>

                {/* Financial Highlights */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="glass-panel p-6">
                        <h3 className="text-sm text-gray-400 mb-2">Total Funding Secured</h3>
                        <div className="text-3xl font-bold flex items-end gap-2">
                            $12.5M <span className="text-green-400 text-sm mb-1 flex items-center"><ArrowUpRight size={14} /> +15%</span>
                        </div>
                    </div>
                    <div className="glass-panel p-6">
                        <h3 className="text-sm text-gray-400 mb-2">Active Projects</h3>
                        <div className="text-3xl font-bold">8</div>
                    </div>
                    <div className="glass-panel p-6">
                        <h3 className="text-sm text-gray-400 mb-2">Burn Rate</h3>
                        <div className="text-3xl font-bold flex items-end gap-2">
                            $120k<span className="text-sm text-gray-500 mb-1">/mo</span>
                        </div>
                    </div>
                </section>

                {/* Project Portfolio */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        Project Portfolio <span className="text-xs font-normal px-2 py-1 bg-white/5 rounded text-gray-400">Live Sync</span>
                    </h2>

                    <div className="glass-panel overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-gray-400 text-sm">
                                        <th className="p-4 font-medium">Project Name</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium">Description</th>
                                        <th className="p-4 font-medium">Funding Impact</th>
                                        <th className="p-4 font-medium">Last Update</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map((project) => (
                                        <tr key={project.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-medium">{project.name}</td>
                                            <td className="p-4"><StatusBadge status={project.status} /></td>
                                            <td className="p-4 text-gray-400 text-sm max-w-xs truncate">{project.description}</td>
                                            <td className="p-4 font-mono text-sm">{project.funding}</td>
                                            <td className="p-4 text-gray-500 text-sm">{project.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
