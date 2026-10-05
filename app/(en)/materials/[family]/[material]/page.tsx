import { content } from "@/lib/content";
import Material, { materialMeta } from "@/views/Material";

export const dynamicParams = false;

export function generateStaticParams() {
  return content("en").allMaterials.map((m) => ({ family: m.family.slug, material: m.slug }));
}

type Props = { params: Promise<{ family: string; material: string }> };

export async function generateMetadata({ params }: Props) {
  const { family, material } = await params;
  return materialMeta("en", family, material);
}

export default async function Page({ params }: Props) {
  const { family, material } = await params;
  return <Material lang="en" family={family} material={material} />;
}
