"use client";

import { useState } from 'react';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <main style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <section style={{ paddingTop: '140px', paddingBottom: '80px' }}>
        <div className="container-main">
          <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#666', textTransform: 'uppercase', marginBottom: '24px' }}>
            Contact
          </p>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, lineHeight: 1.1, maxWidth: '800px', marginBottom: '32px' }}>
            Let's discuss your 
            <span style={{ color: '#666' }}> requirements</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#888', maxWidth: '600px', lineHeight: 1.6 }}>
            Whether you need standard materials or custom solutions, our team is ready to help.
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section style={{ padding: '60px 0', borderTop: '1px solid #222' }}>
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '80px' }}>
            {/* Form */}
            <div>
              <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#666', textTransform: 'uppercase', marginBottom: '32px' }}>
                Send a message
              </p>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Name
                    </label>
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                    <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Email
                    </label>
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                    <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Company
                    </label>
                    <input 
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
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
                    <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Subject
                    </label>
                    <select 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
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
                  <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Message
                  </label>
                  <textarea 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
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
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    padding: '16px 32px', 
                    border: '1px solid #fff',
                    background: 'transparent',
                    color: '#fff',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Send message <ArrowRight size={18} />
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#666', textTransform: 'uppercase', marginBottom: '32px' }}>
                Direct contact
              </p>
              <div style={{ marginBottom: '48px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Mail size={18} style={{ color: '#555' }} />
                  <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase' }}>Email</span>
                </div>
                <a href="mailto:info@bimotech.pl" style={{ fontSize: '28px', fontWeight: 300 }}>
                  info@bimotech.pl
                </a>
              </div>
              <div style={{ marginBottom: '48px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Phone size={18} style={{ color: '#555' }} />
                  <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase' }}>Phone</span>
                </div>
                <a href="tel:+48123456789" style={{ fontSize: '28px', fontWeight: 300 }}>
                  +48 123 456 789
                </a>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <MapPin size={18} style={{ color: '#555' }} />
                  <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase' }}>Address</span>
                </div>
                <p style={{ fontSize: '22px', fontWeight: 300, lineHeight: 1.5 }}>
                  Bimo Tech Sp. z o.o.<br />
                  ul. Pawińskiego 5B<br />
                  02-106 Warsaw, Poland
                </p>
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
              <p style={{ fontSize: '48px', fontWeight: 300, marginBottom: '12px' }}>24h</p>
              <p style={{ fontSize: '14px', color: '#666' }}>Typical response time for general inquiries</p>
            </div>
            <div>
              <p style={{ fontSize: '48px', fontWeight: 300, marginBottom: '12px' }}>48h</p>
              <p style={{ fontSize: '14px', color: '#666' }}>For technical quotes and specifications</p>
            </div>
            <div>
              <p style={{ fontSize: '48px', fontWeight: 300, marginBottom: '12px' }}>1 week</p>
              <p style={{ fontSize: '14px', color: '#666' }}>For custom engineering proposals</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
