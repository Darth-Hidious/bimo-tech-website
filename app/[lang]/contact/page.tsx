import type { Lang } from "@/lib/i18n/config";
import Contact, { contactMeta } from "@/views/Contact";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return contactMeta(lang as Lang);
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  return <Contact lang={lang as Lang} />;
}
