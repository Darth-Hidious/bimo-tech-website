import { content } from "@/lib/content";
import Family, { familyMeta } from "@/views/Family";

export const dynamicParams = false;

export function generateStaticParams() {
  return content("en").families.map((f) => ({ family: f.slug }));
}

type Props = { params: Promise<{ family: string }> };

export async function generateMetadata({ params }: Props) {
  const { family } = await params;
  return familyMeta("en", family);
}

export default async function Page({ params }: Props) {
  const { family } = await params;
  return <Family lang="en" family={family} />;
}
