import type { Lang } from "@/lib/i18n/config";
import Company, { companyMeta } from "@/views/Company";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return companyMeta(lang as Lang);
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  return <Company lang={lang as Lang} />;
}
