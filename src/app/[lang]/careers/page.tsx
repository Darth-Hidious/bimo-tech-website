"use client";

import { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  Rocket,
  Globe,
  Lightbulb,
  Award,
  Heart,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Mail,
} from 'lucide-react';
import Header from '@/components/Header';
import { jobPositions, companyValues, benefits, companyStats } from '@/data/careers';

type Department = 'All' | 'Engineering' | 'Research' | 'Operations' | 'Business';

const iconMap: Record<string, any> = {
  Lightbulb,
  Award,
  Users,
  Heart,
  Rocket,
  Globe,
  TrendingUp,
  Clock,
};

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('All');
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const departments: Department[] = ['All', 'Engineering', 'Research', 'Operations', 'Business'];

  const filteredJobs =
    selectedDepartment === 'All'
      ? jobPositions
      : jobPositions.filter((job) => job.department === selectedDepartment);

  const toggleJobExpanded = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      Engineering: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      Research: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      Operations: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      Business: 'bg-green-500/10 text-green-400 border-green-500/20',
    };
    return colors[department] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#050505]">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(249,115,22,0.05),transparent_50%)]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Animated title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Join the{' '}
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-orange-400 bg-clip-text text-transparent animate-pulse">
                Mission
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              Help us build the infrastructure for space exploration.
              <br />
              Work on cutting-edge materials that power the future.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {companyStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Company Values Section */}
      <section className="py-24 bg-black relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Our <span className="text-blue-500">Values</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do at Bimo Tech
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyValues.map((value) => {
              const Icon = iconMap[value.icon];
              return (
                <div
                  key={value.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 group"
                >
                  <div className="mb-4 p-4 bg-blue-500/10 rounded-full w-fit text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{value.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-24 bg-[#0a0a0a] relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Open <span className="text-blue-500">Positions</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover opportunities to make an impact in space technology
            </p>
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedDepartment === dept
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Job Listings */}
          <div className="max-w-5xl mx-auto space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">
                  No positions available in this department at the moment.
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300"
                >
                  {/* Job Header */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => toggleJobExpanded(job.id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-2xl font-bold text-white">{job.title}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDepartmentColor(
                              job.department
                            )}`}
                          >
                            {job.department}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>{job.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30">
                          Apply Now
                        </button>
                        <button className="p-3 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-colors">
                          {expandedJob === job.id ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Job Details */}
                  {expandedJob === job.id && (
                    <div className="px-6 pb-6 border-t border-white/10 pt-6">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">
                            About the Role
                          </h4>
                          <p className="text-gray-300 leading-relaxed">{job.description}</p>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">
                            Requirements
                          </h4>
                          <ul className="space-y-2">
                            {job.requirements.map((req, index) => (
                              <li key={index} className="flex items-start gap-3 text-gray-300">
                                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">
                            Responsibilities
                          </h4>
                          <ul className="space-y-2">
                            {job.responsibilities.map((resp, index) => (
                              <li key={index} className="flex items-start gap-3 text-gray-300">
                                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {job.niceToHave && job.niceToHave.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-3">
                              Nice to Have
                            </h4>
                            <ul className="space-y-2">
                              {job.niceToHave.map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-300">
                                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="pt-4">
                          <button className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30 flex items-center gap-2">
                            Apply for this Position
                            <ArrowRight size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-black relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Why <span className="text-blue-500">Bimo Tech</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Exceptional benefits and opportunities for professional growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit) => {
              const Icon = iconMap[benefit.icon];
              return (
                <div
                  key={benefit.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 group"
                >
                  <div className="mb-4 p-3 bg-blue-500/10 rounded-lg w-fit text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application CTA Section */}
      <section className="py-24 bg-[#0a0a0a] relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-orange-500/10 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
              <div className="mb-6 inline-flex p-4 bg-blue-500/10 rounded-full text-blue-400">
                <Mail size={48} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Don't See Your <span className="text-blue-500">Role?</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                We're always looking for talented individuals who share our passion for space
                technology and innovation. Send us your resume and let's explore how you can
                contribute to our mission.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2">
                  <Briefcase size={20} />
                  Submit General Application
                </button>
                <button className="px-8 py-4 bg-white/5 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 border border-white/10 flex items-center justify-center gap-2">
                  <Mail size={20} />
                  Contact HR Team
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-12 text-center">
              <p className="text-gray-400 mb-2">Have questions about working at Bimo Tech?</p>
              <a
                href="mailto:careers@bimotech.com"
                className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
              >
                careers@bimotech.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
