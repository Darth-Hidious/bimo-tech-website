import Industries, { industriesMeta } from "@/views/Industries";

export const metadata = industriesMeta("en");

export default function Page() {
  return <Industries lang="en" />;
}
