import type { Lang } from "@/lib/i18n/config";
import Manufacturing, { manufacturingMeta } from "@/views/Manufacturing";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return manufacturingMeta(lang as Lang);
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  return <Manufacturing lang={lang as Lang} />;
}
