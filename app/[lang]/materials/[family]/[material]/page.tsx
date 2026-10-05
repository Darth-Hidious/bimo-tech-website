import { content } from "@/lib/content";
import type { Lang } from "@/lib/i18n/config";
import Material, { materialMeta } from "@/views/Material";

export const dynamicParams = false;

export function generateStaticParams() {
  return content("en").allMaterials.map((m) => ({ family: m.family.slug, material: m.slug }));
}

type Props = { params: Promise<{ lang: string; family: string; material: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang, family, material } = await params;
  return materialMeta(lang as Lang, family, material);
}

export default async function Page({ params }: Props) {
  const { lang, family, material } = await params;
  return <Material lang={lang as Lang} family={family} material={material} />;
}
