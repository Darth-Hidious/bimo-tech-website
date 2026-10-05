import Credits, { creditsMeta } from "@/views/Credits";

export const metadata = creditsMeta("en");

export default function Page() {
  return <Credits lang="en" />;
}
