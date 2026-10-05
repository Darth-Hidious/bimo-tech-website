import type { Lang } from "@/lib/i18n/config";
import Industries, { industriesMeta } from "@/views/Industries";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return industriesMeta(lang as Lang);
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  return <Industries lang={lang as Lang} />;
}
