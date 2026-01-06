"use client";

import { useState } from 'react';
import { getFirestore, doc, setDoc, collection, addDoc, writeBatch } from 'firebase/firestore';
import { app } from '@/lib/firebase';

// --- DATA ---

const products = [
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
            { name: 'Bolts, Nuts, Washers, Threaded Rods', sizes: 'From Ø6, length max. 2000mm' },
            { name: 'Crucibles', sizes: 'To customer specifications' },
            { name: 'Powders', sizes: 'To customer specifications' },
        ],
        alloys: [
            'Pure Tungsten (min. 99.95%)',
            'W-Cu 90:10, 85:15, 80:20, 78:22, 75:25, 70:30, 68:32, 55:45',
            'W-Ni alloys',
            'W-Ni-Fe (90/7/3%, 92.5/5.25/2.25%, 95/3.5/1.5%, 97/2.1/0.9%)',
            'W-Ni-Cu (90/6/4%, 95/3.5/1.5%)',
            'W-Mo (Mo-30%W, Mo-45%W)',
            'W-Re (W-3%Re, W-25%Re)',
            'WC (Tungsten Carbide)',
        ],
        applications: [
            'Furnace elements', 'Semiconductors', 'Base plates', 'Electron tube components',
            'Heating elements', 'Capacitor sintering tubes', 'Sputtering targets',
            'X-ray diagnostics targets', 'Emission cathodes', 'Ion implantation cathodes/anodes',
            'X-ray shields', 'Crucibles', 'Electrodes', 'Radiators',
            'Weights and ballasts', 'Anti-vibration elements', 'Cutting tools',
        ],
        standards: ['ASTM B760', 'ASTM B777-87', 'GB3875-83', 'DIN standards'],
    },
    {
        id: 'titanium',
        name: 'Titanium',
        symbol: 'Ti',
        description: 'Titanium combines high strength, stiffness, low density, and excellent corrosion resistance. Pure titanium and titanium alloys have tensile strengths of 210-1380 MPa, equivalent to most alloy steels but 40% lighter. Melting point: 1725°C.',
        properties: {
            density: '4.51 g/cm³ (Grade 1-4), 4.42 g/cm³ (Grade 5)',
            meltingPoint: '1725°C',
            tensileStrength: '240-1300 MPa (depending on grade)',
            biocompatibility: 'Excellent - non-toxic, non-allergenic',
        },
        products: [
            { name: 'Sheets, Strips, Foils (Cold Rolled)', sizes: '0.02mm ~ 5mm thick × Width up to 1200mm × Length up to 2500mm', standard: 'ASTM B265, MIL-T 9046' },
            { name: 'Sheets (Hot Rolled)', sizes: '5mm ~ 80mm thick × Width up to 3000mm × Length up to 6000mm', standard: 'ASME SB-265' },
            { name: 'Rods - Round and Rectangular', sizes: 'Ø3mm ~ 350mm × Length up to 6000mm', standard: 'ASTM B348, ASTM F136, ASTM F67' },
            { name: 'Wires', sizes: 'From Ø0.05mm', standard: 'ASTM B863, AWS A5.16' },
            { name: 'Tubes (Seamless)', sizes: 'Ø4-115mm × Wall 0.2 ~ 8mm × Length max. 15000mm', standard: 'ASTM B337, B338, B861' },
            { name: 'Tubes (Welded)', sizes: 'Ø80 ~ 650mm × Wall 1 ~ 10mm × Length max. 15000mm', standard: 'ASTM B862' },
            { name: 'Bolts, Nuts, Washers, Threaded Rods', sizes: 'From Ø3, length max. 2000mm' },
            { name: 'Forgings, Castings, Ingots', sizes: 'To customer drawings' },
            { name: 'Powders', sizes: 'To customer specifications' },
            { name: 'Chemical Industry Baths', sizes: 'To customer drawings' },
        ],
        alloys: [
            'Grade 1 (CP) - Highest formability',
            'Grade 2 (CP) - Most popular, heat exchangers, medicine',
            'Grade 3 (CP) - Higher strength',
            'Grade 4 (CP) - Highest strength CP',
            'Grade 5 (Ti6Al4V) - Aerospace, medical, marine',
            'Grade 7 (Ti-IIPd) - Chemical processing',
            'Grade 9 (Ti-3Al-2.5V) - "Half 6-4"',
            'Grade 23 (Ti6Al4V ELI) - Medical implants',
            'TiNi (Nitinol) - Shape memory alloy',
            'Ti-Nb - Superconducting applications',
            'TiC (Titanium Carbide)',
            'TiO₂ (Titanium Oxide)',
        ],
        applications: [
            'Heat exchangers', 'Medical implants', 'Chemical industry', 'Aerospace',
            'Marine applications', 'Desalination', 'Architecture', 'Hydrocarbon processing',
            'Anodes (DSA)', 'Metal extraction', 'Surgical devices', 'Pacemakers',
        ],
        standards: ['ASTM B265', 'ASTM B348', 'ASTM F136', 'ASTM F67', 'ISO 5832-2', 'AMS 4900-4967', 'DIN 17850'],
    },
    {
        id: 'molybdenum',
        name: 'Molybdenum',
        symbol: 'Mo',
        description: 'Molybdenum has one of the highest melting points of all elements, with density only 25% greater than iron. It has the lowest coefficient of thermal expansion of all structural materials and very high thermal conductivity.',
        properties: {
            density: '10.2 g/cm³',
            meltingPoint: '2623°C',
            thermalExpansion: 'Lowest of structural materials',
            thermalConductivity: 'Very high',
        },
        products: [
            { name: 'Sheets, Flat Bars, Foils, Strips', sizes: 'Min. 0.02mm thick × Width max. 1000mm × Length max. 3000mm', standard: 'ASTM B386' },
            { name: 'Rods - Round and Rectangular', sizes: 'Ø3mm ~ 350mm × Length max. 6000mm', standard: 'ASTM B387' },
            { name: 'Wires (black and pure)', sizes: 'Ø0.01mm min ~ 5mm', standard: 'ASTM B387' },
            { name: 'Tubes', sizes: 'Wall 0.15 ~ 30mm × Ø3 ~ 400mm × Length max. 6000mm' },
            { name: 'Bolts, Nuts, Washers, Threaded Rods', sizes: 'From Ø5, length max. 2000mm' },
            { name: 'Boats and Crucibles', sizes: 'To customer specifications' },
            { name: 'Electrodes', sizes: 'To customer specifications' },
            { name: 'Powders', sizes: 'To customer specifications' },
        ],
        alloys: [
            'Pure Molybdenum (min. 99.95%)',
            'Mo-Cu (90:10, 80:20, 70:30, 60:40, 50:50)',
            'Mo-W (Mo-30%W, Mo-45%W)',
            'Mo-La (Lanthanum Molybdenum)',
            'TZM (Mo99-Ti0.5-Zr0.08-C0.02) - 2× strength at 1300°C+',
            'Mo-Re (5%, 41%, 47%, 50%)',
        ],
        applications: [
            'Heating elements', 'Radiation shields', 'Forging dies',
            'X-ray anodes (clinical diagnostics)', 'Glass melting electrodes',
            'Semiconductor heat sinks', 'Integrated electronics gates',
            'Piston ring coatings', 'Rocket engine components',
            'Liquid-metal heat exchangers',
        ],
        standards: ['ASTM B386', 'ASTM B387'],
    },
    {
        id: 'tantalum',
        name: 'Tantalum',
        symbol: 'Ta',
        description: 'Tantalum is a gray metal with a melting point of approximately 3000°C - the highest of all elements after tungsten and carbon. A thin but very stable film of tantalum oxide provides exceptional corrosion resistance comparable to noble metals.',
        properties: {
            density: '16.6 g/cm³',
            meltingPoint: '~3000°C',
            atomicNumber: '73',
            tensileStrength: 'Up to 240 MPa at 20°C (Ta-2.5W)',
        },
        products: [
            { name: 'Sheets, Strips, Foils', sizes: 'Min. 0.02mm thick × Width max. 1200mm × Length max. 2500mm', standard: 'ASTM B708' },
            { name: 'Rods - Round and Rectangular', sizes: 'Ø3mm ~ 350mm × Length max. 6000mm', standard: 'ASTM B365' },
            { name: 'Wires', sizes: 'Ø0.1mm min, in coil', standard: 'ASTM B365' },
            { name: 'Tubes (Seamless)', sizes: 'Ø4-115mm × Wall 0.2 ~ 8mm × Length max. 9000mm', standard: 'ASTM B521' },
            { name: 'Tubes (Welded)', sizes: 'Ø80 ~ 650mm × Wall 1 ~ 10mm × Length max. 6000mm' },
            { name: 'Bolts, Nuts, Washers, Threaded Rods', sizes: 'From Ø6, length max. 2000mm' },
            { name: 'Forgings, Castings, Ingots', sizes: 'To order' },
            { name: 'Powders', sizes: 'To customer specifications' },
        ],
        alloys: [
            'Pure Tantalum',
            'Ta-2.5W (UNS R05252)',
            'Ta-7.5W',
            'Ta-10W (UNS R05255)',
            'Ta-30Nb',
            'Ta-40Nb (UNS R05240)',
            'TaC (Tantalum Carbide)',
            'Ta₂O₅ (Tantalum Oxide)',
        ],
        applications: [
            'Chemical industry', 'Pharmaceutical industry',
            'Medical instruments', 'Medical implants',
            'Electronics (capacitors)', 'Cutting tools',
        ],
        standards: ['ASTM B708', 'ASTM B365', 'ASTM B521', 'R05200', 'R05400', 'R05255', 'R05252', 'R05240'],
    },
    {
        id: 'niobium',
        name: 'Niobium',
        symbol: 'Nb',
        description: 'Niobium is a lustrous, white, soft, and malleable paramagnetic metal. It has low density compared to other metals, excellent corrosion resistance, and exhibits superconducting properties. It forms dielectric layers ideal for electronics.',
        properties: {
            density: '8.6 g/cm³',
            meltingPoint: '2477°C',
            characteristics: 'Superconducting, forms dielectric layers',
        },
        products: [
            { name: 'Sheets, Strips, Foils', sizes: 'Min. 0.02mm thick × Width max. 1200mm × Length max. 2500mm', standard: 'ASTM B393' },
            { name: 'Rods - Round and Rectangular', sizes: 'Ø3mm ~ 350mm × Length max. 6000mm', standard: 'ASTM B392' },
            { name: 'Wires', sizes: 'Ø0.1mm min, in coil', standard: 'ASTM B392' },
            { name: 'Tubes (Seamless)', sizes: 'Ø4-115mm × Wall 0.2 ~ 8mm × Length max. 9000mm', standard: 'ASTM B394' },
            { name: 'Tubes (Welded)', sizes: 'Ø80 ~ 650mm × Wall 1 ~ 10mm × Length max. 6000mm' },
            { name: 'Bolts, Nuts, Washers, Threaded Rods', sizes: 'From Ø5, length max. 2000mm' },
            { name: 'Forgings, Castings, Ingots', sizes: 'To customer drawings' },
            { name: 'Powders', sizes: 'To customer specifications' },
        ],
        alloys: [
            'Pure Niobium',
            'Nb-Ti (44-48% Ti) - Superconductors',
            'Nb-1Zr (R04251, R04261) - Nuclear industry',
            'Nb-5Zr',
            'Nb-10Zr',
            'Nb-10W-2.5Zr (Cb-752)',
            'Nb-10Hf-1Ti (C-103)',
            'NbC (Niobium Carbide)',
            'Nb₂O₅ (Niobium Oxide)',
        ],
        applications: [
            'Superconducting applications', 'Nuclear industry',
            'Refractory coatings', 'Electronics',
            'MRI magnets', 'Particle accelerators',
        ],
        standards: ['ASTM B392', 'ASTM B393', 'ASTM B394', 'ASTM B884', 'R04200', 'R04210', 'R04251', 'R04261'],
    },
    {
        id: 'zirconium',
        name: 'Zirconium',
        symbol: 'Zr',
        description: 'Zirconium is known for its strong corrosion resistance in critical applications where the metal is exposed to aggressive environments. It is weldable and formable, with a melting point of 1855°C.',
        properties: {
            density: '6.5 g/cm³',
            meltingPoint: '1855°C',
            corrosionResistance: 'Excellent in aggressive environments',
            characteristics: 'Weldable, formable',
        },
        products: [
            { name: 'Ingots, Billets, Blooms', sizes: 'To order' },
            { name: 'Sheets, Strips, Foils', sizes: 'From 0.02mm thick × Width max. 1200mm × Length max. 3000mm', standard: 'ASTM B551' },
            { name: 'Rods - Round and Rectangular', sizes: 'Ø3mm ~ 350mm × Length max. 6000mm', standard: 'ASTM B550' },
            { name: 'Wires', sizes: 'From Ø0.05mm', standard: 'ASTM B550' },
            { name: 'Tubes (Seamless)', sizes: 'Ø4-115mm × Wall 0.2 ~ 8mm × Length max. 15000mm', standard: 'ASTM B523' },
            { name: 'Tubes (Welded)', sizes: 'Ø80 ~ 650mm × Wall 1 ~ 10mm × Length max. 15000mm' },
            { name: 'Bolts, Nuts, Washers, Threaded Rods', sizes: 'From Ø1mm, length max. 2000mm' },
            { name: 'Forgings, Castings, Ingots, Rollers, Plates', sizes: 'To order' },
            { name: 'Powders', sizes: 'To customer specifications' },
        ],
        alloys: [
            'UNS R60700 (Zr1) - Pure, Zr+Hf ≥99.2%, O ≤0.10%',
            'UNS R60702 (Zr3) - Pure, Zr+Hf ≥99.2%, O ≤0.16%',
            'UNS R60705 (Zr5, ZrNb) - Zr-2.5%Nb, Zr+Hf ≥95.5%',
            'Sputtering Targets',
        ],
        applications: [
            'Nuclear power', 'Medical devices', 'Pumps and valves',
            'Columns', 'Heat exchangers', 'Reactors',
            'Pipelines', 'Connectors', 'Alloying',
        ],
        standards: ['ASTM B550', 'ASTM B551', 'ASTM B523', 'R60700', 'R60702', 'R60705'],
    },
    {
        id: 'nickel',
        name: 'Nickel',
        symbol: 'Ni',
        description: 'Pure nickel is resistant to corrosion, particularly to reducing chemicals and alkalis. Nickel has high electrical conductivity, high Curie temperature, good magnetostrictive properties, and good thermal conductivity for heat exchangers in corrosive environments.',
        properties: {
            density: '8.89 g/cm³',
            meltingRange: '1435-1446°C',
            tensileStrength: '450 MPa (annealed)',
            yieldStrength: '150 MPa (annealed)',
            elongation: '47%',
            curieTemperature: '360°C',
            thermalConductivity: '70 W/m·°C',
            electricalResistance: '0.096×10⁻⁶ ohm·m',
        },
        products: [
            { name: 'Sheets, Strips, Foils (Cold Rolled)', sizes: '0.02mm ~ 5mm thick × Width max. 1200mm × Length max. 2500mm', standard: 'ASTM B162' },
            { name: 'Sheets (Hot Rolled)', sizes: '5mm ~ 80mm thick × Width max. 3000mm × Length max. 6000mm' },
            { name: 'Rods - Round and Rectangular', sizes: 'Ø3mm ~ 350mm × Length max. 6000mm', standard: 'N02200, N02201' },
            { name: 'Wires', sizes: 'From Ø0.05mm' },
            { name: 'Tubes (Seamless)', sizes: 'Ø4-115mm × Wall 0.2 ~ 8mm × Length max. 15000mm', standard: 'ASTM B161' },
            { name: 'Tubes (Welded)', sizes: 'Ø80 ~ 650mm × Wall 1 ~ 10mm × Length max. 15000mm' },
            { name: 'Bolts, Nuts, Washers, Threaded Rods', sizes: 'From Ø5, length max. 2000mm' },
            { name: 'Forgings, Castings, Ingots, Rollers, Plates', sizes: 'To order' },
            { name: 'Sputtering Targets', sizes: 'Ni/Cr (80:20, 70:30), Ni/V (93:7)' },
        ],
        alloys: [
            'Pure Nickel 99.99%', 'Nickel 200/201',
            'Nilo 36 / Invar', 'Nilo 42 / Invar', 'Nilo K / Kovar',
            'Nitronic 50', 'Nitronic 60',
            'Nimonic 75', 'Nimonic 80A', 'Nimonic 90', 'Nimonic 263',
            'Nilomag 77',
            'Monel 400', 'Monel K-500',
            'Inconel 600', 'Inconel 601', 'Inconel 625', 'Inconel 625 LCF',
            'Inconel 686', 'Inconel 718', 'Inconel X-750',
            'Incoloy 330', 'Incoloy 800', 'Incoloy 825',
            'Incoloy 901', 'Incoloy 925', 'Incoloy A-286', 'Incoloy DS',
            'Hastelloy C-22', 'Hastelloy C-276', 'Hastelloy C-2000', 'Hastelloy X',
            'Waspalloy', 'Mu-Metal', 'Nicorros', 'Nicrofer', 'CuNi',
        ],
        applications: [
            'Chemical processing', 'Electronics', 'Food processing',
            'Synthetic fibers', 'Electronic cables', 'Batteries',
            'Thyratrons', 'Spark electrodes', 'Heat exchangers',
        ],
        standards: ['N2', 'N4', 'N6', 'N8', 'N02200', 'N02201', 'ASTM B162', 'ASTM B161'],
    },
    {
        id: 'stellite',
        name: 'Stellite',
        symbol: 'Co-Cr',
        description: 'Cobalt-chromium-tungsten alloys (also Mo, Ni, Fe, C, Si, B), often called stellites, are wear- and corrosion-resistant alloys. When other materials lose strength and abrasion resistance, Stellite offers excellent properties for the most demanding applications.',
        properties: {
            composition: 'Co-Cr-W base (+ Mo, Ni, Fe, C, Si, B)',
            wearResistance: 'Exceptional',
            corrosionResistance: 'Excellent',
            highTemperature: 'Maintains properties at elevated temperatures',
        },
        products: [
            { name: 'Stellite Sheets', sizes: 'Various' },
            { name: 'Stellite Flat Bars', sizes: 'Various' },
            { name: 'Stellite Rods', sizes: 'Various' },
            { name: 'Custom Parts', sizes: 'To specification' },
            { name: 'Welding Electrodes', sizes: 'Various' },
            { name: 'Powders for Coating', sizes: 'Various' },
        ],
        alloys: [
            'Stellite 6B (AMS 5894) - Forged, excellent in harsh conditions',
            'Stellite 6K - Rolled, for cutting/scraping applications',
            'Cast Stellite grades',
            'Powder metal grades',
        ],
        applications: [
            'Bearings', 'Valve seats', 'Pistons', 'Milling machines',
            'Cutting tools', 'Knives', 'Scraper blades',
            'Food industry (corrosion resistance)',
            'Surface hardening', 'Wear-resistant coatings',
        ],
        standards: ['AMS 5894'],
    },
    {
        id: 'copper',
        name: 'Copper',
        symbol: 'Cu',
        description: 'We offer a wide range of copper and copper alloy products for construction, architecture, telecommunications, electronics, energy, and many other industries. Available as sheets, strips, rods, flat bars, profiles, and pipes.',
        properties: {
            electricalConductivity: 'Excellent',
            thermalConductivity: 'Very high',
            corrosionResistance: 'Good',
            machinability: 'Excellent (tellurium copper)',
        },
        products: [
            { name: 'Copper Sheets', sizes: 'Various' },
            { name: 'Copper Strips', sizes: 'Various' },
            { name: 'Copper Rods (Round and Hexagonal)', sizes: 'Various' },
            { name: 'Copper Flat Bars', sizes: 'Various' },
            { name: 'Copper Profiles', sizes: 'Various' },
            { name: 'Copper Pipes', sizes: 'Various' },
        ],
        alloys: [
            'Pure Copper', 'Tellurium Copper', 'Cu-ETP',
            'Bronze', 'Brass',
            'Brush Alloy 3', 'Brush Alloy 10', 'Brush Alloy 25',
            'Brush Alloy M25', 'Brush Alloy 174', 'Brush Alloy 190',
            'Hovadur CB2', 'Hovadur CCNB', 'Hovadur CCZ',
            'Hovadur CNB', 'Hovadur CNCS',
            'CuAl10Ni5Fe4', 'CuNi10Fe1Mn', 'CuSn6',
        ],
        applications: [
            'Construction', 'Architecture', 'Telecommunications',
            'Electronics', 'Energy', 'Electrical conductors',
        ],
        standards: ['Industry standards'],
    },
    {
        id: 'aluminum-bronze',
        name: 'Aluminum Bronzes',
        symbol: 'CuAl',
        description: 'Aluminum bronzes have excellent sliding properties and corrosion resistance, high strength and good abrasion resistance. They are among the elite copper alloys. Aluminum, combined with iron and nickel, acts as a strengthening agent. All can be heat-treated.',
        properties: {
            slidingProperties: 'Excellent',
            corrosionResistance: 'Excellent',
            strength: 'High',
            abrasionResistance: 'Good',
            heatTreatable: 'Yes - increases tensile strength',
        },
        products: [
            { name: 'Rods', sizes: 'Standard sizes' },
            { name: 'Tubes', sizes: 'Standard sizes' },
            { name: 'Rectangles', sizes: 'Standard sizes' },
            { name: 'Mold Inserts', sizes: 'To specification' },
            { name: 'Custom Components', sizes: 'To specification' },
        ],
        alloys: [
            'CuAl10Ni5Fe4',
            'Various aluminum bronze compositions',
            'Heat-treated grades',
        ],
        applications: [
            'Bearing elements in corrosive environments',
            'Forged valve fittings for seawater',
            'Sliding bushings',
            'Aircraft engine components',
            'Arms industry',
            'Mold inserts for plastics',
            'Steel production tools',
            'Deep drawing of stainless steel',
            'Tool components for forgings/castings',
        ],
        standards: ['Industry standards'],
    },
    {
        id: 'tungsten-carbide',
        name: 'Tungsten Carbide',
        symbol: 'WC',
        description: 'Tungsten carbide is an inorganic chemical compound containing equal parts of tungsten and carbon. It is four times harder than steel and much denser than stainless steel and titanium. Widely used in industrial machinery, tools, and abrasive materials.',
        properties: {
            hardness: '4× harder than steel',
            density: 'Much higher than stainless steel/titanium',
            wearResistance: 'Exceptional',
        },
        products: [
            { name: 'Inserts and Tips', sizes: 'To specification' },
            { name: 'Dies', sizes: 'To specification' },
            { name: 'Sealing Rings', sizes: 'To specification' },
            { name: 'Nozzles', sizes: 'To specification' },
            { name: 'Valve and Seat Components', sizes: 'To specification' },
            { name: 'Bushings', sizes: 'To specification' },
            { name: 'Orifices', sizes: 'To specification' },
            { name: 'Cutters', sizes: 'To specification' },
            { name: 'Mechanical Seals', sizes: 'To specification' },
        ],
        alloys: ['WC-Co composites', 'Various binder compositions'],
        applications: [
            'Mining industry', 'Pump and valve manufacturing',
            'Tool manufacturing', 'Cutting tools',
            'Wear-resistant surfaces', 'Diamond tool substrates',
        ],
        standards: ['Industry specific'],
    },
    {
        id: 'sputtering-targets',
        name: 'Sputtering Targets (PVD)',
        symbol: 'PVD',
        description: 'Complete line of sputtering targets, from commercial grade to ultra-pure (4N-7N). For all thin-film applications including architectural glass coating, high-purity semiconductor alloys, large surface areas, and custom compositions.',
        properties: {
            purity: '99.99% to 99.99999% (4N-7N)',
            formats: 'Bonded or unbonded',
            shapes: 'Flat (disks, rectangles), rotary',
            customization: 'Any composition available',
        },
        products: [
            { name: 'Pure Metal Targets', sizes: 'Al, Sb, Bi, B, Cd, Ce, Cr, Co, Cu, Dy, Er, Eu, Gd, Ge, Au, C, Hf, Ho, Ir, In, Fe, La, Pb, Lu, Mn, Mo, Mg, Nd, Nb, Ni, Pd, Pt, Pr, Re, Ru, Sm, Sc, Se, Si, Ag, Ta, Tb, Te, Sn, Tm, Ti, W, V, Yb, Y, Zr, Zn' },
            { name: 'Metal Alloy Targets', sizes: 'AlCu, AlCr, AlMg, AlNd, AlSi, AlSiCu, AlAg, AlV, CoCr, CoCrMo, CoFe, CoFeB, CoNi, CoPt, CuGa, CuIn, CuNi, NiCr, NiFe, TiAl, TiNi, WRe, WTi, ZrY, and many more' },
            { name: 'Ceramic Targets', sizes: 'Borides: Cr2B, CrB, CrB2, FeB, HfB2, LaB6, Mo2B, NbB, TaB, TiB2, WB, VB, ZrB2' },
            { name: 'Carbide Targets', sizes: 'B4C, Cr3C2, HfC, Mo2C, NbC, SiC, TaC, TiC, WC, W2C, VC, ZrC' },
            { name: 'Fluoride Targets', sizes: 'AlF3, BaF3, CdF2, CaF2, CeF3, DyF3, ErF3, HfF4, LaF3, LiF, MgF2, NdF3, YF3, YbF3' },
            { name: 'Nitride Targets', sizes: 'AlN, BN, GaN, HfN, NbN, Si3N4, TaN, TiN, VN, ZrN' },
            { name: 'Oxide Targets', sizes: 'Al2O3, Bi2O3, CeO2, Cr2O3, HfO2, In2O3, ITO, MgO, SiO2, Ta2O5, TiO2, WO3, Y2O3, ZnO, ZnO:Al, ZrO2' },
            { name: 'Selenide Targets', sizes: 'Bi2Se3, CdSe, CuSe, Ga2Se3, In2Se3, PbSe, MoSe2, ZnSe' },
            { name: 'Silicide Targets', sizes: 'CrSi2, CoSi2, HfSi2, MoSi2, NbSi2, TaSi2, TiSi2, WSi2, ZrSi2' },
            { name: 'Sulfide Targets', sizes: 'CdS, CuS, FeS, MoS2, ZnS' },
            { name: 'Telluride Targets', sizes: 'Bi2Te3, CdTe, GeTe, PbTe, ZnTe' },
            { name: 'Custom/Specialty Targets', sizes: 'AZO, Cr-SiO, CIGS, ITO, IGZO, GaAs, GeSbTe, LSMO, YBCO, YSZ' },
        ],
        alloys: [
            'All pure metals', 'Binary/ternary alloys',
            'Oxides', 'Nitrides', 'Carbides', 'Borides',
            'Fluorides', 'Selenides', 'Silicides', 'Sulfides', 'Tellurides',
        ],
        applications: [
            'Semiconductors', 'Solar cells', 'Optical coatings',
            'Architectural glass', 'Hard coatings', 'Decorative coatings',
            'Display manufacturing', 'Tribological coatings',
        ],
        standards: ['Semiconductor industry standards'],
    },
    {
        id: 'super-clean',
        name: 'Super Clean Metals (4N-7N)',
        symbol: '4N-7N',
        description: 'We specialize in the production and distribution of high-purity metals ranging from 4N (99.99%) to 7N (99.99999%). Available as bars, pellets, powder, sheets, wires, sputtering targets, granules, and evaporation materials.',
        properties: {
            purity4N: '99.99%',
            purity5N: '99.999%',
            purity6N: '99.9999%',
            purity7N: '99.99999%',
        },
        products: [
            { name: 'Aluminum (Al)', sizes: '99.999% / 99.9995% / 99.9999% - Bars, pellets, powder, targets, rods, wires, flat bars' },
            { name: 'Arsenic (As)', sizes: '99.999% / 99.9999% / 99.99999% - Lumps, powder, rods, crystal' },
            { name: 'Antimony (Sb)', sizes: '99.99% to 99.99999% - Crystals, powder, pellets, targets, granules' },
            { name: 'Bismuth (Bi)', sizes: '99.99% / 99.999% / 99.9999% - Bars, granules, pellets, powder, targets' },
            { name: 'Cadmium (Cd)', sizes: '99.999% / 99.9999% / 99.99999% - Bars, pellets, targets, granules' },
            { name: 'Cobalt (Co)', sizes: '99.99% / 99.999% - Sheets, bars, pellets, targets, granules' },
            { name: 'Copper (Cu)', sizes: '99.999% / 99.9999% - Sheets, bars, pellets, targets, granules' },
            { name: 'Chromium (Cr)', sizes: '99.99% / 99.995% - Granules, powder' },
            { name: 'Gallium (Ga)', sizes: '99.999% / 99.9999% / 99.99999% - Liquid, pellet, solid' },
            { name: 'Germanium (Ge)', sizes: '99.999% - Bars, powder, targets, granules, window' },
            { name: 'Gold (Au)', sizes: '99.999% - Wires, bars, powder, sheets, flat bars, pellets, targets' },
            { name: 'Indium (In)', sizes: '99.999% / 99.9999% / 99.99999% - Bars, rods, pellets, targets' },
            { name: 'Iron (Fe)', sizes: '99.99% to 99.99999% - Bars, pellets, targets, granules' },
            { name: 'Lead (Pb)', sizes: '99.999% / 99.9999% / 99.99999% - Bars, rods, pellets, targets' },
            { name: 'Nickel (Ni)', sizes: '99.99% / 99.999% - Sheets, bars, powder, targets' },
            { name: 'Selenium (Se)', sizes: '99.999% / 99.9999% / 99.99999% - Block, powder, targets' },
            { name: 'Silver (Ag)', sizes: '99.999% - Wires, bars, powder, sheets, flat bars, pellets, targets' },
            { name: 'Tellurium (Te)', sizes: '99.999% / 99.9999% / 99.99999% - Bars, flakes, powder, sheets, pellets' },
            { name: 'Tin (Sn)', sizes: '99.999% / 99.9999% - Wires, bars, powder, sheets, flat bars, pellets, targets' },
            { name: 'Zinc (Zn)', sizes: '99.999% / 99.9999% - Wires, bars, powder, sheets, flat bars, pellets, targets' },
        ],
        alloys: [
            '4N (99.99%)', '5N (99.999%)', '5N5 (99.9995%)',
            '6N (99.9999%)', '7N (99.99999%)',
        ],
        applications: [
            'Semiconductor manufacturing', 'Thin-film deposition',
            'Research and development', 'Electronics',
            'Optical coatings', 'Crystal growth',
        ],
        standards: ['Ultra-high purity standards'],
    },
];

