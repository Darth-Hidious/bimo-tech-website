import Link from "next/link";
import { families } from "@/lib/catalog";
import { company, industries } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__grid">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <img src="/img/brand/bimo-materials-logo-white-header.png" alt="Bimo Materials" width={125} height={40} style={{ height: 40, width: "auto", alignSelf: "flex-start" }} />
            <p>Specialty metals, powders, targets and new alloys. Wrocław and Oxford.</p>
            <p>
              {company.address.join(", ")}
              <br />
              {company.oxford}
            </p>
            <p>ISO 9001:2015 · ISO 14001:2015</p>
          </div>
          <div>
            <h3>Materials</h3>
            <ul>
              {families.map((f) => (
                <li key={f.slug}>
                  <Link href={`/materials/${f.slug}/`}>{f.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Industries</h3>
            <ul>
              {industries.map((i) => (
                <li key={i.slug}>
                  <Link href={`/industries/${i.slug}/`}>{i.name}</Link>
                </li>
              ))}
            </ul>
            <h3 style={{ marginTop: 28 }}>Work with us</h3>
            <ul>
              <li><Link href="/manufacturing/">Manufacturing</Link></li>
              <li><Link href="/new-alloys/">New alloys</Link></li>
              <li><Link href="/contact/">Request a quote</Link></li>
            </ul>
          </div>
          <div>
            <h3>Company</h3>
            <ul>
              <li><Link href="/company/">About</Link></li>
              <li><Link href="/company/#news">News</Link></li>
              <li><Link href="/credits/">Picture credits</Link></li>
            </ul>
            <h3 style={{ marginTop: 28 }}>The Bimo group</h3>
            <ul>
              <li><a href="https://www.bimotech.pl/">Bimo Tech ↗</a></li>
              <li><a href="https://prism.mirdyne.com/">PRISM by Mirdyne ↗</a></li>
            </ul>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© 2026 Bimo Materials Ltd</span>
          <span>
            <Link href="/privacy/">Privacy</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
