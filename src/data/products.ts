/**
 * Bimo Tech Product Data
 * Comprehensive product catalog for advanced metallic materials and high-precision components
 * for space, defense, energy, and high-temperature industries
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ProductCategory =
  | 'Refractory Metals'
  | 'Sputtering Targets'
  | 'Powders & Nanomaterials'
  | 'Custom Components'
  | 'High-Entropy Alloys';

export type Industry = 'space' | 'defense' | 'energy' | 'medical' | 'industrial';

export interface Specification {
  key: string;
  value: string;
  unit?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  specifications: Specification[];
  applications: string[];
  industries: Industry[];
  imagePath: string;
  featured: boolean;
  certifications: string[];
}

// ============================================================================
// PRODUCT DATA
// ============================================================================

export const products: Product[] = [
  // ==========================================================================
  // REFRACTORY METALS
  // ==========================================================================
  {
    id: 'rm-001',
    name: 'Tungsten (W)',
    category: 'Refractory Metals',
    slug: 'tungsten-w',
    shortDescription: 'Highest melting point metal for extreme temperature applications',
    fullDescription:
      'Premium grade tungsten metal with exceptional thermal and mechanical properties. Ideal for applications requiring extreme temperature resistance, high density, and superior hardness. Our tungsten products meet the stringent requirements of space, defense, and energy sectors.',
    specifications: [
      { key: 'Density', value: '19.3', unit: 'g/cm³' },
      { key: 'Melting Point', value: '3422', unit: '°C' },
      { key: 'Purity', value: '99.95+', unit: '%' },
      { key: 'Thermal Conductivity', value: '173', unit: 'W/m·K' },
      { key: 'Electrical Resistivity', value: '5.6', unit: 'μΩ·cm' },
      { key: 'Hardness', value: '350-400', unit: 'HV' },
    ],
    applications: [
      'Rocket nozzles and thrust chambers',
      'Plasma-facing components',
      'High-temperature furnace components',
      'Radiation shielding',
      'X-ray targets',
      'Electrical contacts',
    ],
    industries: ['space', 'defense', 'energy', 'medical', 'industrial'],
    imagePath: '/images/products/tungsten.jpg',
    featured: true,
    certifications: ['ISO 9001:2015', 'EN 9100', 'ESA Qualified'],
  },
  {
    id: 'rm-002',
    name: 'Molybdenum (Mo)',
    category: 'Refractory Metals',
    slug: 'molybdenum-mo',
    shortDescription: 'High-strength refractory metal with excellent thermal properties',
    fullDescription:
      'High-purity molybdenum with outstanding strength at elevated temperatures and excellent thermal conductivity. Essential for aerospace, defense, and energy applications requiring reliable performance in extreme conditions.',
    specifications: [
      { key: 'Density', value: '10.2', unit: 'g/cm³' },
      { key: 'Melting Point', value: '2623', unit: '°C' },
      { key: 'Purity', value: '99.95+', unit: '%' },
      { key: 'Thermal Conductivity', value: '138', unit: 'W/m·K' },
      { key: 'Coefficient of Thermal Expansion', value: '4.8', unit: '10⁻⁶/K' },
      { key: 'Tensile Strength', value: '500-700', unit: 'MPa' },
    ],
    applications: [
      'Furnace heating elements',
      'Ion implantation components',
      'Glass melting electrodes',
      'Nuclear energy components',
      'Aerospace structural parts',
      'TZM alloy applications',
    ],
    industries: ['space', 'defense', 'energy', 'industrial'],
    imagePath: '/images/products/molybdenum.jpg',
    featured: true,
    certifications: ['ISO 9001:2015', 'EN 9100', 'ASTM B387'],
  },
  {
    id: 'rm-003',
    name: 'Tantalum (Ta)',
    category: 'Refractory Metals',
    slug: 'tantalum-ta',
    shortDescription: 'Corrosion-resistant refractory metal for critical applications',
    fullDescription:
      'Ultra-pure tantalum offering exceptional corrosion resistance and biocompatibility. Widely used in medical devices, chemical processing, and aerospace applications where reliability is paramount.',
    specifications: [
      { key: 'Density', value: '16.6', unit: 'g/cm³' },
      { key: 'Melting Point', value: '3017', unit: '°C' },
      { key: 'Purity', value: '99.95+', unit: '%' },
      { key: 'Corrosion Resistance', value: 'Excellent', unit: '' },
      { key: 'Thermal Conductivity', value: '57', unit: 'W/m·K' },
      { key: 'Biocompatibility', value: 'FDA Approved', unit: '' },
    ],
    applications: [
      'Medical implants and devices',
      'Chemical processing equipment',
      'Capacitor manufacturing',
      'Spacecraft propulsion systems',
      'Superalloy additions',
      'Corrosion-resistant coatings',
    ],
    industries: ['space', 'medical', 'energy', 'industrial'],
    imagePath: '/images/products/tantalum.jpg',
    featured: false,
    certifications: ['ISO 9001:2015', 'ISO 13485', 'ASTM B708', 'ESA Qualified'],
  },
  {
    id: 'rm-004',
    name: 'Niobium (Nb)',
    category: 'Refractory Metals',
    slug: 'niobium-nb',
    shortDescription: 'Lightweight refractory metal for superconducting applications',
    fullDescription:
      'High-purity niobium with excellent superconducting properties and high-temperature strength. Critical for particle accelerators, superconducting magnets, and advanced aerospace applications.',
    specifications: [
      { key: 'Density', value: '8.57', unit: 'g/cm³' },
      { key: 'Melting Point', value: '2477', unit: '°C' },
      { key: 'Purity', value: '99.95+', unit: '%' },
      { key: 'Superconducting Transition', value: '9.2', unit: 'K' },
      { key: 'Thermal Conductivity', value: '53.7', unit: 'W/m·K' },
      { key: 'Tensile Strength', value: '275-345', unit: 'MPa' },
    ],
    applications: [
      'Superconducting RF cavities',
      'Particle accelerator components',
      'Rocket nozzle materials',
      'Steel microalloying',
      'MRI scanner components',
      'High-temperature alloys',
    ],
    industries: ['space', 'defense', 'energy', 'medical', 'industrial'],
    imagePath: '/images/products/niobium.jpg',
    featured: false,
    certifications: ['ISO 9001:2015', 'ASTM B392', 'ESA Qualified'],
  },
  {
    id: 'rm-005',
    name: 'Tungsten Carbide (WC)',
    category: 'Refractory Metals',
    slug: 'tungsten-carbide-wc',
    shortDescription: 'Ultra-hard composite material for extreme wear applications',
    fullDescription:
      'Premium tungsten carbide composites combining extreme hardness with high temperature stability. Ideal for cutting tools, wear parts, and applications requiring maximum durability under harsh conditions.',
    specifications: [
      { key: 'Hardness', value: '9.5', unit: 'Mohs' },
      { key: 'Density', value: '15.63', unit: 'g/cm³' },
      { key: 'Melting Point', value: '2870', unit: '°C' },
      { key: 'Compressive Strength', value: '4000-6000', unit: 'MPa' },
      { key: 'Fracture Toughness', value: '8-15', unit: 'MPa·m½' },
      { key: 'Thermal Conductivity', value: '110', unit: 'W/m·K' },
    ],
    applications: [
      'Cutting and drilling tools',
      'Mining and excavation equipment',
      'Armor-piercing projectiles',
      'Wear-resistant components',
      'Die and mold manufacturing',
      'Aerospace engine components',
    ],
    industries: ['defense', 'industrial', 'energy', 'space'],
    imagePath: '/images/products/tungsten-carbide.jpg',
    featured: true,
    certifications: ['ISO 9001:2015', 'ISO 513', 'ASTM B777'],
  },

  // ==========================================================================
  // SPUTTERING TARGETS
  // ==========================================================================
  {
    id: 'st-001',
    name: 'Rhodium Sputtering Targets',
    category: 'Sputtering Targets',
    slug: 'rhodium-sputtering-targets',
    shortDescription: 'Premium rhodium targets for ITER and aerospace applications',
    fullDescription:
      'Ultra-high purity rhodium sputtering targets designed for critical fusion energy projects including ITER, aerospace coatings, and advanced medical imaging systems. Manufactured to exacting specifications for optimal film quality.',
    specifications: [
      { key: 'Purity', value: '99.95+', unit: '%' },
      { key: 'Density', value: '>95% theoretical', unit: '' },
      { key: 'Grain Size', value: '<100', unit: 'μm' },
      { key: 'Surface Roughness', value: '<50', unit: 'nm Ra' },
      { key: 'Standard Sizes', value: '2-12', unit: 'inches' },
      { key: 'Custom Shapes', value: 'Available', unit: '' },
    ],
    applications: [
      'ITER fusion reactor coatings',
      'Aerospace mirror coatings',
      'Medical imaging devices',
      'Catalytic converters',
      'High-temperature sensors',
      'Decorative coatings',
    ],
    industries: ['energy', 'space', 'medical', 'industrial'],
    imagePath: '/images/products/rhodium-targets.jpg',
    featured: true,
    certifications: ['ISO 9001:2015', 'ITER Supplier', 'ESA Qualified'],
  },
  {
    id: 'st-002',
    name: 'Titanium Sputtering Targets',
    category: 'Sputtering Targets',
    slug: 'titanium-sputtering-targets',
    shortDescription: 'High-purity titanium targets for aerospace and medical coatings',
    fullDescription:
      'Premium titanium sputtering targets for producing wear-resistant, biocompatible, and decorative coatings. Widely used in aerospace, medical device manufacturing, and advanced optics.',
    specifications: [
      { key: 'Purity', value: '99.95+', unit: '%' },
      { key: 'Density', value: '>98% theoretical', unit: '' },
      { key: 'Grain Size', value: '<50', unit: 'μm' },
      { key: 'Surface Finish', value: 'Polished or Machined', unit: '' },
      { key: 'Standard Diameter', value: '2-16', unit: 'inches' },
      { key: 'Thickness Range', value: '3-25', unit: 'mm' },
    ],
    applications: [
      'Aerospace component coatings',
      'Medical implant surfaces',
      'Optical thin films',
      'Decorative architectural glass',
      'Semiconductor barriers',
      'Anti-reflective coatings',
    ],
    industries: ['space', 'medical', 'industrial'],
    imagePath: '/images/products/titanium-targets.jpg',
    featured: false,
    certifications: ['ISO 9001:2015', 'EN 9100', 'ASTM B299'],
  },
  {
    id: 'st-003',
    name: 'Copper Sputtering Targets',
    category: 'Sputtering Targets',
    slug: 'copper-sputtering-targets',
    shortDescription: 'High-conductivity copper targets for electronics and semiconductors',
    fullDescription:
      'Ultra-pure copper sputtering targets engineered for semiconductor interconnects, MEMS devices, and advanced electronics. Consistent quality for reliable thin-film deposition.',
    specifications: [
      { key: 'Purity', value: '99.999', unit: '%' },
      { key: 'Density', value: '>99% theoretical', unit: '' },
      { key: 'Electrical Resistivity', value: '<1.7', unit: 'μΩ·cm' },
      { key: 'Grain Size', value: '<25', unit: 'μm' },
      { key: 'Oxygen Content', value: '<10', unit: 'ppm' },
      { key: 'Custom Bonding', value: 'Available', unit: '' },
    ],
    applications: [
      'Semiconductor metallization',
      'MEMS fabrication',
      'Flat panel displays',
      'Solar cell electrodes',
      'Electromagnetic shielding',
      'Printed circuit boards',
    ],
    industries: ['industrial', 'energy'],
    imagePath: '/images/products/copper-targets.jpg',
    featured: false,
    certifications: ['ISO 9001:2015', 'ASTM B170', 'SEMI Standards'],
  },
  {
    id: 'st-004',
    name: 'Nickel Sputtering Targets',
    category: 'Sputtering Targets',
    slug: 'nickel-sputtering-targets',
    shortDescription: 'Corrosion-resistant nickel targets for protective coatings',
    fullDescription:
      'High-purity nickel sputtering targets for corrosion-resistant and magnetic thin films. Essential for aerospace, marine, and advanced electronics applications.',
    specifications: [
      { key: 'Purity', value: '99.95+', unit: '%' },
      { key: 'Density', value: '>98% theoretical', unit: '' },
      { key: 'Grain Size', value: '<75', unit: 'μm' },
      { key: 'Magnetic Properties', value: 'Controlled', unit: '' },
      { key: 'Surface Quality', value: 'High polish', unit: '' },
      { key: 'Standard Sizes', value: '2-12', unit: 'inches' },
    ],
    applications: [
      'Corrosion-resistant coatings',
      'Magnetic recording media',
      'Fuel cell components',
      'Aerospace engine parts',
      'Barrier layers in electronics',
      'Decorative coatings',
    ],
    industries: ['space', 'defense', 'energy', 'industrial'],
    imagePath: '/images/products/nickel-targets.jpg',
    featured: false,
    certifications: ['ISO 9001:2015', 'ASTM B39', 'EN 9100'],
  },
  {
    id: 'st-005',
    name: 'Custom Alloy Sputtering Targets',
    category: 'Sputtering Targets',
    slug: 'custom-alloy-sputtering-targets',
    shortDescription: 'Bespoke alloy targets engineered to your exact specifications',
    fullDescription:
      'Custom-formulated alloy sputtering targets designed for specialized applications. Our metallurgical expertise enables precise composition control for unique coating requirements in research and production.',
    specifications: [
      { key: 'Composition Control', value: '±0.5', unit: '%' },
      { key: 'Density', value: '>95% theoretical', unit: '' },
      { key: 'Custom Shapes', value: 'Any geometry', unit: '' },
      { key: 'Purity Options', value: '99.5-99.999', unit: '%' },
      { key: 'Size Range', value: '1-20', unit: 'inches' },
      { key: 'Lead Time', value: '4-8', unit: 'weeks' },
    ],
    applications: [
      'Research and development',
      'Novel coating systems',
      'Multi-component films',
      'Specialty optics',
      'Advanced ceramics',
      'Quantum devices',
    ],
    industries: ['space', 'defense', 'energy', 'medical', 'industrial'],
    imagePath: '/images/products/custom-alloy-targets.jpg',
    featured: true,
    certifications: ['ISO 9001:2015', 'ESA Qualified', 'Custom Certifications Available'],
  },

  // ==========================================================================
  // POWDERS & NANOMATERIALS
  // ==========================================================================
  {
    id: 'pn-001',
    name: 'Tungsten Powder',
    category: 'Powders & Nanomaterials',
    slug: 'tungsten-powder',
    shortDescription: 'Fine tungsten powder for additive manufacturing and sintering',
    fullDescription:
      'High-purity tungsten powder with controlled particle size distribution for additive manufacturing, powder metallurgy, and thermal spray applications. Optimized for excellent flowability and sintering behavior.',
    specifications: [
      { key: 'Purity', value: '99.95+', unit: '%' },
      { key: 'Particle Size Range', value: '0.5-50', unit: 'μm' },
      { key: 'Average Particle Size', value: '5-15', unit: 'μm' },
      { key: 'Oxygen Content', value: '<100', unit: 'ppm' },
      { key: 'Flowability', value: 'Excellent', unit: '' },
      { key: 'Apparent Density', value: '3-5', unit: 'g/cm³' },
    ],
    applications: [
      '3D printing / Additive manufacturing',
      'Powder metallurgy sintering',
      'Thermal spray coatings',
      'Metal injection molding',
      'Heavy metal alloys',
      'Radiation shielding composites',
    ],
    industries: ['space', 'defense', 'medical', 'industrial'],
    imagePath: '/images/products/tungsten-powder.jpg',
    featured: true,
    certifications: ['ISO 9001:2015', 'ASTM B777', 'REACH Compliant'],
  },
  {
    id: 'pn-002',
    name: 'Molybdenum Powder',
    category: 'Powders & Nanomaterials',
    slug: 'molybdenum-powder',
    shortDescription: 'Fine molybdenum powder for advanced manufacturing processes',
    fullDescription:
      'Premium molybdenum powder with precise particle size control for additive manufacturing, thermal spray, and specialty alloy production. Excellent for high-temperature applications.',
    specifications: [
      { key: 'Purity', value: '99.95+', unit: '%' },
      { key: 'Particle Size Range', value: '1-45', unit: 'μm' },
      { key: 'Average Particle Size', value: '10-20', unit: 'μm' },
      { key: 'Oxygen Content', value: '<150', unit: 'ppm' },
      { key: 'Particle Morphology', value: 'Spherical/Irregular', unit: '' },
      { key: 'Tap Density', value: '2.5-4', unit: 'g/cm³' },
    ],
    applications: [
      'Additive manufacturing',
      'Thermal spray applications',
      'Superalloy production',
      'Electrical contacts',
      'Furnace components',
      'Glass melting industry',
    ],
    industries: ['space', 'industrial', 'energy'],
    imagePath: '/images/products/molybdenum-powder.jpg',
    featured: false,
    certifications: ['ISO 9001:2015', 'ASTM B387', 'REACH Compliant'],
  },
  {
    id: 'pn-003',
    name: 'Tantalum Powder',
    category: 'Powders & Nanomaterials',
    slug: 'tantalum-powder',
    shortDescription: 'High-purity tantalum powder for electronics and AM applications',
    fullDescription:
      'Ultra-pure tantalum powder specifically designed for capacitor production, additive manufacturing, and specialty chemical applications. Controlled particle morphology ensures consistent performance.',
    specifications: [
      { key: 'Purity', value: '99.95+', unit: '%' },
      { key: 'Particle Size Range', value: '1-50', unit: 'μm' },
      { key: 'Surface Area', value: '0.5-5', unit: 'm²/g' },
      { key: 'Oxygen Content', value: '<200', unit: 'ppm' },
      { key: 'Particle Shape', value: 'Nodular/Spherical', unit: '' },
      { key: 'Capacitance Grade', value: 'Available', unit: '' },
    ],
    applications: [
      'Tantalum capacitor manufacturing',
      'Additive manufacturing',
      'Chemical processing catalysts',
      'Medical implant coatings',
      'Superalloy production',
      'Sputtering target fabrication',
    ],
    industries: ['industrial', 'medical', 'space'],
    imagePath: '/images/products/tantalum-powder.jpg',
    featured: false,
    certifications: ['ISO 9001:2015', 'ASTM B708', 'EIA Standards'],
  },
  {
    id: 'pn-004',
    name: 'Rare Earth Powders',
    category: 'Powders & Nanomaterials',
    slug: 'rare-earth-powders',
    shortDescription: 'Specialized rare earth element powders for advanced applications',
    fullDescription:
      'High-purity rare earth element powders including lanthanum, cerium, neodymium, and others. Essential for magnetic materials, catalysts, and advanced energy applications.',
    specifications: [
      { key: 'Purity', value: '99.5-99.99', unit: '%' },
      { key: 'Available Elements', value: 'La, Ce, Nd, Pr, Sm, Gd, Dy', unit: '' },
      { key: 'Particle Size Range', value: '1-100', unit: 'μm' },
      { key: 'Custom Blends', value: 'Available', unit: '' },
      { key: 'Oxygen Control', value: 'Inert atmosphere', unit: '' },
      { key: 'Packaging', value: 'Moisture-sealed', unit: '' },
    ],
    applications: [
      'Permanent magnet production',
      'Catalytic converters',
      'Phosphors and luminescent materials',
      'Battery electrode materials',
      'Glass polishing compounds',
      'Laser crystals',
    ],
    industries: ['energy', 'industrial', 'medical'],
    imagePath: '/images/products/rare-earth-powders.jpg',
    featured: false,
    certifications: ['ISO 9001:2015', 'REACH Compliant', 'RoHS Compliant'],
  },
  {
    id: 'pn-005',
    name: 'Nanopowders',
    category: 'Powders & Nanomaterials',
    slug: 'nanopowders',
    shortDescription: 'Sub-100nm particles for nanotechnology applications',
    fullDescription:
      'Advanced nanoscale powders with particle sizes below 100nm for cutting-edge applications in catalysis, electronics, and materials science. Precise size control and surface chemistry.',
    specifications: [
      { key: 'Particle Size', value: '<100', unit: 'nm' },
      { key: 'Average Size', value: '20-50', unit: 'nm' },
      { key: 'Size Distribution', value: 'Narrow', unit: '' },
      { key: 'Surface Area', value: '10-100', unit: 'm²/g' },
      { key: 'Available Materials', value: 'W, Mo, Ta, Oxides', unit: '' },
      { key: 'Surface Functionalization', value: 'Optional', unit: '' },
    ],
    applications: [
      'Advanced catalysts',
      'Transparent conductors',
      'Biomedical applications',
      'Energy storage materials',
      'Sensors and detectors',
      'Composite reinforcement',
    ],
    industries: ['energy', 'medical', 'industrial'],
    imagePath: '/images/products/nanopowders.jpg',
    featured: true,
    certifications: ['ISO 9001:2015', 'REACH Compliant', 'GHS Compliant'],
  },

  // ==========================================================================
  // CUSTOM COMPONENTS
  // ==========================================================================
  {
    id: 'cc-001',
    name: 'ITER Fusion Components',
    category: 'Custom Components',
    slug: 'iter-fusion-components',
    shortDescription: 'Precision-engineered components for ITER fusion reactor',
    fullDescription:
      'Custom-manufactured components for the International Thermonuclear Experimental Reactor (ITER) project. Fabricated from titanium, stainless steel, and advanced alloys to meet stringent fusion energy requirements.',
    specifications: [
      { key: 'Materials', value: 'Ti, SS316L, Custom Alloys', unit: '' },
      { key: 'Dimensional Tolerance', value: '±0.01', unit: 'mm' },
      { key: 'Surface Finish', value: '<0.4', unit: 'μm Ra' },
      { key: 'Vacuum Compatibility', value: 'UHV rated', unit: '' },
      { key: 'Temperature Range', value: '-269 to 1000', unit: '°C' },
      { key: 'Quality Control', value: '100% inspection', unit: '' },
    ],
    applications: [
      'Plasma-facing components',
      'Vacuum vessel elements',
      'Cooling system parts',
      'Diagnostic components',
      'Structural supports',
      'Cryogenic systems',
    ],
    industries: ['energy'],
    imagePath: '/images/products/iter-components.jpg',
    featured: true,
    certifications: ['ISO 9001:2015', 'ITER Supplier Qualification', 'Nuclear QA'],
  },
  {
    id: 'cc-002',
    name: 'Aerospace Precision Parts',
    category: 'Custom Components',
    slug: 'aerospace-precision-parts',
    shortDescription: 'CNC-machined components for space and aviation applications',
    fullDescription:
      'Ultra-precision machined components for satellites, launch vehicles, and aircraft. Manufactured from refractory metals, titanium, and specialty alloys with aerospace-grade quality control.',
    specifications: [
      { key: 'Machining Tolerance', value: '±0.005', unit: 'mm' },
      { key: 'Surface Roughness', value: '<0.2', unit: 'μm Ra' },
      { key: 'Materials', value: 'Ti, W, Mo, Ta, Alloys', unit: '' },
      { key: 'NDT Inspection', value: 'X-ray, Ultrasonic', unit: '' },
      { key: 'Complexity', value: '5-axis CNC capable', unit: '' },
      { key: 'Traceability', value: 'Full material certs', unit: '' },
    ],
    applications: [
      'Satellite structural components',
      'Rocket engine parts',
      'Thruster components',
      'Precision actuators',
      'Sensor housings',
      'Thermal management systems',
    ],
    industries: ['space', 'defense'],
    imagePath: '/images/products/aerospace-parts.jpg',
    featured: true,
    certifications: ['EN 9100', 'ISO 9001:2015', 'ESA Qualified', 'NADCAP'],
  },
  {
    id: 'cc-003',
    name: 'Heat Shields',
    category: 'Custom Components',
    slug: 'heat-shields',
    shortDescription: 'Thermal protection systems for extreme environments',
    fullDescription:
      'Advanced heat shield solutions fabricated from refractory metals and ceramics for spacecraft re-entry, rocket nozzles, and industrial high-temperature applications. Custom-designed thermal protection.',
    specifications: [
      { key: 'Materials', value: 'W, Mo, TZM, Ceramics', unit: '' },
      { key: 'Max Temperature', value: '3000+', unit: '°C' },
      { key: 'Thermal Shock Resistance', value: 'Excellent', unit: '' },
      { key: 'Oxidation Protection', value: 'Coatings available', unit: '' },
      { key: 'Custom Geometries', value: 'Any shape', unit: '' },
      { key: 'Emissivity', value: 'Controlled', unit: '' },
    ],
    applications: [
      'Spacecraft re-entry vehicles',
      'Rocket nozzle liners',
      'Plasma containment',
      'High-temperature furnaces',
      'Hypersonic vehicle protection',
      'Nuclear reactor shielding',
    ],
    industries: ['space', 'defense', 'energy'],
    imagePath: '/images/products/heat-shields.jpg',
    featured: false,
    certifications: ['ISO 9001:2015', 'EN 9100', 'ESA Qualified'],
  },
  {
    id: 'cc-004',
    name: 'Crucibles & Boats',
    category: 'Custom Components',
    slug: 'crucibles-boats',
    shortDescription: 'High-temperature containers for melting and processing',
    fullDescription:
      'Refractory metal crucibles and evaporation boats for crystal growth, vacuum metallizing, and high-temperature material processing. Available in tungsten, molybdenum, and tantalum.',
    specifications: [
      { key: 'Materials', value: 'W, Mo, Ta', unit: '' },
      { key: 'Max Temperature', value: '2800', unit: '°C' },
      { key: 'Wall Thickness', value: '0.5-10', unit: 'mm' },
      { key: 'Sizes', value: '10ml to 5L', unit: '' },
      { key: 'Custom Shapes', value: 'Available', unit: '' },
      { key: 'Surface Quality', value: 'Polished or as-rolled', unit: '' },
    ],
    applications: [
      'Sapphire crystal growth',
      'Vacuum evaporation',
      'Rare earth melting',
      'Semiconductor processing',
      'Precious metal refining',
      'High-purity material synthesis',
    ],
    industries: ['industrial', 'energy', 'medical'],
    imagePath: '/images/products/crucibles.jpg',
    featured: false,
    certifications: ['ISO 9001:2015', 'Material Certificates'],
  },
  {
    id: 'cc-005',
    name: 'Industrial Electrodes',
    category: 'Custom Components',
    slug: 'industrial-electrodes',
    shortDescription: 'Welding and industrial electrodes for demanding applications',
    fullDescription:
      'High-performance electrodes manufactured from tungsten and molybdenum for resistance welding, glass melting, and electrical discharge machining. Superior conductivity and durability.',
    specifications: [
      { key: 'Materials', value: 'W, Mo, W-alloys', unit: '' },
      { key: 'Conductivity', value: 'High', unit: '' },
      { key: 'Wear Resistance', value: 'Excellent', unit: '' },
      { key: 'Diameter Range', value: '1-50', unit: 'mm' },
      { key: 'Length Range', value: '50-500', unit: 'mm' },
      { key: 'Tip Geometries', value: 'Custom shapes', unit: '' },
    ],
    applications: [
      'Resistance spot welding',
      'Glass melting electrodes',
      'EDM electrodes',
      'Arc welding',
      'Plasma cutting',
      'Electrical contacts',
    ],
    industries: ['industrial', 'defense'],
    imagePath: '/images/products/electrodes.jpg',
    featured: false,
    certifications: ['ISO 9001:2015', 'AWS Specifications'],
  },

  // ==========================================================================
  // HIGH-ENTROPY ALLOYS (SPARK PROJECT)
  // ==========================================================================
  {
    id: 'hea-001',
    name: 'Refractory High-Entropy Alloys (RHEAs)',
    category: 'High-Entropy Alloys',
    slug: 'refractory-high-entropy-alloys',
    shortDescription: 'ESA FIRST! Award-winning next-generation aerospace materials',
    fullDescription:
      'Revolutionary refractory high-entropy alloys developed under the ESA SPARK program. Winner of ESA FIRST! Award for innovation. These multi-principal element alloys offer unprecedented combinations of strength, temperature resistance, and oxidation protection for next-generation space applications.',
    specifications: [
      { key: 'Principal Elements', value: '5-7', unit: 'elements' },
      { key: 'Max Service Temperature', value: '2000+', unit: '°C' },
      { key: 'Density', value: '8-12', unit: 'g/cm³' },
      { key: 'Yield Strength (RT)', value: '800-1500', unit: 'MPa' },
      { key: 'Yield Strength (1200°C)', value: '400-800', unit: 'MPa' },
      { key: 'Oxidation Resistance', value: 'Superior', unit: '' },
    ],
    applications: [
      'Spacecraft propulsion systems',
      'Hypersonic vehicle structures',
      'Re-entry vehicle components',
      'High-temperature turbine blades',
      'Fusion reactor first wall',
      'Advanced rocket nozzles',
    ],
    industries: ['space', 'defense', 'energy'],
    imagePath: '/images/products/rhea-alloys.jpg',
    featured: true,
    certifications: ['ESA FIRST! Winner', 'ESA SPARK Program', 'ISO 9001:2015', 'TRL 4-5'],
  },
  {
    id: 'hea-002',
    name: 'High-Temperature HEAs',
    category: 'High-Entropy Alloys',
    slug: 'high-temperature-heas',
    shortDescription: 'Multi-element alloys for extreme temperature applications',
    fullDescription:
      'Advanced high-entropy alloys engineered for sustained operation at temperatures exceeding 1500°C. Combining elements from across the periodic table to achieve exceptional thermal stability and mechanical properties.',
    specifications: [
      { key: 'Operating Temperature', value: '1500-2000', unit: '°C' },
      { key: 'Melting Point', value: '2500-3000', unit: '°C' },
      { key: 'Creep Resistance', value: 'Excellent', unit: '' },
      { key: 'Thermal Expansion', value: '5-8', unit: '10⁻⁶/K' },
      { key: 'Thermal Conductivity', value: '20-50', unit: 'W/m·K' },
      { key: 'Forms Available', value: 'Ingots, Sheets, Powder', unit: '' },
    ],
    applications: [
      'Next-gen gas turbine components',
      'Scramjet engine parts',
      'Nuclear reactor internals',
      'Industrial furnace elements',
      'Advanced heat exchangers',
      'Thermoelectric materials',
    ],
    industries: ['space', 'defense', 'energy', 'industrial'],
    imagePath: '/images/products/ht-hea.jpg',
    featured: true,
    certifications: ['ESA SPARK Program', 'ISO 9001:2015', 'Under Development'],
  },
  {
    id: 'hea-003',
    name: 'Oxidation-Resistant HEAs',
    category: 'High-Entropy Alloys',
    slug: 'oxidation-resistant-heas',
    shortDescription: 'Self-protecting alloys for extreme oxidizing environments',
    fullDescription:
      'Innovative high-entropy alloys with intrinsic oxidation resistance through formation of stable protective oxide layers. Ideal for aerospace and energy applications requiring long-term stability in air at high temperatures.',
    specifications: [
      { key: 'Oxidation Limit', value: '1800', unit: '°C in air' },
      { key: 'Weight Gain', value: '<0.5', unit: 'mg/cm² @ 1200°C' },
      { key: 'Protective Oxide', value: 'Al₂O₃, Cr₂O₃ based', unit: '' },
      { key: 'Thermal Cycling', value: 'Excellent resistance', unit: '' },
      { key: 'Strength Retention', value: '>80% @ 1200°C', unit: '' },
      { key: 'Development Status', value: 'TRL 3-4', unit: '' },
    ],
    applications: [
      'Air-breathing hypersonic vehicles',
      'Turbine blade coatings',
      'Combustion chamber liners',
      'Atmospheric re-entry surfaces',
      'Industrial waste incineration',
      'Power generation systems',
    ],
    industries: ['space', 'defense', 'energy', 'industrial'],
    imagePath: '/images/products/ox-resistant-hea.jpg',
    featured: false,
    certifications: ['ESA SPARK Program', 'ISO 9001:2015', 'Research Phase'],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all products in a specific category
 */