const news = [
    { date: 'December 2024', title: 'ESA FIRST! Award Winner', description: 'Bimo Tech wins prestigious ESA FIRST! Award for the SPARK project on Refractory High-Entropy Alloys for next-generation space propulsion.', category: 'Award', featured: true },
    { date: 'November 2024', title: 'ITER Rhodium Targets Delivered', description: 'Successfully delivered precision-manufactured rhodium sputtering targets for ITER fusion reactor coating applications.', category: 'Delivery' },
    { date: 'November 2024', title: 'ArianeGroup Partnership Expanded', description: 'Extended collaboration with ArianeGroup for advanced refractory materials in next-generation European launch vehicles.', category: 'Partnership' },
    { date: 'October 2024', title: 'New F4E Contract Signed', description: 'Signed new contract with Fusion for Energy for custom fusion energy components and specialized materials.', category: 'Contract' },
    { date: 'September 2024', title: 'HEA Research Publication', description: 'Published research on High-Entropy Alloy mechanical properties at elevated temperatures in Journal of Alloys and Compounds.', category: 'Research' },
    { date: 'August 2024', title: 'ISO 9001:2015 Recertification', description: 'Successfully completed ISO 9001:2015 recertification audit with zero non-conformances.', category: 'Certification' },
];

const careers = [
    { title: 'Materials Engineer', department: 'R&D', location: 'Wrocław, Poland', type: 'Full-time', description: 'Develop and characterize advanced refractory materials for aerospace and energy applications.' },
    { title: 'Process Engineer', department: 'Production', location: 'Wrocław, Poland', type: 'Full-time', description: 'Optimize manufacturing processes for high-purity metal production and component fabrication.' },
    { title: 'Quality Assurance Specialist', department: 'Quality', location: 'Wrocław, Poland', type: 'Full-time', description: 'Ensure material and process compliance with aerospace and nuclear industry standards.' },
    { title: 'Research Scientist - HEA', department: 'R&D', location: 'Wrocław, Poland', type: 'Full-time', description: 'Lead research on High-Entropy Alloys for extreme environment applications.' },
];

