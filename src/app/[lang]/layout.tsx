import { LanguageProvider } from "../../context/LanguageContext";
import Header from "../../components/Header";
import CommandPalette from "../../components/CommandPalette";
import { Metadata } from "next";

export async function generateStaticParams() {
    return [{ lang: 'en' }, { lang: 'pl' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;

    const baseUrl = 'https://bimotech.pl'; // Replace with actual domain if different

    return {
        title: lang === 'pl' ? "BimoTech | ESA Prime" : "BimoTech | ESA Prime",
        description: lang === 'pl'
            ? "Zaawansowana inżynieria i rozwiązania agentowe."
            : "Advanced engineering and agentic solutions.",
        alternates: {
            canonical: `${baseUrl}/${lang}`,
            languages: {
                'en': `${baseUrl}/en`,
                'pl': `${baseUrl}/pl`,
                // Add other languages here as they are implemented
                // 'de': `${baseUrl}/de`,
            },
        },
    };
}

export default async function LangLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    return (
        <LanguageProvider initialLang={lang}>
            <Header />
            {children}
            <CommandPalette />
        </LanguageProvider>
    );
}
