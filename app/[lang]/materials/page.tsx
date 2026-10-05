import type { Lang } from "@/lib/i18n/config";
import Materials, { materialsMeta } from "@/views/Materials";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return materialsMeta(lang as Lang);
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  return <Materials lang={lang as Lang} />;
}
