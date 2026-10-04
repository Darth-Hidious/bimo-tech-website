// Site-wide content: images and their credits, the path of the metal,
// services, industries, company history and news.

export type Img = {
  src?: string; // missing: rendered as a labelled placeholder until a photo exists
  alt: string;
  credit: string; // shown under the photo and on /credits
  license?: string;
  licenseUrl?: string;
  source?: string;
};

const OWN = "Bimo group, project SPARK";

export const images = {
  hearth: { src: "/img/own/arc-melting-hearth-1600.jpg", alt: "Raw metal pieces weighed and staged in the water-cooled copper hearth before a melt", credit: OWN },
  melt: { src: "/img/own/spark-melt.webp", alt: "An alloy button glowing orange inside the arc-melting furnace, seen through the viewport", credit: OWN },
  viewport: { src: "/img/own/arc-melting-viewport-800.jpg", alt: "A melt in progress seen through the chamber viewport", credit: OWN },
  charge: { src: "/img/own/spark-charge.webp", alt: "Small pieces of raw metal laid out before a melt", credit: OWN },
  hearthCharge: { src: "/img/own/spark-hearth-charge-sq.webp", alt: "Raw metal loaded into the hollows of a copper hearth", credit: OWN },
  furnace: { src: "/img/own/spark-furnace-wide.webp", alt: "The vacuum arc-melting furnace open above its copper hearth", credit: OWN },
  button: { src: "/img/own/spark-button.webp", alt: "A cast alloy button with a crystalline surface, resting in a red lid", credit: OWN },
  buttonDark: { src: "/img/own/as-cast-alloy-button-800.jpg", alt: "An as-cast alloy button showing its dendritic surface", credit: OWN },
  coupons: { src: "/img/own/rhea-ultra-coupons-800.jpg", alt: "Polished refractory high-entropy alloy coupons mounted for testing", credit: OWN },
  coupon: { src: "/img/own/ippt-coupon.webp", alt: "A small round test coupon held between two fingers", credit: OWN },
  machining: { src: "/img/own/machining.webp", alt: "A metal block being milled, covered in bright curled chips", credit: OWN },
  powder: {
    src: "/img/ext/route-powder.webp", alt: "Spherical metal powder under an electron microscope",
    credit: "3D Lab (3dlab.pl)", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  },
  printer: {
    src: "/img/ext/route-powder-bed.webp", alt: "Test pieces standing in metal powder inside a laser powder-bed printer",
    credit: "René Volfík, FZU – Institute of Physics of the Czech Academy of Sciences", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  space: {
    src: "/img/ext/space.webp", alt: "The Aestus rocket engine in an altitude test stand",
    credit: "DLR", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
  },
  vulcain: {
    src: "/img/ext/dlr-vulcain2-p5.webp", alt: "A Vulcain 2 rocket engine firing on a test stand",
    credit: "DLR", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
  },
  fusion: {
    src: "/img/ext/fusion.webp", alt: "Carbon wall tiles being fitted inside the Wendelstein 7-X fusion experiment",
    credit: "Christopher Roux, EUROfusion", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  },
  defence: {
    src: "/img/ext/defence.webp", alt: "The afterburner of a Eurojet EJ200 jet engine seen from behind",
    credit: "Julian Herzog", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  },
  tungstenCrystals: {
    src: "/img/ext/supply.webp", alt: "Tungsten rods grown over with tungsten crystals",
    credit: "Alchemist-hp (pse-mendelejew.de)", license: "Free Art License 1.3", licenseUrl: "https://artlibre.org/licence/lal/en/",
  },
  wafer: {
    src: "/img/ext/tech.webp", alt: "A 300 mm silicon test wafer covered in chips",
    credit: "ISCIX-Ex", license: "CC0 1.0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
  prism: { src: "/img/own/prism-recipes.png", alt: "PRISM's generative models building alloy recipes step by step, drawn as a branching tree", credit: "Mirdyne, PRISM" },

  // Slots still waiting for a photo. The image search fills these in.
  pvd: { alt: "PVD coating chamber", credit: "" },
  delivery: { alt: "Crated metal parts ready to ship", credit: "" },
  highPurity: { alt: "High-purity metal pellets", credit: "" },
  nuclearSteel: { alt: "Stainless steel forged bars", credit: "" },
  electrode: { alt: "Resistance welding electrode tips", credit: "" },
  forging: { alt: "A hot billet in a forging press", credit: "" },
  coldSpray: { alt: "A cold spray nozzle coating a part", credit: "" },
  waterTreatment: { alt: "A water treatment plant", credit: "" },
  wroclaw: { alt: "Wrocław, Poland", credit: "" },
  oxford: { alt: "Oxford, United Kingdom", credit: "" },
  refractoryStock: { alt: "Refractory metal sheet, rod and wire", credit: "" },
  targets: { alt: "Sputtering targets", credit: "" },
  specialty: { alt: "Titanium and nickel alloy bar stock", credit: "" },
  drawing: { alt: "An engineering drawing of a part", credit: "" },
} satisfies Record<string, Img>;

export type ImageKey = keyof typeof images;

// The homepage spine: everything we sell sits on one path.
export const path: { n: string; title: string; line: string; img: ImageKey; link: { label: string; href: string } }[] = [
  { n: "01", title: "Pure metal in", line: "Metals from 4N to 7N purity, bought and refined to specification.", img: "charge", link: { label: "High-purity metals", href: "/materials/high-purity/" } },
  { n: "02", title: "Melted to a recipe", line: "Arc-melted under argon in a water-cooled copper hearth.", img: "melt", link: { label: "New alloys", href: "/new-alloys/" } },
  { n: "03", title: "Made into powder", line: "Fine spherical powder for printing, spraying and research.", img: "powder", link: { label: "Powders", href: "/materials/powders/" } },
  { n: "04", title: "Printed, forged or machined", line: "Parts to drawing, machined to ±0.01 mm.", img: "printer", link: { label: "Manufacturing", href: "/manufacturing/" } },
  { n: "05", title: "Coated", line: "PVD and cold-spray coatings, and sputtering targets for your own line.", img: "pvd", link: { label: "Coatings and targets", href: "/manufacturing/#pvd-coating" } },
  { n: "06", title: "Tested", line: "Cut into coupons and tested. Every lot ships with its certificate.", img: "coupons", link: { label: "Testing", href: "/manufacturing/#testing" } },
  { n: "07", title: "Delivered", line: "From a test batch of a few grams to a full container.", img: "delivery", link: { label: "Industries", href: "/industries/" } },
];

export const outcomes: { word: string; line: string; tag: string; href: string; img: ImageKey }[] = [
  { word: "Hotter", line: "Refractory high-entropy alloys for rocket-engine hot sections.", tag: "Space · SPARK", href: "/new-alloys/", img: "buttonDark" },
  { word: "Purer", line: "Metals up to 7N, 99.99999%, as pellets, ingots and targets.", tag: "Electronics", href: "/materials/high-purity/", img: "highPurity" },
  { word: "Tighter", line: "Tungsten and molybdenum machined to ±0.01 mm.", tag: "Fusion · industry", href: "/manufacturing/#machining", img: "machining" },
  { word: "Certified", line: "RCC-M and ASME III steel, with the paperwork.", tag: "Nuclear", href: "/materials/nuclear-grade/", img: "nuclearSteel" },
  { word: "Printable", line: "Spherical, low-oxygen powders for laser powder-bed fusion.", tag: "Additive", href: "/materials/powders/", img: "powder" },
  { word: "Longer-lasting", line: "Tungsten and molybdenum electrodes that outlast copper ones.", tag: "Resistance welding", href: "/materials/welding-electrodes/", img: "electrode" },
];

export type Service = { id: string; name: string; line: string; detail: string[]; img: ImageKey };

export const services: Service[] = [
  { id: "machining", name: "CNC machining", line: "Turning, milling, drilling and grinding of difficult metals, to ±0.01 mm.", detail: ["Tungsten, molybdenum, tantalum, niobium, titanium", "Prototypes to production runs", "Tolerances down to ±0.01 mm"], img: "machining" },
  { id: "forging", name: "Forging", line: "Free forging and die forging.", detail: ["Carbon and stainless steels", "Nickel alloys", "Titanium"], img: "forging" },
  { id: "casting-printing", name: "Casting and metal 3D printing", line: "Iron, steel and alloy castings, and laser powder-bed printing.", detail: ["Castings in iron, steel and alloys", "Laser powder-bed fusion", "Printing powders from our own range"], img: "printer" },
  { id: "pvd-coating", name: "PVD coating", line: "Physical vapour deposition in high vacuum.", detail: ["TiN, TiCN, TiAlN, AlTiN", "CrN, AlCrN", "DLC"], img: "pvd" },
  { id: "cold-spray", name: "Cold spray", line: "Metal coatings applied by a cold gas process, without melting the part underneath.", detail: ["Cold gas process", "The substrate is not melted"], img: "coldSpray" },
  { id: "testing", name: "Testing and certificates", line: "Every lot carries its chemistry, process and inspection record.", detail: ["Material testing on request", "Records per lot"], img: "coupon" },
];

export const projectSteps = [
  "Calculations",
  "Detailed design",
  "Technical documentation",
  "Partner cooperation",
  "Materials and production",
  "Assembly, integration and testing",
  "Commissioning",
];

export type Industry = {
  slug: string;
  name: string;
  line: string;
  intro: string;
  img: ImageKey;
  columns: { title: string; body: string }[];
  materials: { label: string; href: string }[];
  services: { label: string; href: string }[];
  programmes?: string[];
};

export const industries: Industry[] = [
  {
    slug: "space",
    name: "Space",
    line: "Propulsion, thermal protection and structures. ESA and ArianeGroup.",
    intro: "Materials for launchers and spacecraft, from refractory stock to new alloys for the hottest parts of rocket engines.",
    img: "space",
    columns: [
      { title: "Developing", body: "Refractory high-entropy alloys for next-generation rocket engines, in the SPARK project with ArianeGroup. ESA FIRST! Propulsion award, 2025." },
      { title: "Making", body: "Parts for propulsion systems, thermal shields and satellite structures, with materials and processes that follow ESA and ECSS requirements." },
      { title: "Supplying", body: "Niobium, tantalum, molybdenum, tungsten and rhenium stock, and titanium and nickel alloys." },
    ],
    materials: [
      { label: "Refractory metals", href: "/materials/refractory-metals/" },
      { label: "High-entropy alloys", href: "/materials/high-entropy-alloys/" },
      { label: "Nickel alloys", href: "/materials/specialty-alloys/nickel-alloys/" },
    ],
    services: [
      { label: "New alloys", href: "/new-alloys/" },
      { label: "CNC machining", href: "/manufacturing/#machining" },
    ],
    programmes: ["ESA", "ArianeGroup"],
  },
  {
    slug: "fusion-nuclear",
    name: "Fusion and nuclear",
    line: "Titanium and steel for ITER. RCC-M and ASME III metals.",
    intro: "Metals for reactors, from ITER's construction to the parts that face the plasma.",
    img: "fusion",
    columns: [
      { title: "Supplied", body: "Titanium and steel for the construction of ITER, the international fusion reactor in Cadarache, France." },
      { title: "Made", body: "Tungsten parts for first walls, divertors and neutron shields, with experience on ITER and DEMO projects." },
      { title: "Certified", body: "RCC-M and ASME III bars, forgings, flanges, plates, tubes, profiles and fasteners, in 316L, 304L and 316LN-IG." },
    ],
    materials: [
      { label: "Tungsten", href: "/materials/refractory-metals/tungsten/" },
      { label: "Titanium", href: "/materials/specialty-alloys/titanium/" },
      { label: "Nuclear grade", href: "/materials/nuclear-grade/" },
      { label: "Zirconium", href: "/materials/refractory-metals/zirconium/" },
    ],
    services: [
      { label: "CNC machining of tungsten", href: "/manufacturing/#machining" },
      { label: "Testing and certificates", href: "/manufacturing/#testing" },
    ],
    programmes: ["ITER", "Fusion for Energy", "NCBJ"],
  },
  {
    slug: "aerospace-defence",
    name: "Aerospace and defence",
    line: "Hot-section alloys and coatings for engines.",
    intro: "High-temperature alloys, coatings and machined parts for engines and airframes.",
    img: "defence",
    columns: [
      { title: "Alloys", body: "Nickel alloys including Inconel 718 and 625, Hastelloy X, Nimonic and Waspaloy, and titanium." },
      { title: "Coatings", body: "PVD coatings such as TiAlN and CrN, and cold-spray coatings." },
      { title: "Powders", body: "Spherical nickel, titanium and aluminium powders for printed parts." },
    ],
    materials: [
      { label: "Nickel alloys", href: "/materials/specialty-alloys/nickel-alloys/" },
      { label: "Titanium", href: "/materials/specialty-alloys/titanium/" },
      { label: "Powders", href: "/materials/powders/" },
    ],
    services: [
      { label: "PVD coating", href: "/manufacturing/#pvd-coating" },
      { label: "Cold spray", href: "/manufacturing/#cold-spray" },
    ],
  },
  {
    slug: "electronics-thin-film",
    name: "Electronics and thin film",
    line: "Sputtering targets and 6N–7N metals.",
    intro: "Sputtering targets, evaporation materials and high-purity metals for thin-film and semiconductor work.",
    img: "wafer",
    columns: [
      { title: "Targets", body: "Pure metal, alloy, ceramic, oxide and chalcogenide targets, bonded or unbonded, for any system." },
      { title: "High purity", body: "Twenty elements from 4N to 7N, including gallium, indium, tellurium and copper." },
      { title: "Powders", body: "Nanopowders and oxide powders, including ITO." },
    ],
    materials: [
      { label: "Sputtering targets", href: "/materials/sputtering-targets/" },
      { label: "High purity", href: "/materials/high-purity/" },
      { label: "Powders", href: "/materials/powders/" },
    ],
    services: [{ label: "PVD coating", href: "/manufacturing/#pvd-coating" }],
  },
  {
    slug: "water-treatment",
    name: "Water treatment",
    line: "AOP reactors and corrosion-resistant parts.",
    intro: "Reactors, photocatalytic coatings and corrosion-resistant parts for water and wastewater treatment.",
    img: "waterTreatment",
    columns: [
      { title: "AOP reactors", body: "Advanced oxidation reactors with TiO₂-based photocatalytic coatings." },
      { title: "Filtration", body: "Materials and parts for mechanical, membrane and chemical filtration of drinking and industrial water." },
      { title: "Corrosion-resistant parts", body: "Titanium, zirconium, duplex and super duplex steel for aggressive water." },
    ],
    materials: [
      { label: "Titanium", href: "/materials/specialty-alloys/titanium/" },
      { label: "Zirconium", href: "/materials/refractory-metals/zirconium/" },
      { label: "Stainless steel", href: "/materials/specialty-alloys/stainless-steel/" },
    ],
    services: [{ label: "Components and devices", href: "/manufacturing/#components" }],
  },
];

export const timeline = [
  { year: "1992", text: "BIMO starts supplying metals in Wrocław." },
  { year: "2013", text: "Bimo Tech takes its current form." },
  { year: "2022", text: "Titanium and steel for the construction of ITER." },
  { year: "2025", text: "ESA FIRST! Propulsion award for SPARK." },
  { year: "2026", text: "Bimo Materials Ltd opens in Oxford." },
];

export const news = [
  { date: "2026-09-11", tag: "Company", title: "Bimo Materials Ltd opens in Oxford", body: "A new company in Oxford, United Kingdom, to take Bimo's advanced materials work to international customers." },
  { date: "2025-04-15", tag: "ESA FIRST!", title: "SPARK wins an ESA FIRST! Propulsion award", body: "ESA selected SPARK in the Materials and Processes category: 16 winners from 40 proposals by more than 60 organisations in 12 member states." },
  { date: "2024-11-20", tag: "R&D", title: "Component and device development", body: "The R&D team develops components and devices for industry and science." },
  { date: "2023-10-23", tag: "Water", title: "Clean water from wastewater", body: "A treatment process combining a membrane bioreactor with advanced oxidation." },
  { date: "2022-03-29", tag: "Fusion", title: "Supplying the construction of ITER", body: "Titanium and steel for the international fusion reactor in France." },
];

export const company = {
  // Placeholders until Bimo Materials has its own contact details.
  email: "info@bimomaterials.com",
  phone: "",
  address: ["ul. Francuska 11", "54-405 Wrocław, Poland"],
  oxford: "Oxford, United Kingdom",
};
