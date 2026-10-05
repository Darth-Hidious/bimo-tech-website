import { content } from "@/lib/content";
import type { Lang } from "@/lib/i18n/config";
import Industry, { industryMeta } from "@/views/Industry";

export const dynamicParams = false;

export function generateStaticParams() {
  return content("en").industries.map((i) => ({ slug: i.slug }));
}

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  return industryMeta(lang as Lang, slug);
}

export default async function Page({ params }: Props) {
  const { lang, slug } = await params;
  return <Industry lang={lang as Lang} slug={slug} />;
}
