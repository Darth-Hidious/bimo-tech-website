import type { Lang } from "@/lib/i18n/config";
import Home, { homeMeta } from "@/views/Home";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return homeMeta(lang as Lang);
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  return <Home lang={lang as Lang} />;
}
