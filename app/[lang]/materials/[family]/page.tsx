import { content } from "@/lib/content";
import type { Lang } from "@/lib/i18n/config";
import Family, { familyMeta } from "@/views/Family";

export const dynamicParams = false;

export function generateStaticParams() {
  return content("en").families.map((f) => ({ family: f.slug }));
}

type Props = { params: Promise<{ lang: string; family: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang, family } = await params;
  return familyMeta(lang as Lang, family);
}

export default async function Page({ params }: Props) {
  const { lang, family } = await params;
  return <Family lang={lang as Lang} family={family} />;
}
