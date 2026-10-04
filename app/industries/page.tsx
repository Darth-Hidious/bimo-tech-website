import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/Photo";
import { industries } from "@/lib/site";

export const metadata: Metadata = {
  title: "Industries",
  description: "Space, fusion and nuclear, aerospace and defence, electronics and thin film, water treatment.",
};

export default function IndustriesPage() {
  return (
    <section className="section">
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <span>Industries</span>
        </nav>
        <div className="head">
          <h1 className="display">Where our metals go</h1>
          <p className="lead">The same catalog and workshop serve very different jobs. Pick yours to see what we supply and make for it.</p>
        </div>
        <div className="grid grid--3">
          {industries.map((i) => (
            <Link href={`/industries/${i.slug}/`} key={i.slug} className="way">
              <Photo img={i.img} ratio="4 / 3" />
              <h2 className="subtitle">{i.name}</h2>
              <p className="muted">{i.line}</p>
              <span className="link-arrow">Open {i.name.toLowerCase()} →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
