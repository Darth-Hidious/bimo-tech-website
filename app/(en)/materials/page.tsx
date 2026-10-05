import Materials, { materialsMeta } from "@/views/Materials";

export const metadata = materialsMeta("en");

export default function Page() {
  return <Materials lang="en" />;
}
