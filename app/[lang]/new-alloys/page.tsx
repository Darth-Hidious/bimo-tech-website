import type { Lang } from "@/lib/i18n/config";
import NewAlloys, { newAlloysMeta } from "@/views/NewAlloys";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return newAlloysMeta(lang as Lang);
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  return <NewAlloys lang={lang as Lang} />;
}