export default function SeedPage() {
    const [status, setStatus] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const seed = async () => {
        setLoading(true);
        setStatus('Seeding started...');
        const db = getFirestore(app);

        try {
            const batch = writeBatch(db);

            // Products
            let productCount = 0;
            for (const prod of products) {
                const ref = doc(db, 'products', prod.id);
                batch.set(ref, prod);
                productCount++;
            }
            setStatus(s => s + `\nQueued ${productCount} products...`);

            // News
            let newsCount = 0;
            for (const item of news) {
                // Use auto-id
                const ref = doc(collection(db, 'news'));
                batch.set(ref, item);
                newsCount++;
            }
            setStatus(s => s + `\nQueued ${newsCount} news items...`);

            // Careers
            let careerCount = 0;
            for (const item of careers) {
                const ref = doc(collection(db, 'careers'));
                batch.set(ref, item);
                careerCount++;
            }
            setStatus(s => s + `\nQueued ${careerCount} career items...`);

            setStatus(s => s + `\nCommitting batch...`);
            await batch.commit();

            setStatus(s => s + `\nSUCCESS! Database seeded.`);
        } catch (e: any) {
            console.error(e);
            setStatus(s => s + `\nERROR: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-20">
            <h1 className="text-3xl mb-10">Database Seeder</h1>
            <div className="mb-8">
                <p>Warning: This will overwrite existing products with the same ID.</p>
            </div>

            <button
                onClick={seed}
                disabled={loading}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold disabled:opacity-50"
            >
                {loading ? 'Seeding...' : 'SEED DATABASE'}
            </button>

            <pre className="mt-8 p-4 bg-gray-900 rounded-xl overflow-auto border border-gray-800 h-96">
                {status}
            </pre>
        </div>
    );
}
