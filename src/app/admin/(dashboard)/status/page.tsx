"use client";

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function StatusPage() {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/nllb-status')
            .then(res => res.json())
            .then(data => {
                setStatus(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-black text-white p-20 font-sans">
            <h1 className="text-4xl font-medium mb-12">System Status</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* NLLB Status Card */}
                <div className="border border-gray-800 rounded-xl p-8 bg-gray-900/50">
                    <h2 className="text-2xl mb-6 font-mono text-gray-400">Translation Model (NLLB)</h2>

                    {loading ? (
                        <div className="flex items-center gap-4 text-gray-400">
                            <Loader2 className="animate-spin" /> Checking status...
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                {status?.installed ? (
                                    <CheckCircle className="text-green-500" size={32} />
                                ) : (
                                    <XCircle className="text-red-500" size={32} />
                                )}
                                <div>
                                    <p className="text-xl font-medium">
                                        {status?.installed ? "Model Installed" : "Model Not Found"}
                                    </p>
                                    <p className="text-sm text-gray-500 font-mono mt-1">
                                        {status?.path}
                                    </p>
                                </div>
                            </div>

                            {status?.installed && (
                                <div className="space-y-4">
                                    <div className="flex justify-between border-b border-gray-800 pb-2">
                                        <span className="text-gray-500">Size</span>
                                        <span className="font-mono">{status.size}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-800 pb-2">
                                        <span className="text-gray-500">Files</span>
                                        <span className="font-mono">{status.files?.length || 0}</span>
                                    </div>
                                </div>
                            )}

                            {!status?.installed && (
                                <div className="mt-6 p-4 bg-red-900/20 border border-red-900/50 rounded text-red-200 text-sm">
                                    To install the model, run the python script:
                                    <code className="block mt-2 bg-black p-2 rounded">python scripts/translate_i18n.py</code>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* CMS Quick Links */}
                <div className="border border-gray-800 rounded-xl p-8 bg-gray-900/50">
                    <h2 className="text-2xl mb-6 font-mono text-gray-400">Quick Actions</h2>
                    <div className="space-y-4">
                        <Link href="/admin/seed" className="block w-full p-4 border border-gray-700 rounded hover:bg-gray-800 transition text-center">
                            Database Seeder
                        </Link>
                        <Link href="/" className="block w-full p-4 border border-gray-700 rounded hover:bg-gray-800 transition text-center">
                            View Website
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
