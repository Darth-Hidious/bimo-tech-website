import type { Lang } from "@/lib/i18n/config";
import Privacy, { privacyMeta } from "@/views/Privacy";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return privacyMeta(lang as Lang);
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  return <Privacy lang={lang as Lang} />;
}
