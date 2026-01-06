"use client";

import { useState } from 'react';
import { ArrowRight, Mail, MapPin, Phone, Loader2, CheckCircle } from 'lucide-react';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { cms } from '@/lib/cms/firestoreAdapter';
import type { ContactSubmission } from '@/lib/cms/types';

export default function ContactPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await cms.submitContact({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: Date.now()
      });
      setSuccess(true);
      setFormData({ name: '', email: '', company: '', subject: '', message: '' });
    } catch (e) {
      console.error("Submission failed", e);
      alert("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <section style={{ paddingTop: '140px', paddingBottom: '80px' }}>
        <div className="container-main">
          <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>Contact</p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 500, lineHeight: 1.1, maxWidth: '800px', marginBottom: '32px' }}>Let's discuss your <span style={{ color: '#888' }}>requirements</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#bbb', maxWidth: '600px', lineHeight: 1.6 }}>Whether you need standard materials or custom solutions, our team is ready to help.</p>
        </div>
      </section>

      {/* Contact Grid */}
      <section style={{ padding: '60px 0', borderTop: '1px solid #222' }}>
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '80px' }}>
            {/* Form */}
            <div>
              <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '32px', fontWeight: 500 }}>Send a message</p>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.15em', color: '#888', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 500 }}>Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid #333',
                        padding: '12px 0',
                        color: '#fff',
                        fontSize: '15px',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.15em', color: '#888', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 500 }}>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid #333',
                        padding: '12px 0',
                        color: '#fff',
                        fontSize: '15px',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.15em', color: '#888', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 500 }}>Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid #333',
                        padding: '12px 0',
                        color: '#fff',
                        fontSize: '15px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.15em', color: '#888', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 500 }}>Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid #333',
                        padding: '12px 0',
                        color: '#fff',
                        fontSize: '15px',
                        outline: 'none'
                      }}
                      required
                    >
                      <option value="" style={{ background: '#000' }}>Select...</option>
                      <option value="quote" style={{ background: '#000' }}>Request a quote</option>
                      <option value="technical" style={{ background: '#000' }}>Technical inquiry</option>
                      <option value="partnership" style={{ background: '#000' }}>Partnership</option>
                      <option value="careers" style={{ background: '#000' }}>Careers</option>
                      <option value="other" style={{ background: '#000' }}>Other</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.15em', color: '#888', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 500 }}>Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid #333',
                      padding: '12px 0',
                      color: '#fff',
                      fontSize: '15px',
                      outline: 'none',
                      resize: 'none'
                    }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || success}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 32px',
                    border: '1px solid #fff',
                    background: success ? '#222' : 'transparent',
                    color: success ? '#4ade80' : '#fff',
                    fontSize: '14px',
                    cursor: submitting || success ? 'default' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : success ? <CheckCircle size={18} /> : null}
                  {submitting ? 'Sending...' : success ? 'Message Sent' : 'Send message'}
                  {!submitting && !success && <ArrowRight size={18} />}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '32px', fontWeight: 500 }}>Direct contact</p>
              <div style={{ marginBottom: '48px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Mail size={18} style={{ color: '#888' }} />
                  <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#888', textTransform: 'uppercase', fontWeight: 500 }}>Email</span>
                </div>
                <a href="mailto:info@bimotech.pl" style={{ fontSize: '28px', fontWeight: 500 }}>info@bimotech.pl</a>
              </div>
              <div style={{ marginBottom: '48px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Phone size={18} style={{ color: '#888' }} />
                  <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#888', textTransform: 'uppercase', fontWeight: 500 }}>Phone</span>
                </div>
                <a href="tel:+48123456789" style={{ fontSize: '28px', fontWeight: 500 }}>+48 123 456 789</a>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <MapPin size={18} style={{ color: '#888' }} />
                  <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#888', textTransform: 'uppercase', fontWeight: 500 }}>Address</span>
                </div>
                <p style={{ fontSize: '22px', fontWeight: 500, lineHeight: 1.5 }}>Bimo Tech Sp. z o.o.<br />Francuska 11<br />54-405 Wroclaw, Poland</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Response Time */}
      <section style={{ padding: '80px 0', borderTop: '1px solid #222', backgroundColor: '#0a0a0a' }}>
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px' }}>
            <div>
              <p style={{ fontSize: '48px', fontWeight: 500, marginBottom: '12px' }}>24h</p>
              <p style={{ fontSize: '14px', color: '#999' }}>Typical response time for general inquiries</p>
            </div>
            <div>
              <p style={{ fontSize: '48px', fontWeight: 500, marginBottom: '12px' }}>48h</p>
              <p style={{ fontSize: '14px', color: '#999' }}>For technical quotes and specifications</p>
            </div>
            <div>
              <p style={{ fontSize: '48px', fontWeight: 500, marginBottom: '12px' }}>1 week</p>
              <p style={{ fontSize: '14px', color: '#999' }}>For custom engineering proposals</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
