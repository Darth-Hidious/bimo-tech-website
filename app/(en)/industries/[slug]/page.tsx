import { content } from "@/lib/content";
import Industry, { industryMeta } from "@/views/Industry";

export const dynamicParams = false;

export function generateStaticParams() {
  return content("en").industries.map((i) => ({ slug: i.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return industryMeta("en", slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <Industry lang="en" slug={slug} />;
}
