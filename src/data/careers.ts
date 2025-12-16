export interface JobPosition {
  id: string;
  title: string;
  department: 'Engineering' | 'Research' | 'Operations' | 'Business';
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  description: string;
  requirements: string[];
  responsibilities: string[];
  niceToHave?: string[];
}

export const jobPositions: JobPosition[] = [
  {
    id: 'materials-engineer',
    title: 'Materials Engineer',
    department: 'Engineering',
    location: 'Wrocław, Poland',
    type: 'Full-time',
    description: 'Join our materials engineering team working on cutting-edge refractory metals and high-entropy alloys (HEAs) for space applications. Work directly on ESA-funded projects pushing the boundaries of materials science.',
    requirements: [
      'MSc in Materials Science, Metallurgy, or related field',
      '3+ years of experience in materials engineering',
      'Strong knowledge of refractory metals and metallurgy',
      'Experience with materials characterization techniques',
      'Proficiency in English (written and spoken)',
    ],
    responsibilities: [
      'Develop and optimize refractory metal and HEA compositions',
      'Conduct materials testing and characterization',
      'Collaborate with ESA project teams',
      'Document research findings and technical reports',
      'Support production scale-up activities',
    ],
    niceToHave: [
      'ESA or aerospace project experience',
      'Knowledge of additive manufacturing processes',
      'Experience with high-temperature materials',
      'Publications in materials science journals',
    ],
  },
  {
    id: 'am-specialist',
    title: 'Additive Manufacturing Specialist',
    department: 'Engineering',
    location: 'Wrocław, Poland',
    type: 'Full-time',
    description: 'Lead our additive manufacturing initiatives focusing on Cold Gas Spray technology and powder metallurgy. Help us revolutionize space component manufacturing with advanced AM techniques.',
    requirements: [
      'Bachelor\'s or Master\'s degree in Engineering or related field',
      'Experience with additive manufacturing technologies',
      'Proficiency in CAD/CAM software',
      'Knowledge of powder metallurgy processes',
      'Understanding of materials science fundamentals',
    ],
    responsibilities: [
      'Operate and maintain Cold Gas Spray equipment',
      'Develop AM process parameters for new materials',
      'Design and optimize component geometries for AM',
      'Conduct quality control and process validation',
      'Collaborate with design and materials teams',
    ],
    niceToHave: [
      'Experience with Cold Gas Spray technology',
      'Knowledge of post-processing techniques',
      'Familiarity with aerospace manufacturing standards',
      'Experience with topology optimization',
    ],
  },
  {
    id: 'qa-manager',
    title: 'Quality Assurance Manager',
    department: 'Operations',
    location: 'Wrocław, Poland',
    type: 'Full-time',
    description: 'Establish and maintain world-class quality management systems for our aerospace and defense manufacturing operations. Ensure compliance with ISO 9001, AS9100, and other critical certifications.',
    requirements: [
      'Bachelor\'s degree in Engineering, Quality Management, or related field',
      '5+ years in quality assurance role',
      'Deep understanding of ISO 9001 and AS9100 standards',
      'Experience in aerospace or defense industry',
      'Strong analytical and problem-solving skills',
      'Excellent communication and leadership abilities',
    ],
    responsibilities: [
      'Develop and implement quality management systems',
      'Lead ISO 9001 and AS9100 certification processes',
      'Conduct internal audits and manage corrective actions',
      'Train staff on quality procedures and standards',
      'Interface with customer quality representatives',
      'Manage non-conformance and continuous improvement initiatives',
    ],
    niceToHave: [
      'Certified Quality Auditor (CQA) or similar certification',
      'Experience with aerospace material specifications',
      'Knowledge of statistical process control',
      'Familiarity with ESA or NASA quality requirements',
    ],
  },
  {
    id: 'business-dev-manager',
    title: 'Business Development Manager',
    department: 'Business',
    location: 'Remote / Wrocław, Poland',
    type: 'Full-time',
    description: 'Drive our growth in the space and defense sectors. Build strategic partnerships and secure funding from ESA, EU programs, and commercial customers. Shape the future of space infrastructure.',
    requirements: [
      'Bachelor\'s degree in Business, Engineering, or related field',
      '5+ years in business development or sales',
      'Strong network in space or defense industry',
      'Excellent presentation and negotiation skills',
      'Ability to understand technical products and applications',
      'Fluent in English; additional European languages a plus',
    ],
    responsibilities: [
      'Identify and pursue new business opportunities',
      'Build relationships with ESA, EU agencies, and commercial clients',
      'Prepare proposals and funding applications',
      'Represent company at industry conferences and events',
      'Collaborate with technical teams on customer requirements',
      'Develop market analysis and competitive intelligence',
    ],
    niceToHave: [
      'Experience with ESA or EU funding programs',
      'Existing relationships with space agencies',
      'Technical background in aerospace or materials',
      'MBA or advanced degree',
    ],
  },
  {
    id: 'research-scientist',
    title: 'Research Scientist',
    department: 'Research',
    location: 'Wrocław, Poland',
    type: 'Full-time',
    description: 'Conduct groundbreaking research in high-entropy alloys and advanced materials for extreme environments. Publish cutting-edge work while contributing to real-world space applications.',
    requirements: [
      'PhD in Physics, Materials Science, Metallurgy, or related field',
      'Strong publication record in peer-reviewed journals',
      'Expertise in high-entropy alloys or related materials',
      'Proficiency with materials characterization techniques (SEM, XRD, etc.)',
      'Strong analytical and computational skills',
      'Excellent scientific writing and communication abilities',
    ],
    responsibilities: [
      'Lead research projects on high-entropy alloys',
      'Design and conduct experiments',
      'Analyze and interpret complex materials data',
      'Publish research findings in high-impact journals',
      'Collaborate with academic and industry partners',
      'Mentor junior researchers and engineers',
      'Contribute to grant proposals and funding applications',
    ],
    niceToHave: [
      'Post-doctoral research experience',
      'Experience with computational materials science',
      'Knowledge of thermodynamic modeling',
      'International research collaboration experience',
    ],
  },
  {
    id: 'production-technician',
    title: 'Production Technician',
    department: 'Operations',
    location: 'Wrocław, Poland',
    type: 'Full-time',
    description: 'Work hands-on with advanced manufacturing equipment producing critical components for space applications. Be part of the team that brings innovative materials from lab to launch.',
    requirements: [
      'Technical degree or vocational training in manufacturing/machining',
      '2+ years of hands-on manufacturing experience',
      'Experience with CNC machining operations',
      'Knowledge of metallurgy and material properties',
      'Strong attention to detail and quality consciousness',
      'Ability to read technical drawings and work instructions',
    ],
    responsibilities: [
      'Operate CNC machines and manufacturing equipment',
      'Perform metallurgical processing operations',
      'Conduct in-process quality inspections',
      'Maintain production documentation and records',
      'Follow safety procedures and quality standards',
      'Participate in continuous improvement activities',
    ],
    niceToHave: [
      'Experience in aerospace or defense manufacturing',
      'Welding or joining technology skills',
      'Knowledge of heat treatment processes',
      'Forklift or crane operation certification',
    ],
  },
];

