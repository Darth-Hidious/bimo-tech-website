import Manufacturing, { manufacturingMeta } from "@/views/Manufacturing";

export const metadata = manufacturingMeta("en");

export default function Page() {
  return <Manufacturing lang="en" />;
}
