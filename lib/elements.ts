// Periodic table layout: one string per row, 18 columns. "." is an empty
// cell, "*" and "**" mark the lanthanide and actinide gaps.
const ROWS = [
  "H . . . . . . . . . . . . . . . . He",
  "Li Be . . . . . . . . . . B C N O F Ne",
  "Na Mg . . . . . . . . . . Al Si P S Cl Ar",
  "K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr",
  "Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe",
  "Cs Ba * Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn",
  "Fr Ra ** Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og",
  "",
  ". . La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu .",
  ". . Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr .",
];

const ORDER =
  "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr " +
  "Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu " +
  "Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr " +
  "Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og";

const Z = new Map(ORDER.split(" ").map((s, i) => [s, i + 1]));

export const atomicNumber = (symbol: string) => Z.get(symbol);

export type Cell = { symbol: string; z?: number; row: number; col: number; gap?: boolean };

export const cells: Cell[] = ROWS.flatMap((line, r) =>
  line
    ? line.split(" ").flatMap((s, c) =>
        s === "." ? [] : [{ symbol: s.startsWith("*") ? "" : s, z: Z.get(s), row: r + 1, col: c + 1, gap: s.startsWith("*") }],
      )
    : [],
);
