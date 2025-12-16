// Material data with image support for the products catalog

export interface MaterialImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface MaterialProduct {
  name: string;
  sizes: string;
  standard?: string;
}

export interface Material {
  id: string;
  name: string;
  symbol: string;
  description: string;
  properties: Record<string, string>;
  products: MaterialProduct[];
  alloys: string[];
  applications: string[];
  standards: string[];
  images: MaterialImage[];
  featured?: boolean;
}

export const materials: Material[] = [
  {
    id: 'rhenium',
    name: 'Rhenium',
    symbol: 'Re',
    description: 'Rhenium is a heavy refractory transition metal with a melting point of 3180°C. It has the highest modulus of elasticity of all heat-resistant metals (420 GPa) and excellent mechanical properties at high temperatures.',
    properties: {
      density: '21.04 g/cm³',
      meltingPoint: '3180°C',
      thermalConductivity: '39.6 W/m·K at 20°C',
      thermalExpansion: '6.8 μm/m·K (20-1000°C)',
      electricalResistivity: '0.193 μΩ·m at 20°C',
      tensileModulus: '460 GPa',
    },
    products: [
      { name: 'Sheets, Flat Bars, Foils, Strips', sizes: '0.05mm ~ 65mm thick × Width max. 600mm × Length max. 10000mm' },
      { name: 'Rods - Round and Rectangular', sizes: 'Ø3mm ~ 350mm × Length max. 6000mm' },
      { name: 'Wires', sizes: 'Ø0.01mm min ~ 5mm' },
      { name: 'Tubes', sizes: 'Wall 0.15 ~ 30mm × Ø3 ~ 400mm × Length max. 6000mm' },
      { name: 'Bolts, Nuts, Washers, Threaded Rods', sizes: 'From Ø5, length max. 2000mm' },
    ],
    alloys: ['Pure Rhenium 99.95%+', 'Mo-Re 41%', 'Mo-Re 44.5%', 'Mo-Re 47.5%', 'W-Re 3%', 'W-Re 5%', 'W-Re 25%', 'W-Re 26%'],
    applications: ['Satellite positioning nozzles', 'Aerospace propulsion', 'Thermocouples', 'High-temperature furnace components', 'Welding applications', 'Electronics'],
    standards: ['DIN 84', 'DIN 912', 'DIN 933', 'DIN 934', 'DIN 963', 'DIN 125', 'DIN 975', 'ISO 1207', 'ISO 4762', 'ISO 4017'],
    images: [
      { src: '/products/rhenium/rhenium-pellets.jpg', alt: 'Rhenium pellets', caption: 'High-purity rhenium pellets' },
      { src: '/products/rhenium/rhenium-sheet.jpg', alt: 'Rhenium sheet', caption: 'Rhenium sheet for aerospace applications' },
      { src: '/products/rhenium/rhenium-wire.jpg', alt: 'Rhenium wire', caption: 'Fine rhenium wire' },
    ],
    featured: true,
  },
  {
    id: 'tungsten',
    name: 'Tungsten',
    symbol: 'W',
    description: 'Tungsten has the highest melting point of all elements after carbon (3422°C). It offers excellent mechanical properties at high temperatures, has the lowest coefficient of expansion, and the highest thermal conductivity of all metals.',
    properties: {
      density: '19.35 g/cm³',
      meltingPoint: '3422°C',
      boilingPoint: '5555°C',
      atomicNumber: '74',
      atomicMass: '183.84 u',
      electronConfig: '[Xe] 4f¹⁴ 5d⁴ 6s²',
    },
    products: [
      { name: 'Sheets, Flat Bars, Foils, Strips', sizes: '0.05mm ~ 65mm thick × Width max. 600mm × Length max. 10000mm', standard: 'ASTM B760, GB3875-83' },
      { name: 'Rods - Round and Rectangular', sizes: 'Ø3mm ~ 350mm × Length max. 6000mm', standard: 'ASTM B777-87' },
      { name: 'Electrodes', sizes: 'To customer drawings (pure W, W-Cu, W-La, W with inserts)' },
      { name: 'Wires (black and clean)', sizes: 'Ø0.01mm min ~ 5mm' },
      { name: 'Tubes', sizes: 'Wall 0.15 ~ 30mm × Ø3 ~ 400mm × Length max. 6000mm' },
      { name: 'Crucibles', sizes: 'To customer specifications' },
      { name: 'Powders', sizes: 'To customer specifications' },
    ],
    alloys: [
      'Pure Tungsten (min. 99.95%)',
      'W-Cu 90:10, 85:15, 80:20, 78:22, 75:25, 70:30, 68:32, 55:45',
      'W-Ni alloys',
      'W-Ni-Fe (90/7/3%, 92.5/5.25/2.25%, 95/3.5/1.5%, 97/2.1/0.9%)',
      'W-Re (W-3%Re, W-25%Re)',
      'WC (Tungsten Carbide)',
    ],
    applications: [
      'Furnace elements', 'Semiconductors', 'Base plates', 'Electron tube components',
      'Heating elements', 'Sputtering targets', 'X-ray diagnostics targets',
      'X-ray shields', 'Crucibles', 'Electrodes', 'Weights and ballasts',
    ],
    standards: ['ASTM B760', 'ASTM B777-87', 'GB3875-83', 'DIN standards'],
    images: [
      { src: '/products/tungsten/tungsten-rod.jpg', alt: 'Tungsten rod', caption: 'Polished tungsten rod' },
      { src: '/products/tungsten/tungsten-sheet.jpg', alt: 'Tungsten sheet', caption: 'Tungsten sheet stock' },
      { src: '/products/tungsten/tungsten-crucible.jpg', alt: 'Tungsten crucible', caption: 'Custom tungsten crucible' },
      { src: '/products/tungsten/tungsten-electrode.jpg', alt: 'Tungsten electrode', caption: 'Tungsten welding electrodes' },
    ],
    featured: true,
  },
  {
    id: 'titanium',
    name: 'Titanium',
    symbol: 'Ti',
    description: 'Titanium combines high strength, stiffness, low density, and excellent corrosion resistance. Pure titanium and titanium alloys have tensile strengths of 210-1380 MPa, equivalent to most alloy steels but 40% lighter.',
    properties: {
      density: '4.51 g/cm³ (Grade 1-4), 4.42 g/cm³ (Grade 5)',
      meltingPoint: '1725°C',
      tensileStrength: '240-1300 MPa (depending on grade)',
      biocompatibility: 'Excellent - non-toxic, non-allergenic',
    },
    products: [
      { name: 'Sheets, Strips, Foils (Cold Rolled)', sizes: '0.02mm ~ 5mm thick × Width up to 1200mm', standard: 'ASTM B265' },
      { name: 'Sheets (Hot Rolled)', sizes: '5mm ~ 80mm thick × Width up to 3000mm', standard: 'ASME SB-265' },
      { name: 'Rods - Round and Rectangular', sizes: 'Ø3mm ~ 350mm × Length up to 6000mm', standard: 'ASTM B348' },
      { name: 'Wires', sizes: 'From Ø0.05mm', standard: 'ASTM B863' },
      { name: 'Tubes (Seamless)', sizes: 'Ø4-115mm × Wall 0.2 ~ 8mm', standard: 'ASTM B337' },
      { name: 'Medical Grade Components', sizes: 'To specification', standard: 'ASTM F136, F67' },
    ],
    alloys: [
      'Grade 1 (CP) - Highest formability',
      'Grade 2 (CP) - Most popular',
      'Grade 5 (Ti6Al4V) - Aerospace, medical',
      'Grade 7 (Ti-IIPd) - Chemical processing',
      'Grade 23 (Ti6Al4V ELI) - Medical implants',
      'TiNi (Nitinol) - Shape memory alloy',
    ],
    applications: [
      'Medical implants', 'Aerospace', 'Heat exchangers',
      'Chemical industry', 'Marine applications', 'Architecture',
    ],
    standards: ['ASTM B265', 'ASTM B348', 'ASTM F136', 'ASTM F67', 'ISO 5832-2'],
    images: [
      { src: '/products/titanium/titanium-sheet.jpg', alt: 'Titanium sheet', caption: 'Grade 2 titanium sheet' },
      { src: '/products/titanium/titanium-rod.jpg', alt: 'Titanium rod', caption: 'Ti6Al4V titanium rod' },
      { src: '/products/titanium/titanium-medical.jpg', alt: 'Medical titanium', caption: 'Medical grade titanium components' },
    ],
    featured: true,
  },
  {
    id: 'molybdenum',
    name: 'Molybdenum',
    symbol: 'Mo',
    description: 'Molybdenum has one of the highest melting points of all elements, with density only 25% greater than iron. It has the lowest coefficient of thermal expansion of all structural materials.',
    properties: {
      density: '10.2 g/cm³',
      meltingPoint: '2623°C',
      thermalExpansion: 'Lowest of structural materials',
      thermalConductivity: 'Very high',
    },
    products: [
      { name: 'Sheets, Flat Bars, Foils, Strips', sizes: 'Min. 0.02mm thick × Width max. 1000mm', standard: 'ASTM B386' },
      { name: 'Rods - Round and Rectangular', sizes: 'Ø3mm ~ 350mm × Length max. 6000mm', standard: 'ASTM B387' },
      { name: 'Wires', sizes: 'Ø0.01mm min ~ 5mm', standard: 'ASTM B387' },
      { name: 'Boats and Crucibles', sizes: 'To customer specifications' },
      { name: 'Electrodes', sizes: 'To customer specifications' },
    ],
    alloys: [
      'Pure Molybdenum (min. 99.95%)',
      'Mo-Cu alloys',
      'TZM (Mo99-Ti0.5-Zr0.08-C0.02)',
      'Mo-Re (5%, 41%, 47%, 50%)',
    ],
    applications: [
      'Heating elements', 'X-ray anodes',
      'Glass melting electrodes', 'Semiconductor heat sinks',
      'Rocket engine components',
    ],
    standards: ['ASTM B386', 'ASTM B387'],
    images: [
      { src: '/products/molybdenum/molybdenum-sheet.jpg', alt: 'Molybdenum sheet', caption: 'Molybdenum sheet' },
      { src: '/products/molybdenum/molybdenum-crucible.jpg', alt: 'Molybdenum crucible', caption: 'Molybdenum boat crucible' },
    ],
    featured: false,
  },
  {
    id: 'nickel',
    name: 'Nickel',
    symbol: 'Ni',
    description: 'Pure nickel is resistant to corrosion, particularly to reducing chemicals and alkalis. Nickel has high electrical conductivity, high Curie temperature, and good thermal conductivity.',
    properties: {
      density: '8.89 g/cm³',
      meltingRange: '1435-1446°C',
      tensileStrength: '450 MPa (annealed)',
      curieTemperature: '360°C',
    },
    products: [
      { name: 'Sheets, Strips, Foils', sizes: '0.02mm ~ 80mm thick', standard: 'ASTM B162' },
      { name: 'Rods', sizes: 'Ø3mm ~ 350mm', standard: 'N02200, N02201' },
      { name: 'Tubes', sizes: 'Various', standard: 'ASTM B161' },
      { name: 'Sputtering Targets', sizes: 'Ni/Cr, Ni/V compositions' },
    ],
    alloys: [
      'Pure Nickel 99.99%', 'Nickel 200/201',
      'Inconel 600, 601, 625, 718, X-750',
      'Hastelloy C-22, C-276, C-2000, X',
      'Monel 400, K-500',
      'Nimonic 75, 80A, 90, 263',
    ],
    applications: [
      'Chemical processing', 'Electronics',
      'Heat exchangers', 'Batteries',
    ],
    standards: ['N02200', 'N02201', 'ASTM B162', 'ASTM B161'],
    images: [
      { src: '/products/nickel/nickel-sheet.jpg', alt: 'Nickel sheet', caption: 'Pure nickel sheet' },
      { src: '/products/nickel/inconel.jpg', alt: 'Inconel alloy', caption: 'Inconel 625 components' },
    ],
    featured: true,
  },
  {
    id: 'sputtering-targets',
    name: 'Sputtering Targets (PVD)',
    symbol: 'PVD',
    description: 'Complete line of sputtering targets, from commercial grade to ultra-pure (4N-7N). For all thin-film applications including semiconductor, optical, and decorative coatings.',
    properties: {
      purity: '99.99% to 99.99999% (4N-7N)',
      formats: 'Bonded or unbonded',
      shapes: 'Flat (disks, rectangles), rotary',
    },
    products: [
      { name: 'Pure Metal Targets', sizes: 'Al, Ti, W, Mo, Ta, Nb, Cr, Cu, Ni, and 50+ more elements' },
      { name: 'Alloy Targets', sizes: 'AlCu, AlCr, CoCr, NiCr, TiAl, WTi, and 100+ compositions' },
      { name: 'Oxide Targets', sizes: 'Al2O3, ITO, ZnO, TiO2, SiO2, and more' },
      { name: 'Nitride Targets', sizes: 'AlN, TiN, TaN, Si3N4' },
      { name: 'Custom Targets', sizes: 'CIGS, IGZO, YBCO, and specialty compositions' },
    ],
    alloys: [
      'All pure metals', 'Binary/ternary alloys',
      'Oxides', 'Nitrides', 'Carbides', 'Borides',
    ],
    applications: [
      'Semiconductors', 'Solar cells', 'Optical coatings',
      'Architectural glass', 'Display manufacturing',
    ],
    standards: ['Semiconductor industry standards'],
    images: [
      { src: '/products/targets/sputtering-target.jpg', alt: 'Sputtering target', caption: 'High-purity sputtering target' },
      { src: '/products/targets/ito-target.jpg', alt: 'ITO target', caption: 'ITO target for displays' },
    ],
    featured: true,
  },
];

// Helper function to get material by ID
export function getMaterialById(id: string): Material | undefined {
  return materials.find(m => m.id === id);
}

// Helper function to get featured materials
export function getFeaturedMaterials(): Material[] {
  return materials.filter(m => m.featured);
}

// Helper function to search materials
export function searchMaterials(query: string): Material[] {
  const lowercaseQuery = query.toLowerCase();
  return materials.filter(m => 
    m.name.toLowerCase().includes(lowercaseQuery) ||
    m.symbol.toLowerCase().includes(lowercaseQuery) ||
    m.description.toLowerCase().includes(lowercaseQuery) ||
    m.alloys.some(a => a.toLowerCase().includes(lowercaseQuery)) ||
    m.applications.some(a => a.toLowerCase().includes(lowercaseQuery))
  );
}

