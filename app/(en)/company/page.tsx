import Company, { companyMeta } from "@/views/Company";

export const metadata = companyMeta("en");

export default function Page() {
  return <Company lang="en" />;
}
