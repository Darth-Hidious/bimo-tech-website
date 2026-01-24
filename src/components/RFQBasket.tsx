"use client";

import { useState } from 'react';
import { X, Trash2, Plus, Upload, Send, ShoppingCart, FileText } from 'lucide-react';
import { useRFQ, RFQItem } from '@/context/RFQContext';
import { useLanguage } from '@/context/LanguageContext';

export default function RFQBasket() {
  const { t } = useLanguage();
  const {
    session,
    removeItem,
    updateItem,
    clearBasket,
    submitRFQ,
    itemCount,
    isBasketOpen,
    setBasketOpen,
    addItem,
  } = useRFQ();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    material: '',
    form: '',
    specification: '',
    quantity: '',
    notes: '',
  });

  const handleSubmit = async () => {
    if (!email || itemCount === 0) return;

    setIsSubmitting(true);
    const success = await submitRFQ(email);
    setIsSubmitting(false);

    if (success) {
      setSubmitSuccess(true);
    }
  };

  const handleAddItem = () => {
    if (!newItem.material || !newItem.quantity) return;

    addItem(newItem);
    setNewItem({
      material: '',
      form: '',
      specification: '',
      quantity: '',
      notes: '',
    });
    setShowAddForm(false);
  };

  if (!isBasketOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => setBasketOpen(false)}
      />

      {/* Modal */}
      <div className="relative bg-[var(--bimo-bg-secondary)] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <ShoppingCart size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-white">{t('rfq.basket')}</h2>
              <p className="text-sm text-gray-400">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={() => setBasketOpen(false)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {submitSuccess ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-green-500" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">{t('rfq.submitSuccess')}</h3>
              <p className="text-gray-400 mb-6">
                We've received your request and will get back to you at {email} within 24-48 hours.
              </p>
              <p className="text-sm text-gray-500">Reference: {session.id.toUpperCase()}</p>
              <button
                onClick={() => {
                  setSubmitSuccess(false);
                  clearBasket();
                  setBasketOpen(false);
                }}
                className="mt-6 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
              >{t('chat.close')}</button>
            </div>) : itemCount === 0 ? (<div className="text-center py-12">
              <ShoppingCart size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">{t('rfq.emptyBasket')}</h3>
              <p className="text-gray-400 text-sm mb-6">{t('rfq.addFromChat')}</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 border border-white/20 text-white rounded-full font-medium hover:bg-white/10 transition-colors inline-flex items-center gap-2"
              >
                <Plus size={18} />{t('rfq.addItem')}</button>
            </div>) : (<div className="space-y-4">
              {/* Items list */}
              {session.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{item.material}</h4>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">{t('rfq.form')}</span>
                          <input
                            type="text"
                            value={item.form}
                            onChange={(e) => updateItem(item.id, { form: e.target.value })}
                            placeholder="e.g., Sheet, Rod, Wire"
                            className="bg-transparent border-b border-white/20 text-white focus:border-white outline-none w-full"
                          />
                        </div>
                        <div>
                          <span className="text-gray-500">{t('rfq.specification')}</span>
                          <input
                            type="text"
                            value={item.specification}
                            onChange={(e) => updateItem(item.id, { specification: e.target.value })}
                            placeholder="e.g., 0.5mm x 100mm"
                            className="bg-transparent border-b border-white/20 text-white focus:border-white outline-none w-full"
                          />
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">{t('rfq.quantity')}</span>
                          <input
                            type="text"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, { quantity: e.target.value })}
                            placeholder="e.g., 50 kg, 100 pcs"
                            className="bg-transparent border-b border-white/20 text-white focus:border-white outline-none w-full"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors ml-4"
                    >
                      <Trash2 size={18} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add more button */}
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full py-3 border border-dashed border-white/20 rounded-xl text-gray-400 hover:border-white/40 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={18} />{t('rfq.addAnother')}</button>
            </div>
          )}

          {/* Add item form */}
          {showAddForm && (
            <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
              <h4 className="font-medium text-white mb-4">{t('rfq.addNew')}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">{t('rfq.material')}</label>
                  <input
                    type="text"
                    value={newItem.material}
                    onChange={(e) => setNewItem({ ...newItem, material: e.target.value })}
                    placeholder="e.g., Tungsten, Titanium"
                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">{t('rfq.form')}</label>
                  <input
                    type="text"
                    value={newItem.form}
                    onChange={(e) => setNewItem({ ...newItem, form: e.target.value })}
                    placeholder="e.g., Sheet, Rod, Powder"
                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">{t('rfq.specification')}</label>
                  <input
                    type="text"
                    value={newItem.specification}
                    onChange={(e) => setNewItem({ ...newItem, specification: e.target.value })}
                    placeholder="e.g., 0.5mm thick, 99.95% purity"
                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">{t('rfq.quantity')}</label>
                  <input
                    type="text"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    placeholder="e.g., 50 kg, 100 pcs"
                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-white outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-400 block mb-1">Notes</label>
                  <textarea
                    value={newItem.notes}
                    onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                    placeholder="Any additional requirements..."
                    rows={2}
                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-white outline-none resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleAddItem}
                  disabled={!newItem.material || !newItem.quantity}
                  className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >{t('rfq.addItem')}</button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                >Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Footer with submit */}
        {itemCount > 0 && !submitSuccess && (<div className="p-6 border-t border-white/10 bg-white/5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-400 block mb-2">Your email for quote delivery</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-white outline-none"
              />
            </div>
            <div className="flex items-end gap-3">
              <button
                onClick={() => clearBasket()}
                className="px-4 py-3 border border-white/20 text-gray-400 rounded-lg hover:text-white hover:border-white/40 transition-colors"
              >Clear</button>
              <button
                onClick={handleSubmit}
                disabled={!email || isSubmitting}
                className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>Submitting...</>) : (<>
                    <Send size={18} />{t('rfq.submit')}</>
                )}
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">We typically respond within 24-48 hours with pricing and availability.</p>
        </div>
        )}
      </div>
    </div>
  );
}


