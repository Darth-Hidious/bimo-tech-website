import type { Metadata } from "next";
import RootShell, { rootMetadata } from "@/components/RootShell";
import { isLang, OTHER_LANGS, type Lang } from "@/lib/i18n/config";

export { viewport } from "@/components/RootShell";
export const dynamicParams = false;

export function generateStaticParams() {
  return OTHER_LANGS.map((lang) => ({ lang }));
}

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return rootMetadata(isLang(lang) ? lang : "en");
}

export default async function LangLayout({ children, params }: Props & { children: React.ReactNode }) {
  const { lang } = await params;
  return <RootShell lang={isLang(lang) ? (lang as Lang) : "en"}>{children}</RootShell>;
}