export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((product) => product.category === category);
}

/**
 * Get all featured products
 */
export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured);
}

/**
 * Get a single product by its slug
 */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

/**
 * Get all unique categories
 */
export function getAllCategories(): ProductCategory[] {
  const categories = new Set<ProductCategory>();
  products.forEach((product) => categories.add(product.category));
  return Array.from(categories);
}

/**
 * Get products by industry
 */
export function getProductsByIndustry(industry: Industry): Product[] {
  return products.filter((product) => product.industries.includes(industry));
}

/**
 * Search products by name or description
 */
export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.shortDescription.toLowerCase().includes(lowerQuery) ||
      product.fullDescription.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get category statistics
 */
export function getCategoryStats(): Record<ProductCategory, number> {
  const stats: Partial<Record<ProductCategory, number>> = {};
  products.forEach((product) => {
    stats[product.category] = (stats[product.category] || 0) + 1;
  });
  return stats as Record<ProductCategory, number>;
}

/**
 * Get total product count
 */
export function getTotalProductCount(): number {
  return products.length;
}

/**
 * Get products with specific certification
 */
export function getProductsByCertification(certification: string): Product[] {
  return products.filter((product) =>
    product.certifications.some((cert) =>
      cert.toLowerCase().includes(certification.toLowerCase())
    )
  );
}

// ============================================================================
// STATIC DATA EXPORTS
// ============================================================================

/**
 * Static array of all category names including "All" for filtering
 */
export const categories: string[] = [
  'All',
  'Refractory Metals',
  'Sputtering Targets',
  'Powders & Nanomaterials',
  'Custom Components',
  'High-Entropy Alloys',
];

/**
 * Technologies data for the CTA section
 */
export const technologies = [
  {
    name: 'Powder Metallurgy',
    description: 'Advanced sintering & HIP processes',
  },
  {
    name: 'Vacuum Melting',
    description: 'Ultra-high purity production',
  },
  {
    name: 'CNC Machining',
    description: '5-axis precision manufacturing',
  },
  {
    name: 'Additive Manufacturing',
    description: '3D metal printing capabilities',
  },
];

// ============================================================================
// EXPORTS
// ============================================================================

export default products;
