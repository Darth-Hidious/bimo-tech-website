"use client";

import { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Building2,
  Send,
  Clock,
  Globe,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Box,
  Newspaper,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';

interface FormData {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would typically send the form data to your API
      console.log('Form submitted:', formData);

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: 'General Inquiry',
        message: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#050505]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, #3b82f6 1px, transparent 1px),
              linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Contact{' '}
              <span className="bg-gradient-to-r from-[#3b82f6] via-[#60a5fa] to-[#f97316] text-transparent bg-clip-text">
                HQ
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Connect with our team for partnerships, inquiries, or technical support
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-40 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </section>

      {/* Contact Cards Row */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Location Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <MapPin size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Location</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Ul. Francuska 11<br />
                    54-405 Wrocław, Poland
                  </p>
                  <a
                    href="https://maps.google.com/?q=Ul.+Francuska+11,+54-405+Wrocław,+Poland"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 text-sm flex items-center gap-1 hover:text-blue-300 transition-colors"
                  >
                    View on map <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <Phone size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Phone</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Call us directly
                  </p>
                  <a
                    href="tel:+48713498967"
                    className="text-blue-400 text-sm flex items-center gap-1 hover:text-blue-300 transition-colors"
                  >
                    +48 71 349 89 67
                  </a>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <Mail size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Email</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Send us a message
                  </p>
                  <a
                    href="mailto:info@bimotech.pl"
                    className="text-orange-400 text-sm flex items-center gap-1 hover:text-orange-300 transition-colors"
                  >
                    info@bimotech.pl
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-black/50 border ${
                        errors.name ? 'border-red-500' : 'border-white/10'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-black/50 border ${
                        errors.email ? 'border-red-500' : 'border-white/10'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Company Field */}
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Your Company"
                    />
                  </div>

                  {/* Subject Dropdown */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Quote Request">Quote Request</option>
                      <option value="Careers">Careers</option>
                    </select>
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full px-4 py-3 bg-black/50 border ${
                        errors.message ? 'border-red-500' : 'border-white/10'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none`}
                      placeholder="Tell us about your project or inquiry..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-3 text-green-400">
                      <CheckCircle2 size={20} />
                      <span>Message sent successfully! We'll get back to you soon.</span>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400">
                      <AlertCircle size={20} />
                      <span>Failed to send message. Please try again later.</span>
                    </div>
                  )}
                </form>
              </div>

              {/* Contact Info & Business Hours */}
              <div className="space-y-6">
                {/* Department Contacts */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Department Contacts</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 group">
                      <div className="p-2 bg-blue-500/10 rounded text-blue-400">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Sales</p>
                        <a href="mailto:sales@bimotech.pl" className="text-white hover:text-blue-400 transition-colors">
                          sales@bimotech.pl
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 group">
                      <div className="p-2 bg-blue-500/10 rounded text-blue-400">
                        <Globe size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Technical Support</p>
                        <a href="mailto:technical@bimotech.pl" className="text-white hover:text-blue-400 transition-colors">
                          technical@bimotech.pl
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 group">
                      <div className="p-2 bg-blue-500/10 rounded text-blue-400">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Careers</p>
                        <a href="mailto:careers@bimotech.pl" className="text-white hover:text-blue-400 transition-colors">
                          careers@bimotech.pl
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 group">
                      <div className="p-2 bg-orange-500/10 rounded text-orange-400">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Investors</p>
                        <a href="mailto:investors@bimotech.pl" className="text-white hover:text-orange-400 transition-colors">
                          investors@bimotech.pl
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock size={24} className="text-blue-400" />
                    <h3 className="text-xl font-bold text-white">Business Hours</h3>
                  </div>
                  <div className="space-y-2 text-gray-400">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="text-white font-medium">8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="text-white font-medium">9:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="text-gray-500">Closed</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    * CET/CEST timezone
                  </p>
                </div>

                {/* Company Info */}
                <div className="bg-gradient-to-br from-blue-500/10 to-orange-500/10 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                  <h3 className="text-xl font-bold text-white mb-4">About Bimo Tech</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Founded in 1992 as BIMO and rebranded as Bimo Tech in 2013, we've been delivering cutting-edge engineering solutions for over three decades. Specializing in aerospace, nuclear, and advanced manufacturing sectors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-[#0a0a0a] relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Visit Our Office</h2>

            {/* Map Placeholder with Embedded Map */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden h-[500px] relative group">
              {/* You can replace this with an actual Google Maps embed or Mapbox */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2505.1234567890!2d17.0334!3d51.1125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDA2JzQ1LjAiTiAxN8KwMDInMDAuMiJF!5e0!3m2!1sen!2spl!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-70 group-hover:opacity-100 transition-opacity"
              />

              {/* Overlay with address */}
              <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-6 max-w-sm">
                <div className="flex items-start gap-4">
                  <MapPin size={24} className="text-blue-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Bimo Tech HQ</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      Ul. Francuska 11<br />
                      54-405 Wrocław, Poland
                    </p>
                    <a
                      href="https://maps.google.com/?q=Ul.+Francuska+11,+54-405+Wrocław,+Poland"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 text-sm flex items-center gap-1 hover:text-blue-300 transition-colors"
                    >
                      Get directions <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-black relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Explore <span className="text-blue-500">More</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Products Link */}
              <Link href="/en/products" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <Box size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Products</h3>
                </div>
                <p className="text-gray-400 mb-4">
                  Discover our innovative engineering solutions and cutting-edge technology products.
                </p>
                <span className="text-blue-400 text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore products <ExternalLink size={14} />
                </span>
              </Link>

              {/* Careers Link */}
              <Link href="/en/careers" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <Briefcase size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Careers</h3>
                </div>
                <p className="text-gray-400 mb-4">
                  Join our team of experts and work on groundbreaking projects in aerospace and engineering.
                </p>
                <span className="text-orange-400 text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View opportunities <ExternalLink size={14} />
                </span>
              </Link>

              {/* News Link */}
              <Link href="/en/news" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <Newspaper size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">News</h3>
                </div>
                <p className="text-gray-400 mb-4">
                  Stay updated with our latest achievements, partnerships, and industry insights.
                </p>
                <span className="text-blue-400 text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read news <ExternalLink size={14} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
