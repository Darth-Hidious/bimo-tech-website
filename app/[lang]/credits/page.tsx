import type { Lang } from "@/lib/i18n/config";
import Credits, { creditsMeta } from "@/views/Credits";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return creditsMeta(lang as Lang);
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  return <Credits lang={lang as Lang} />;
}