export const companyValues = [
  {
    id: 'innovation',
    title: 'Innovation',
    description: 'We push the boundaries of materials science and manufacturing technology to solve the toughest challenges in space exploration.',
    icon: 'Lightbulb',
  },
  {
    id: 'excellence',
    title: 'Excellence',
    description: 'We maintain the highest standards in everything we do, from research to production, ensuring quality that meets aerospace requirements.',
    icon: 'Award',
  },
  {
    id: 'collaboration',
    title: 'Collaboration',
    description: 'We work together as a team and partner with leading organizations like ESA, bringing diverse perspectives to complex problems.',
    icon: 'Users',
  },
  {
    id: 'sustainability',
    title: 'Sustainability',
    description: 'We develop materials and processes that minimize environmental impact while maximizing performance and longevity.',
    icon: 'Heart',
  },
];

export const benefits = [
  {
    id: 'esa-projects',
    title: 'ESA Projects',
    description: 'Work on real space missions and cutting-edge ESA-funded research programs.',
    icon: 'Rocket',
  },
  {
    id: 'international-team',
    title: 'International Team',
    description: 'Collaborate with experts from 12 countries across Europe and beyond.',
    icon: 'Globe',
  },
  {
    id: 'rd-focus',
    title: 'R&D Focus',
    description: 'Contribute to innovative research with access to state-of-the-art equipment.',
    icon: 'Lightbulb',
  },
  {
    id: 'career-growth',
    title: 'Career Growth',
    description: 'Develop your skills through training, conferences, and mentorship programs.',
    icon: 'TrendingUp',
  },
  {
    id: 'flexible-work',
    title: 'Flexible Work',
    description: 'Enjoy flexible hours and remote work options where applicable.',
    icon: 'Clock',
  },
  {
    id: 'competitive-salary',
    title: 'Competitive Salary',
    description: 'Receive competitive compensation and comprehensive benefits package.',
    icon: 'Award',
  },
];

export const companyStats = [
  {
    value: '30+',
    label: 'Years Heritage',
  },
  {
    value: '12',
    label: 'Countries Served',
  },
  {
    value: '50+',
    label: 'ESA Projects',
  },
];
