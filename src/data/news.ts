export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: 'Awards' | 'Projects' | 'Company News' | 'Partnerships' | 'Certifications' | 'Events';
  featured?: boolean;
  image?: string;
}

export const newsArticles: NewsArticle[] = [
  {
    id: 'esa-first-propulsion-award',
    title: 'ESA FIRST! Propulsion Award',
    excerpt: 'Bimo Tech wins Materials & Processes category with SPARK project for Refractory High-Entropy Alloys in partnership with ArianeGroup.',
    content: `We are proud to announce that Bimo Tech has been awarded the ESA FIRST! Propulsion Award in the Materials & Processes category. This prestigious recognition highlights our groundbreaking work on the SPARK project, focusing on Refractory High-Entropy Alloys (RHEAs).

In collaboration with ArianeGroup, Europe's leading space propulsion manufacturer, we are pushing the boundaries of materials science to develop next-generation alloys capable of withstanding extreme temperatures and conditions in space propulsion systems.

This award validates our commitment to innovation and excellence in advanced materials research and development. The SPARK project represents a significant milestone in our journey to revolutionize aerospace materials through cutting-edge research and strategic partnerships.`,
    date: 'November 2024',
    category: 'Awards',
    featured: true,
  },
  {
    id: 'iter-rhodium-targets-delivery',
    title: 'ITER Rhodium Targets Delivery',
    excerpt: 'Collaboration with Fusion for Energy delivering critical components for nuclear fusion research.',
    content: `Bimo Tech successfully delivered precision-manufactured rhodium targets to the ITER project in collaboration with Fusion for Energy (F4E). These components play a crucial role in advancing nuclear fusion research, bringing humanity one step closer to clean, limitless energy.

The rhodium targets were manufactured to extremely tight specifications using our advanced materials processing capabilities. This delivery demonstrates our expertise in working with precious metals and our commitment to supporting groundbreaking scientific research.

ITER represents one of the most ambitious energy projects in the world, and we are honored to contribute our materials expertise to this historic endeavor. This collaboration reinforces our position as a trusted partner in the nuclear research sector.`,
    date: 'October 2024',
    category: 'Projects',
  },
  {
    id: 'additive-manufacturing-expansion',
    title: 'Additive Manufacturing Expansion',
    excerpt: 'New Cold Gas Spray capabilities and facility expansion in Wrocław enhance our advanced manufacturing portfolio.',
    content: `Bimo Tech announces a significant expansion of our additive manufacturing capabilities with the introduction of Cold Gas Spray (CGS) technology at our Wrocław facility. This investment positions us at the forefront of advanced manufacturing techniques.

Cold Gas Spray technology enables us to deposit high-quality metallic coatings and create complex structures without melting the feedstock material, resulting in superior mechanical properties and reduced oxidation. This capability complements our existing powder metallurgy and advanced processing techniques.

The facility expansion includes state-of-the-art equipment and increased production capacity, allowing us to better serve our clients in aerospace, defense, and energy sectors. This strategic investment reflects our commitment to staying at the cutting edge of materials science and manufacturing technology.`,
    date: 'September 2024',
    category: 'Company News',
  },
  {
    id: 'partnership-ncbj-announced',
    title: 'Partnership with NCBJ Announced',
    excerpt: 'National Centre for Nuclear Research collaboration focuses on defense and energy applications.',
    content: `Bimo Tech is proud to announce a strategic partnership with the National Centre for Nuclear Research (NCBJ), Poland's premier nuclear research institution. This collaboration will focus on developing advanced materials for defense and energy applications.

The partnership leverages NCBJ's world-class research capabilities and our expertise in materials processing and manufacturing. Together, we will work on projects ranging from radiation-resistant materials to advanced energy storage solutions.

This collaboration strengthens Poland's position in advanced materials research and demonstrates our commitment to working with leading scientific institutions. The partnership will facilitate knowledge transfer, joint research projects, and the development of innovative solutions for national and international markets.`,
    date: 'August 2024',
    category: 'Partnerships',
  },
  {
    id: 'iso-9001-2015-recertification',
    title: 'ISO 9001:2015 Recertification',
    excerpt: 'Quality management system renewal demonstrates our continued commitment to excellence.',
    content: `Bimo Tech has successfully completed the recertification process for ISO 9001:2015, the international standard for Quality Management Systems. This achievement underscores our unwavering commitment to maintaining the highest standards of quality in all aspects of our operations.

The rigorous audit process examined our quality management practices, processes, and documentation. The successful recertification confirms that we continue to meet and exceed international quality standards in materials development, manufacturing, and customer service.

This certification is essential for our work with international partners in aerospace, defense, and energy sectors, where quality and reliability are paramount. It demonstrates to our clients and stakeholders that we maintain robust systems for continuous improvement and quality assurance.`,
    date: 'July 2024',
    category: 'Certifications',
  },
  {
    id: 'warsaw-space-info-day-2025',
    title: 'Warsaw Space Info Day 2025',
    excerpt: 'Join us at this exciting space industry event showcasing Polish space capabilities and innovations.',
    content: `Bimo Tech is excited to announce our participation in Warsaw Space Info Day 2025, a premier event bringing together Poland's space industry leaders, researchers, and innovators.

At this event, we will showcase our latest developments in space-grade materials, including our award-winning work on Refractory High-Entropy Alloys and our contributions to major European space programs. Our team will be available to discuss collaboration opportunities and share insights into the future of advanced materials for space applications.

Warsaw Space Info Day provides an excellent platform for networking, knowledge sharing, and exploring new partnerships in Poland's rapidly growing space sector. We look forward to connecting with fellow innovators and demonstrating how advanced materials are enabling the next generation of space exploration.`,
    date: 'December 2024',
    category: 'Events',
  },
];

export const categories = [
  'All',
  'Awards',
  'Projects',
  'Company News',
  'Partnerships',
  'Certifications',
  'Events',
] as const;

export type Category = typeof categories[number];
