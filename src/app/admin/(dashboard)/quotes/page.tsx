"use client";

import { useState, useEffect } from 'react';
import styles from '../../admin.module.css';
import { cms } from '@/lib/cms/firestoreAdapter';
import type { QuoteRequest } from '@/lib/cms/types';
import { Eye, FileText, Check, X, Clock, AlertCircle, MessageSquare, Box, Loader2, Sparkles, Send, Brain, ChevronRight } from 'lucide-react';

interface AnalysisResult {
    analysis: string;
    suggestedSuppliers: string[];
    feasibilityScore: number;
}

export default function AdminQuotesPage() {
    const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
    const [filterStatus, setFilterStatus] = useState<QuoteRequest['status'] | 'all'>('all');

    // AI Analysis State
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

    useEffect(() => {
        loadQuotes();
    }, [filterStatus]);

    // Reset analysis when selecting a new quote
    useEffect(() => {
        if (selectedQuote) {
            setAnalysisResult(null);
            setAnalyzing(false);
        }
    }, [selectedQuote]);

    const loadQuotes = async () => {
        setLoading(true);
        try {
            const statusArg = filterStatus === 'all' ? undefined : filterStatus;
            const data = await cms.getQuotes(statusArg);
            setQuotes(data);
        } catch (error) {
            console.error("Failed to load quotes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: QuoteRequest['status']) => {
        try {
            await cms.updateQuote(id, { status: newStatus });
            // Update local state
            setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
            if (selectedQuote && selectedQuote.id === id) {
                setSelectedQuote({ ...selectedQuote, status: newStatus });
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update status");
        }
    };

    const runAnalysis = async () => {
        if (!selectedQuote) return;
        setAnalyzing(true);
        try {
            const response = await fetch('/api/agent/analyze-quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quoteId: selectedQuote.id,
                    details: {
                        customerName: selectedQuote.customerName,
                        company: selectedQuote.company,
                        serviceId: selectedQuote.serviceId,
                        materialId: selectedQuote.materialId,
                        quantity: selectedQuote.quantity,
                        description: `Customer requested ${selectedQuote.quantity} units.`, // Add more context if available
                    }
                })
            });

            if (!response.ok) throw new Error('Analysis failed');

            const result = await response.json();
            setAnalysisResult(result);
        } catch (error) {
            console.error('Analysis error:', error);
            alert('Failed to run AI analysis');
        } finally {
            setAnalyzing(false);
        }
    };

    const sendSupplierQuery = (supplierName: string) => {
        alert(`Simulated: sending query to ${supplierName} for Quote #${selectedQuote?.id}`);
        // In real impl: call API to send email
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const colors: Record<string, string> = {
            pending: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
            reviewing: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
            quoted: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
            accepted: 'text-green-400 border-green-400/30 bg-green-400/10',
            rejected: 'text-red-400 border-red-400/30 bg-red-400/10',
            completed: 'text-gray-400 border-gray-400/30 bg-gray-400/10',
        };

        const className = colors[status] || colors.pending;

        return (
            <span className={`px-2 py-1 rounded text-xs border ${className} uppercase tracking-wider font-medium`}>
                {status}
            </span>
        );
    };

    return (
        <div className={styles.reveal}>
            <header className={styles.headerSection} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <span className={styles.sectionTitle}>Business</span>
                    <h1 className={styles.pageTitle}>Quote Requests</h1>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className={styles.btnSecondary}
                        style={{ appearance: 'auto', paddingRight: '12px' }}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="quoted">Quoted</option>
                        <option value="accepted">Accepted</option>
                    </select>
                </div>
            </header>

            <div className={styles.panel}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Company</th>
                            <th>Service</th>
                            <th>Status</th>
                            <th style={{ width: '100px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotes.map((quote) => (
                            <tr key={quote.id}>
                                <td style={{ color: 'var(--bimo-text-secondary)', fontSize: '13px' }}>
                                    {new Date(quote.createdAt).toLocaleDateString()}
                                </td>
                                <td style={{ color: 'var(--bimo-text-primary)' }}>{quote.customerName}</td>
                                <td>{quote.company || '-'}</td>
                                <td>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ccc', fontSize: '13px' }}>
                                        <Box size={14} />
                                        {quote.serviceId}
                                    </span>
                                </td>
                                <td>
                                    <StatusBadge status={quote.status} />
                                </td>
                                <td>
                                    <button className={styles.btnIcon} onClick={() => setSelectedQuote(quote)}>
                                        <Eye size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {quotes.length === 0 && !loading && (
                            <tr>
                                <td colSpan={6} className={styles.emptyState}>
                                    <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                                    No quotes found.
                                </td>
                            </tr>
                        )}
                        {loading && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '48px' }}>
                                    <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto', color: 'var(--bimo-text-disabled)' }} />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {selectedQuote && (
                <>
                    <div
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 90, backdropFilter: 'blur(4px)' }}
                        onClick={() => setSelectedQuote(null)}
                    />
                    <div style={{
                        position: 'fixed', top: 0, right: 0, bottom: 0, width: '600px', maxWidth: '100vw',
                        backgroundColor: '#0a0a0a', borderLeft: '1px solid var(--bimo-border)', zIndex: 100,
                        display: 'flex', flexDirection: 'column',
                        boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
                        animation: 'slideIn 0.3s ease-out'
                    }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid var(--bimo-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--bimo-text-primary)' }}>
                                    Quote #{selectedQuote.id?.slice(-6).toUpperCase()}
                                </h2>
                                <p style={{ fontSize: '12px', color: 'var(--bimo-text-disabled)', marginTop: '4px' }}>
                                    Received {new Date(selectedQuote.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <button onClick={() => setSelectedQuote(null)} className={styles.btnIcon}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                                {/* AI Agent Section */}
                                <section className="p-5 rounded-xl bg-gradient-to-br from-blue-900/10 to-purple-900/10 border border-blue-500/10 relative overflow-hidden">
                                    {/* Background Decor */}
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Brain size={120} />
                                    </div>

                                    <div className="flex items-center gap-2 mb-4 text-blue-400 font-medium relative z-10">
                                        <Sparkles size={16} />
                                        <span>AI Feasibility Analysis</span>
                                    </div>

                                    {!analysisResult ? (
                                        <>
                                            <p className="text-sm text-gray-400 mb-6 relative z-10 max-w-sm">
                                                Use Bimo Agent to analyze manufacturing feasibility, estimate costs, and match with the best suppliers.
                                            </p>
                                            <button
                                                onClick={runAnalysis}
                                                disabled={analyzing}
                                                className="relative z-10 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {analyzing ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                                                {analyzing ? 'Analyzing Request...' : 'Run Smart Analysis'}
                                            </button>
                                        </>
                                    ) : (
                                        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-full border-4 ${analysisResult.feasibilityScore > 80 ? 'border-green-500/50 text-green-400' :
                                                    analysisResult.feasibilityScore > 50 ? 'border-yellow-500/50 text-yellow-400' : 'border-red-500/50 text-red-400'
                                                    } bg-black/40`}>
                                                    <span className="text-lg font-bold">{analysisResult.feasibilityScore}%</span>
                                                    <span className="text-[9px] uppercase tracking-wider opacity-70">Match</span>
                                                </div>
                                                <p className="text-sm text-gray-300 bg-black/20 p-3 rounded border border-white/5 flex-1 leading-relaxed">
                                                    {analysisResult.analysis}
                                                </p>
                                            </div>

                                            {analysisResult.suggestedSuppliers.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className="text-xs text-gray-500 uppercase tracking-widest mb-2">Recommended Suppliers</h4>
                                                    <div className="space-y-2">
                                                        {analysisResult.suggestedSuppliers.map((sup, idx) => (
                                                            <div key={idx} className="flex justify-between items-center bg-black/30 p-2 rounded border border-white/5">
                                                                <span className="text-sm text-gray-300">{sup}</span>
                                                                <button
                                                                    onClick={() => sendSupplierQuery(sup)}
                                                                    className="text-xs flex items-center gap-1.5 text-blue-400 hover:text-blue-300 px-2 py-1 hover:bg-blue-500/10 rounded transition-colors"
                                                                >
                                                                    <Send size={12} />
                                                                    Diff & Query
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </section>

                                {/* Project Details */}
                                <section>
                                    <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--bimo-text-disabled)', marginBottom: '16px' }}>
                                        Project Specifications
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 p-3 rounded border border-white/10">
                                            <label className="block text-xs text-gray-500 mb-1">Service</label>
                                            <div className="text-white text-sm">{selectedQuote.serviceId}</div>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded border border-white/10">
                                            <label className="block text-xs text-gray-500 mb-1">Material</label>
                                            <div className="text-white text-sm">{selectedQuote.materialId}</div>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded border border-white/10">
                                            <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                                            <div className="text-white text-sm">{selectedQuote.quantity} pcs</div>
                                        </div>
                                    </div>
                                </section>

                                {/* Customer Info */}
                                <section>
                                    <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--bimo-text-disabled)', marginBottom: '16px' }}>
                                        Customer
                                    </h3>
                                    <div className="bg-white/5 p-4 rounded border border-white/10 space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 text-sm">Name</span>
                                            <span className="text-white text-sm font-medium">{selectedQuote.customerName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 text-sm">Email</span>
                                            <span className="text-white text-sm font-medium">{selectedQuote.customerEmail}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 text-sm">Company</span>
                                            <span className="text-white text-sm font-medium">{selectedQuote.company || '-'}</span>
                                        </div>
                                        {selectedQuote.customerPhone && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500 text-sm">Phone</span>
                                                <span className="text-white text-sm font-medium">{selectedQuote.customerPhone}</span>
                                            </div>
                                        )}
                                    </div>
                                </section>

                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div style={{ padding: '24px', borderTop: '1px solid var(--bimo-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0a0a' }}>
                            <div className="flex gap-2">
                                <span className="text-xs text-gray-500 uppercase tracking-widest mr-2 pt-2">Mark as:</span>
                                <button
                                    onClick={() => handleStatusUpdate(selectedQuote.id!, 'reviewing')}
                                    className={`px-3 py-1 text-xs rounded border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 ${selectedQuote.status === 'reviewing' ? 'bg-blue-500/20' : ''}`}
                                >
                                    Reviewing
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(selectedQuote.id!, 'quoted')}
                                    className={`px-3 py-1 text-xs rounded border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 ${selectedQuote.status === 'quoted' ? 'bg-purple-500/20' : ''}`}
                                >
                                    Quoted
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
