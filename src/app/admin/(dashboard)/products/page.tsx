"use client";

import { useState, useEffect } from 'react';
import styles from '../../admin.module.css';
import { cms } from '@/lib/cms/firestoreAdapter';
import type { Product } from '@/lib/cms/types';
import { Plus, Edit2, Trash2, Save, X, ChevronRight, Package, Box, Upload, Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/storageService';
import Image from 'next/image';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        symbol: '',
        description: '',
        category: 'metal',
        imageUrl: '',
        products: []
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await cms.getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Failed to load products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product: Product) => {
        // Ensure defaults for missing fields
        setFormData({
            ...product,
            category: product.category || 'metal',
            products: product.products || []
        });
        setEditingId(product.id);
        setIsCreating(false);
    };

    const handleCreate = () => {
        setFormData({
            name: '',
            symbol: '',
            description: '',
            category: 'metal',
            imageUrl: '',
            products: []
        });
        setEditingId(null);
        setIsCreating(true);
    };

    const handleSave = async () => {
        try {
            if (!formData.name) return alert('Name is required');

            if (isCreating) {
                const id = formData.name.toLowerCase().replace(/\s+/g, '-');
                await cms.createProduct({ ...formData, id } as any);
            } else if (editingId) {
                await cms.updateProduct(editingId, formData);
            }

            await loadProducts();
            setEditingId(null);
            setIsCreating(false);
        } catch (error) {
            console.error("Failed to save:", error);
            alert("Failed to save product");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product family?')) return;
        try {
            await cms.deleteProduct(id);
            await loadProducts();
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    const addSubProduct = (e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        setFormData(prev => {
            const current = prev.products || [];
            return {
                ...prev,
                products: [...current, { name: 'New Form', sizes: 'Standard sizes' }]
            };
        });
    };

    const updateSubProduct = (index: number, field: string, value: string) => {
        setFormData(prev => {
            const current = [...(prev.products || [])];
            if (current[index]) {
                current[index] = { ...current[index], [field]: value };
            }
            return { ...prev, products: current };
        });
    };

    const removeSubProduct = (index: number) => {
        setFormData(prev => {
            const current = [...(prev.products || [])];
            current.splice(index, 1);
            return { ...prev, products: current };
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const path = `products/${Date.now()}_${file.name}`;
            const url = await uploadImage(file, path);
            setFormData(prev => ({ ...prev, imageUrl: url }));
        } catch (error) {
            console.error('Failed to upload image:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={styles.reveal}>
            <header className={styles.headerSection} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <span className={styles.sectionTitle}>Catalog Management</span>
                    <h1 className={styles.pageTitle}>Product Families</h1>
                </div>
                <button onClick={handleCreate} className={styles.btnPrimary}>
                    <Plus size={16} /> Add Product Family
                </button>
            </header>

            <div className={styles.panel}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th style={{ width: '60px' }}>Image</th>
                            <th>Name</th>
                            <th>Symbol</th>
                            <th>Category</th>
                            <th>Forms</th>
                            <th style={{ width: '100px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    {item.imageUrl && (
                                        <div style={{ width: '40px', height: '40px', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
                                            <Image src={item.imageUrl} alt={item.name} fill style={{ objectFit: 'cover' }} />
                                        </div>
                                    )}
                                </td>
                                <td style={{ color: '#fff' }}>{item.name}</td>
                                <td>
                                    <div style={{
                                        width: '32px', height: '32px',
                                        background: 'linear-gradient(135deg, #222, #000)',
                                        borderRadius: '6px', border: '1px solid #333',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#999', fontSize: '12px', fontWeight: 'bold'
                                    }}>
                                        {item.symbol || item.name.charAt(0)}
                                    </div>
                                </td>
                                <td>
                                    {item.category ? (
                                        <span className={`${styles.statusPill} ${item.category === 'metal' ? styles.statusPillSuccess :
                                            item.category === 'plastic' ? styles.statusPillWarning : ''
                                            }`}>
                                            {item.category}
                                        </span>
                                    ) : (
                                        <span className={styles.statusPill} style={{ borderColor: '#333', color: '#666' }}>
                                            —
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', fontSize: '13px' }}>
                                        <Box size={14} />
                                        {item.products?.length || 0} variants
                                    </span>
                                </td>
                                <td>
                                    <button className={styles.btnIcon} onClick={() => handleEdit(item)}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button className={`${styles.btnIcon} ${styles.btnIconDanger}`} onClick={() => handleDelete(item.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && !loading && (
                            <tr>
                                <td colSpan={6} className={styles.emptyState}>
                                    <Package size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                                    No product families found.
                                </td>
                            </tr>
                        )}
                        {loading && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '48px' }}>
                                    <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto', color: '#666' }} />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Editor Sidebar */}
            {(isCreating || editingId) && (
                <>
                    <div
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 90, backdropFilter: 'blur(4px)' }}
                        onClick={() => { setIsCreating(false); setEditingId(null); }}
                    />
                    <div style={{
                        position: 'fixed', top: 0, right: 0, bottom: 0, width: '600px', maxWidth: '100vw',
                        backgroundColor: '#0a0a0a', borderLeft: '1px solid #222', zIndex: 100,
                        display: 'flex', flexDirection: 'column',
                        boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
                        animation: 'slideIn 0.3s ease-out'
                    }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff' }}>
                                {isCreating ? 'New Product Family' : 'Edit Product Family'}
                            </h2>
                            <button onClick={() => { setIsCreating(false); setEditingId(null); }} className={styles.btnIcon}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                                {/* Section 1: Basic Info */}
                                <section>
                                    <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#666', marginBottom: '16px' }}>
                                        General Information
                                    </h3>
                                    <div style={{ display: 'grid', gap: '20px' }}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Family Name</label>
                                            <input
                                                className={styles.formInput}
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="e.g. Tungsten"
                                            />
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Symbol</label>
                                                <input
                                                    className={styles.formInput}
                                                    value={formData.symbol}
                                                    onChange={e => setFormData({ ...formData, symbol: e.target.value })}
                                                    placeholder="e.g. W"
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Category</label>
                                                <select
                                                    className={styles.formInput}
                                                    value={formData.category}
                                                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                                                    style={{ appearance: 'none' }}
                                                >
                                                    <option value="metal">Metal</option>
                                                    <option value="plastic">Plastic</option>
                                                    <option value="composite">Composite</option>
                                                </select>
                                                <div style={{ position: 'absolute', right: '12px', top: '38px', pointerEvents: 'none', color: '#666' }}>
                                                    <ChevronRight size={14} style={{ transform: 'rotate(90deg)' }} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>
                                                Description
                                                <span style={{ fontSize: '9px', background: '#222', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px', color: '#888' }}>
                                                    MDX SUPPORTED
                                                </span>
                                            </label>
                                            <textarea
                                                className={styles.formTextarea}
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Write a clear description..."
                                                style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.5', minHeight: '160px', background: 'rgba(0,0,0,0.3)' }}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Section 2: Visuals */}
                                <section>
                                    <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#666', marginBottom: '16px' }}>
                                        Visuals
                                    </h3>
                                    <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                            <div style={{ width: '120px', height: '120px', background: '#111', borderRadius: '8px', border: '1px dashed #333', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {formData.imageUrl ? (
                                                    <>
                                                        <Image
                                                            src={formData.imageUrl}
                                                            alt="Preview"
                                                            fill
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                        <button
                                                            onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                                                            style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', padding: '4px', borderRadius: '4px', cursor: 'pointer' }}
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <Package size={24} style={{ opacity: 0.2 }} />
                                                )}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px', lineHeight: '1.4' }}>
                                                    Upload a representative image for this material family. Square ratio recommended (e.g. 500x500px).
                                                </p>
                                                <label className={styles.btnSecondary} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                                    {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                                                    {uploading ? 'Uploading...' : 'Choose Image'}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        style={{ display: 'none' }}
                                                        disabled={uploading}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 3: Forms/Variants */}
                                <section>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#666', marginBottom: 0 }}>
                                            Available Forms
                                        </h3>
                                        <button onClick={addSubProduct} style={{ fontSize: '11px', color: '#fff', background: '#222', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                                            + Add Form
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#222', borderRadius: '8px', overflow: 'hidden', border: '1px solid #222' }}>
                                        {(!formData.products || formData.products.length === 0) && (
                                            <div style={{ padding: '24px', textAlign: 'center', background: '#111', color: '#444', fontSize: '14px' }}>
                                                No forms added yet.
                                            </div>
                                        )}
                                        {formData.products?.map((sub, idx) => (
                                            <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#0a0a0a', padding: '12px 16px' }}>
                                                <div style={{ flex: 1 }}>
                                                    <input
                                                        style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', width: '100%', outline: 'none', fontWeight: 500 }}
                                                        value={sub.name}
                                                        onChange={e => updateSubProduct(idx, 'name', e.target.value)}
                                                        placeholder="Form Name"
                                                    />
                                                    <input
                                                        style={{ background: 'transparent', border: 'none', color: '#666', fontSize: '12px', width: '100%', outline: 'none', marginTop: '2px' }}
                                                        value={sub.sizes}
                                                        onChange={e => updateSubProduct(idx, 'sizes', e.target.value)}
                                                        placeholder="Dimensions / Sizes..."
                                                    />
                                                </div>
                                                <button onClick={() => removeSubProduct(idx)} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', padding: '4px' }} title="Remove">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>

                        <div style={{ padding: '24px', borderTop: '1px solid #222', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: '#0a0a0a' }}>
                            <button onClick={() => { setIsCreating(false); setEditingId(null); }} className={styles.btnSecondary} style={{ width: '100px', justifyContent: 'center' }}>
                                Cancel
                            </button>
                            <button onClick={handleSave} className={styles.btnPrimary} style={{ width: '140px', justifyContent: 'center' }}>
                                <Save size={16} /> Save
                            </button>
                        </div>
                    </div>
                    <style jsx global>{`
                        @keyframes slideIn {
                            from { transform: translateX(100%); }
                            to { transform: translateX(0); }
                        }
                    `}</style>
                </>
            )}
        </div>
    );
}
