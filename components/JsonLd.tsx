import { jsonLdScript, type JsonLd as Data } from "@/lib/structured-data";

/** schema.org data for search engines and AI assistants, as <script type="application/ld+json">. */
export default function JsonLd({ data }: { data: Data | null }) {
  if (!data) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(data) }} />;
}
