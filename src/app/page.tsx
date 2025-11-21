"use client";

import { ArrowRight, Box, Newspaper, Briefcase, Mail, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Header from '@/components/Header';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      {/* New Hero Section */}
      <Hero />

      {/* Products & Projects */}
      <section className="py-24 bg-black relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-white">Innovation <span className="text-blue-500">Pipeline</span></h2>
              <p className="text-gray-400 max-w-xl">From deep space infrastructure to autonomous earth-observation agents.</p>
            </div>
            <button className="text-blue-400 flex items-center gap-2 hover:text-blue-300 transition-colors">View all Projects <ChevronRight size={16} /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 hover:bg-white/10 transition-colors group cursor-pointer rounded-xl">
                <div className="mb-6 p-4 bg-blue-500/10 rounded-full w-fit text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Box size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Project Alpha-{i}</h3>
                <p className="text-gray-400 mb-4">Autonomous swarm coordination for orbital debris removal.</p>
                <span className="text-sm text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">Learn more <ArrowRight size={14} /></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Updates */}
      <section className="py-24 bg-[#111] relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-12">
            <Newspaper size={32} className="text-gray-400" />
            <h2 className="text-4xl font-bold text-white">Latest <span className="text-blue-500">Intel</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 flex flex-col justify-between h-[400px] relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <div className="relative z-20 mt-auto">
                <span className="text-xs font-bold bg-blue-500 text-white px-2 py-1 rounded mb-2 inline-block">PRESS RELEASE</span>
                <h3 className="text-3xl font-bold mb-2 text-white">BimoTech Secures Series B Funding</h3>
                <p className="text-gray-300">Accelerating the development of our agentic manufacturing core.</p>
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="text-gray-500 text-sm font-mono">Oct {10 + i}</div>
                  <div>
                    <h4 className="font-bold text-lg text-white">Deployment of Agent-{i} Successful</h4>
                    <p className="text-sm text-gray-400">Operational efficiency increased by 45%.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Careers & Contact */}
      <section className="py-24 bg-black relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 border-l-4 border-l-blue-500">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase size={24} className="text-blue-400" />
                <h2 className="text-3xl font-bold text-white">Join the <span className="text-blue-400">Mission</span></h2>
              </div>
              <p className="text-gray-400 mb-8">
                We are looking for engineers, dreamers, and agentic architects to build the infrastructure of tomorrow.
              </p>
              <button className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors">
                View Open Positions
              </button>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 border-l-4 border-l-orange-500">
              <div className="flex items-center gap-3 mb-6">
                <Mail size={24} className="text-orange-400" />
                <h2 className="text-3xl font-bold text-white">Contact <span className="text-orange-400">HQ</span></h2>
              </div>
              <p className="text-gray-400 mb-8">
                Interested in our technology or partnership opportunities? Reach out to our dedicated agentic interface.
              </p>
              <button className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors">
                Initiate Uplink
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
