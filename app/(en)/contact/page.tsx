import Contact, { contactMeta } from "@/views/Contact";

export const metadata = contactMeta("en");

export default function Page() {
  return <Contact lang="en" />;
}
