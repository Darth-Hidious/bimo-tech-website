// Catalog content. Source: bimomaterials.com product pages as published on
// 4 October 2026, with two corrections: titanium melts at 1,668 °C (the old
// page said 1,725 °C), and titanium, nickel, copper, steel and aluminium move
// out of "Refractory metals" into "Specialty alloys".
// Element properties are standard handbook values.

export type Material = {
  slug: string;
  name: string;
  chartName?: string; // shorter name for the melting-point chart, when `name` is long
  symbol: string; // shown on the element tile
  z?: number; // atomic number, for pure elements
  meltingC?: number;
  density?: number; // g/cm³
  summary: string;
  forms: string[];
  grades?: string[];
  uses: string[];
  standards?: string[];
  img?: string; // key in lib/site.ts images
};

export type Group = { title: string; body: string };

export type Family = {
  slug: string;
  name: string;
  short: string; // one line for cards
  intro: string;
  tiles: string[]; // element symbols shown on the family card
  elements: string[]; // every element this family lists, for the periodic table
  image: string;
  materials?: Material[];
  groups?: Group[];
};

const REFRACTORY_FORMS = ["Sheet", "Plate", "Rod", "Wire", "Tube", "Powder", "Forgings"];

export const families: Family[] = [
  {
    slug: "refractory-metals",
    name: "Refractory metals",
    short: "Tungsten, molybdenum, tantalum, niobium, rhenium, zirconium",
    intro:
      "Tungsten, molybdenum, tantalum, niobium, rhenium and zirconium as sheet, rod, wire, tube, powder and forgings.",
    tiles: ["W", "Mo", "Ta", "Nb", "Re", "Zr"],
    elements: ["W", "Mo", "Ta", "Nb", "Re", "Zr"],
    image: "supply",
    materials: [
      {
        slug: "tungsten",
        img: "tungstenRod",
        name: "Tungsten",
        symbol: "W",
        z: 74,
        meltingC: 3422,
        density: 19.25,
        summary:
          "The highest melting point of any metal, the lowest thermal expansion of the refractory metals and high strength at temperature.",
        forms: [...REFRACTORY_FORMS, "Machined parts"],
        grades: ["Pure W", "WLa (lanthanated)", "WCu (tungsten–copper)"],
        uses: ["Furnace parts", "Fusion first-wall and divertor parts", "Welding electrodes", "Radiation shielding"],
      },
      {
        slug: "molybdenum",
        img: "powderJars",
        name: "Molybdenum",
        symbol: "Mo",
        z: 42,
        meltingC: 2623,
        density: 10.28,
        summary:
          "High melting point, excellent thermal conductivity and strength at temperature, at about half the density of tungsten.",
        forms: [...REFRACTORY_FORMS, "Machined parts"],
        grades: ["Pure Mo", "TZM"],
        uses: ["Furnace hot zones", "Electronics", "Aerospace", "Welding electrodes"],
      },
      {
        slug: "tantalum",
        name: "Tantalum",
        symbol: "Ta",
        z: 73,
        meltingC: 3017,
        density: 16.69,
        summary:
          "Very ductile, with corrosion resistance close to the precious metals.",
        forms: REFRACTORY_FORMS,
        uses: ["Chemical plant", "Pharmaceutical equipment", "Electronics", "Medical"],
      },
      {
        slug: "niobium",
        img: "refractoryStock",
        name: "Niobium",
        symbol: "Nb",
        z: 41,
        meltingC: 2477,
        density: 8.57,
        summary:
          "Soft, ductile and light for a refractory metal, corrosion resistant and superconducting. It forms stable dielectric layers.",
        forms: REFRACTORY_FORMS,
        uses: ["Superconducting parts", "Chemical plant", "Electronics"],
      },
      {
        slug: "rhenium",
        name: "Rhenium",
        symbol: "Re",
        z: 75,
        meltingC: 3186,
        density: 21.02,
        summary:
          "The highest elastic modulus of the refractory metals, 420 GPa, and excellent mechanical properties at high temperature.",
        forms: ["Sheet", "Rod", "Wire", "Powder"],
        uses: ["High-temperature parts", "Thermocouples", "Alloying"],
      },
      {
        slug: "zirconium",
        name: "Zirconium",
        symbol: "Zr",
        z: 40,
        meltingC: 1855,
        density: 6.51,
        summary: "Strong corrosion resistance in critical service. Weldable and formable.",
        forms: REFRACTORY_FORMS,
        uses: ["Nuclear", "Chemical plant", "Medical"],
      },
      {
        slug: "tungsten-carbide",
        name: "Tungsten carbide",
        symbol: "WC",
        summary:
          "An extremely hard ceramic, about four times harder than steel. We make wear parts from it to drawing.",
        forms: ["Inserts", "Tips", "Dies", "Seal rings", "Nozzles", "Valve parts", "Sleeves", "Orifices"],
        uses: ["Wear parts", "Cutting", "Valves and seals"],
      },
    ],
  },
  {
    slug: "specialty-alloys",
    name: "Specialty alloys",
    short: "Titanium, nickel alloys, Stellite, copper, bronzes, stainless steel",
    intro:
      "Titanium, nickel and cobalt alloys, copper, aluminium bronzes, stainless steel and aluminium, as bar, plate, tube and forgings.",
    tiles: ["Ti", "Ni", "Co", "Cu"],
    elements: ["Ti", "Ni", "Co", "Cu", "Al", "Fe", "Cr"],
    image: "machining",
    materials: [
      {
        slug: "titanium",
        img: "specialty",
        name: "Titanium and titanium alloys",
        chartName: "Titanium",
        symbol: "Ti",
        z: 22,
        meltingC: 1668,
        density: 4.51,
        summary:
          "High strength and stiffness at low density, with excellent corrosion resistance. Biocompatible and non-magnetic.",
        forms: ["Bar", "Plate", "Sheet", "Tube", "Wire", "Forgings", "Powder"],
        uses: ["Aerospace", "Medical", "Chemical plant", "ITER construction"],
      },
      {
        slug: "nickel-alloys",
        name: "Nickel and nickel alloys",
        chartName: "Nickel",
        symbol: "Ni",
        z: 28,
        meltingC: 1455,
        density: 8.91,
        summary:
          "Pure nickel and nickel alloys for chemical processing, electronics and energy: corrosion resistant, strong at temperature, with useful magnetic and thermal properties.",
        forms: ["Bar", "Plate", "Sheet", "Strip", "Tube", "Wire"],
        grades: [
          "Nickel 200", "Nickel 201", "Inconel® 600", "Inconel® 601", "Inconel® 625", "Inconel® 718",
          "Incoloy® 800", "Incoloy® 825", "Hastelloy® C-22", "Hastelloy® C-276", "Hastelloy® X",
          "Monel® 400", "Monel® K-500", "Nimonic® 75", "Nimonic® 80A", "Nimonic® 90", "Nimonic® 263",
          "Nilo® 36 (Invar)", "Nilo® 42", "Kovar®", "Waspaloy®", "Mu-Metal",
        ],
        uses: ["Chemical processing", "Turbine hot sections", "Glass-to-metal seals", "Magnetic shielding"],
      },
      {
        slug: "stellite",
        name: "Stellite",
        symbol: "Co",
        summary: "Cobalt–chromium–tungsten alloys with excellent wear and corrosion resistance.",
        forms: ["Plate", "Bar", "Machined parts"],
        grades: ["Stellite 6B", "Stellite 6K"],
        standards: ["AMS 5894 (6B)"],
        uses: ["Bearings", "Valve seats", "Cutting tools", "Food industry"],
      },
      {
        slug: "copper-alloys",
        name: "Copper and copper alloys",
        chartName: "Copper",
        symbol: "Cu",
        z: 29,
        meltingC: 1085,
        density: 8.96,
        summary: "Copper and copper alloys for electronics, energy, telecommunications and architecture.",
        forms: ["Sheet", "Strip", "Bar", "Flat bar", "Profile", "Tube"],
        uses: ["Electrical conductors", "Heat exchangers", "Architecture"],
      },
      {
        slug: "aluminium-bronzes",
        name: "Aluminium bronzes",
        symbol: "CuAl",
        summary:
          "High strength, wear and corrosion resistance and very good sliding properties: the strongest of the copper alloys.",
        forms: ["Bar", "Tube", "Machined parts"],
        uses: ["Bearings and bushes", "Marine parts", "Valve parts"],
      },
      {
        slug: "stainless-steel",
        name: "Stainless steel",
        symbol: "Fe",
        summary:
          "Flat and long products, hot and cold rolled, ground and polished: austenitic, ferritic, martensitic, duplex and precipitation-hardening grades.",
        forms: ["Sheet", "Plate", "Bar", "Tube", "Profile"],
        uses: ["Process plant", "Construction", "Nuclear (see Nuclear grade)"],
      },
      {
        slug: "aluminium",
        name: "Aluminium and aluminium alloys",
        chartName: "Aluminium",
        symbol: "Al",
        z: 13,
        meltingC: 660,
        density: 2.7,
        summary: "Light, at 2.7 g/cm³, and naturally corrosion resistant through its oxide layer.",
        forms: ["Sheet", "Plate", "Bar", "Profile", "Tube"],
        uses: ["Transport", "Electronics", "Construction"],
      },
    ],
  },
  {
    slug: "powders",
    name: "Powders",
    short: "Nanopowders, micropowders and spherical 3D-printing powders",
    intro:
      "Nanopowders, powders, spherical powders for 3D printing and granules, in pure, alloy and composite form, including oxides, carbides and nitrides.",
    tiles: ["Ti", "W", "Ni", "Al"],
    elements: ["Ag", "Cu", "Fe", "Al", "Mo", "W", "Pt", "Mn", "Mg", "Zn", "Au", "Co", "Ti", "Cr", "Ni", "Sn", "C"],
    image: "route-powder",
    groups: [
      {
        title: "Pure metal nanopowders",
        body: "Ag, Cu, Fe, Al, Mo, W, Pt, Mn, Mg, Zn, Au, Co, Ti, Cr, Ni, Sn and graphite. D50 from 2 nm to 90 nm, purity 99.90–99.96%.",
      },
      {
        title: "Oxide nanopowders",
        body: "Al₂O₃, CeO₂, Cr₂O₃, CuO, Fe₂O₃, Fe₃O₄, In₂O₃, ITO, MgO, SiO₂, SnO₂, TiO₂, Y₂O₃, ZnO, ZrO₂ and more. Purity 99.5–99.999%.",
      },
      {
        title: "Nitrides, carbides and silicides",
        body: "AlN, Si₃N₄, TiN, TiC, SiC, ZrC, LaB₆ and others, for tooling, coatings and nuclear applications.",
      },
      {
        title: "3D-printing powders",
        body: "Spherical, high packing density, low oxygen and carbon. Titanium (Grade 1–5, Ti6Al4V, Ti64 ELI), stainless (316L, 304L, 15-5PH, 17-4PH), nickel (Inconel 718 and 625, Hastelloy X), aluminium (AlSi10Mg, 2024, 6061, 7075) and cobalt-chromium (ASTM F75).",
      },
    ],
  },
  {
    slug: "sputtering-targets",
    name: "Sputtering targets",
    short: "Pure metal, alloy, ceramic and oxide targets, any system",
    intro:
      "A complete line of sputtering targets, from commercial grade to ultra-pure, made to fit any system or to custom dimensions.",
    tiles: ["Ti", "Cr", "Hf", "In"],
    elements: [
      "Al", "Sb", "Bi", "B", "Cd", "Ce", "Cr", "Co", "Cu", "Dy", "Er", "Eu", "Gd", "Ge", "Au", "C", "Hf", "Ho",
      "Ir", "In", "Fe", "La", "Pb", "Lu", "Mn", "Mo", "Mg", "Nd", "Nb", "Ni", "Pd", "Pt", "Pr", "Re", "Ru", "Sm",
      "Sc", "Se", "Si", "Ag", "Ta", "Tb", "Te", "Sn", "Tm", "Ti", "W", "V", "Yb", "Y", "Zr", "Zn",
    ],
    image: "tech",
    groups: [
      {
        title: "Pure metal targets",
        body: "Al, Sb, Bi, B, Cd, Ce, Cr, Co, Cu, Dy, Er, Eu, Gd, Ge, Au, C, Hf, Ho, Ir, In, Fe, La, Pb, Lu, Mn, Mo, Mg, Nd, Nb, Ni, Pd, Pt, Pr, Re, Ru, Sm, Sc, Se, Si, Ag, Ta, Tb, Te, Sn, Tm, Ti, W, V, Yb, Y, Zr, Zn.",
      },
      {
        title: "Alloy targets",
        body: "AlCu, AlCr, AlMg, AlSi, CoCr, CoCrMo, CoFe, CoFeB, CoNi, CoPt, CrSi, CuGa, CuIn, CuNi, IrMn, MoSi, NiAl, NiCr, NiFe, NiTi, SmCo, TiAl, TiNi, WRe, WTi, ZrAl and custom compositions.",
      },
      {
        title: "Ceramic targets",
        body: "Borides: CrB₂, HfB₂, LaB₆, TiB₂, ZrB₂. Carbides: B₄C, Cr₃C₂, HfC, SiC, TaC, TiC, WC, ZrC. Nitrides: AlN, BN, GaN, HfN, Si₃N₄, TaN, TiN, ZrN.",
      },
      {
        title: "Oxide targets",
        body: "Al₂O₃, BaTiO₃, CeO₂, Cr₂O₃, HfO₂, In₂O₃, ITO, Fe₂O₃, MgO, Nd₂O₃, SiO₂, SrTiO₃, Ta₂O₅, TiO₂, SnO₂, WO₃, Y₂O₃, ZnO, ZrO₂ and more.",
      },
      {
        title: "Selenides, sulfides, tellurides, fluorides",
        body: "Bi₂Se₃, CdSe, ZnSe, MoSe₂, CdS, MoS₂, ZnS, Bi₂Te₃, CdTe, GeTe, PbTe, AlF₃, CaF₂, MgF₂, YF₃ and more.",
      },
      {
        title: "Made to order",
        body: "AZO, Cr-SiO, CIGS, ITO, IGZO, GaAs, GaP, GaSb, InSb, InAs, InP, LSMO, YBCO, LCMO, YSZ, GeSbTe and others.",
      },
    ],
  },
  {
    slug: "high-purity",
    name: "High purity",
    short: "Twenty elements from 4N to 7N",
    intro:
      "High-purity metals from 4N (99.99%) to 7N (99.99999%), as ingots, pellets, powders, sputtering targets, rods, wires, sheets and evaporation materials.",
    tiles: ["Ga", "In", "Te", "Cu"],
    elements: ["Al", "As", "Sb", "Bi", "Cd", "Co", "Cu", "Cr", "Ga", "Ge", "Au", "In", "Fe", "Pb", "Ni", "Se", "Ag", "Te", "Sn", "Zn"],
    image: "spark-charge",
    groups: [
      { title: "Aluminium (Al)", body: "5N, 5N5, 6N. Ingots, pellets, powder, targets, rods, wires, flat bars." },
      { title: "Arsenic (As)", body: "5N, 6N, 7N. Lumps, powder, rods, crystals." },
      { title: "Antimony (Sb)", body: "4N to 7N. Crystals, powder, pellets, targets, granules." },
      { title: "Bismuth (Bi)", body: "4N, 5N, 6N. Ingots, granules, pellets, targets." },
      { title: "Cadmium (Cd)", body: "5N, 6N, 7N. Ingots, pellets, targets, granules." },
      { title: "Cobalt (Co)", body: "4N, 5N. Sheets, ingots, pellets, targets, granules." },
      { title: "Copper (Cu)", body: "5N, 6N. Sheets, ingots, pellets, targets, granules." },
      { title: "Chromium (Cr)", body: "4N, 4N5. Granules, powder." },
      { title: "Gallium (Ga)", body: "5N, 6N, 7N. Liquid, solid, pellets." },
      { title: "Germanium (Ge)", body: "5N. Ingots, powder, targets, granules." },
      { title: "Gold (Au)", body: "5N. Wires, ingots, powder, sheets, pellets, targets." },
      { title: "Indium (In)", body: "5N, 6N, 7N. Ingots, rods, pellets, targets, granules." },
      { title: "Iron (Fe)", body: "4N to 7N. Ingots, pellets, targets." },
      { title: "Lead (Pb)", body: "5N, 6N, 7N. Ingots, rods, pellets, targets." },
      { title: "Nickel (Ni)", body: "4N, 5N. Sheets, ingots, powder, targets." },
      { title: "Selenium (Se)", body: "5N, 6N, 7N. Blocks, powder, targets." },
      { title: "Silver (Ag)", body: "5N. Wires, ingots, powder, sheets, pellets, targets." },
      { title: "Tellurium (Te)", body: "5N, 6N, 7N. Ingots, flakes, powder, sheets, targets." },
      { title: "Tin (Sn)", body: "5N, 6N. Wires, ingots, powder, sheets, targets." },
      { title: "Zinc (Zn)", body: "5N, 6N. Wires, ingots, powder, sheets, targets." },
    ],
  },
  {
    slug: "nuclear-grade",
    name: "Nuclear grade",
    short: "RCC-M and ASME III certified steel products",
    intro: "RCC-M and ASME III certified metal semi-products for the nuclear industry.",
    tiles: ["Fe", "Cr", "Ni"],
    elements: ["Fe", "Cr", "Ni"],
    image: "fusion",
    groups: [
      {
        title: "Bars, forgings and flanges",
        body: "Stainless and alloy steel (316L, 304L, AISI 660, 316LN-IG) to RCC-M M3301, M3304, M3306 and ASME SA-182, SA-479. Forgings and flanges to RCC-M M2301, ASME SA-105, SA-182. Reinforcing steel.",
      },
      {
        title: "Sheets and plates",
        body: "Structural and stainless steel to RCC-M M140 and ASME SA-240, including X6CrNiTi18-10 and X2CrNiMo17-12-2 for high-temperature, corrosive service.",
      },
      {
        title: "Seamless and welded tubes",
        body: "To RCC-M M3303 and ASME SA-312, for coolant transfer, pressure installations and heat exchangers.",
      },
      {
        title: "Structural profiles",
        body: "Angles, channels and I-beams in carbon and stainless steel, open and closed, for reactor load-bearing structures.",
      },
      {
        title: "Fasteners",
        body: "Bolts, nuts and washers to RCC-M M170 in 316L(N)-IG and 316LN, plus anchors and connectors for foundations and structures.",
      },
    ],
  },
  {
    slug: "high-entropy-alloys",
    name: "High-entropy alloys",
    short: "Refractory high-entropy alloys, HEA targets and parts",
    intro:
      "Multi-principal-element alloys for extreme environments, designed and made for space, fusion and aerospace work.",
    tiles: ["Nb", "Mo", "Ta", "W"],
    elements: ["W", "Mo", "Ta", "Nb", "Hf", "Zr"],
    image: "rhea-coupons",
    groups: [
      {
        title: "Refractory high-entropy alloys (RHEA)",
        body: "Alloys based on W, Mo, Ta, Nb, Hf and Zr for thermal and mechanical stability at very high temperature. Developed in the SPARK project, an ESA FIRST! award winner.",
      },
      {
        title: "HEA sputtering targets",
        body: "Targets in multi-principal-element alloys, for coatings that resist corrosion, wear and high-temperature oxidation.",
      },
      {
        title: "Custom HEA parts",
        body: "Design, manufacture and characterisation to your specification, from research samples to prototype parts.",
      },
    ],
  },
  {
    slug: "welding-electrodes",
    name: "Welding electrodes",
    short: "Tungsten, WLa, WCu, molybdenum and TZM electrodes",
    intro:
      "Resistance welding electrodes in pure tungsten, WLa, WT and WCu, molybdenum, and electrodes with tungsten or molybdenum inserts.",
    tiles: ["W", "Mo", "Cu"],
    elements: ["W", "Mo", "Cu", "La"],
    image: "machining",
    groups: [
      {
        title: "Why refractory electrodes",
        body: "High electrical conductivity and stability at temperature give a much longer service life than copper or copper-alloy electrodes.",
      },
      {
        title: "Materials",
        body: "Pure tungsten, WLa, WT, WCu, molybdenum and TZM, solid or as inserts in copper bodies.",
      },
    ],
  },
];

export const familyBySlug = (slug: string) => families.find((f) => f.slug === slug);

export const allMaterials = families.flatMap((f) =>
  (f.materials ?? []).map((m) => ({ ...m, family: f })),
);

// Element symbol → families that list it. Drives the periodic-table filter.
export function familiesForElement(symbol: string) {
  return families.filter((f) => f.elements.includes(symbol)).map((f) => f.slug);
}

export const catalogElements = Array.from(new Set(families.flatMap((f) => f.elements)));
