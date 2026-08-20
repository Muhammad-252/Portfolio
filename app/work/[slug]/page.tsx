import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { demoProjects } from "@/lib/projects";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = demoProjects.find(project => project.slug === slug);
  if (!p) notFound();

  return <><header className="container nav case-nav"><Link href="/" className="logo">ARSLAN<i>.</i></Link><Link href="/work" className="pill">← All work</Link></header><main className="container case"><section className="case-hero"><div className="case-summary"><div className="kicker">Case study · {p.category}</div><h1>{p.title}</h1><p>{p.description}</p><div className="case-year">{p.year}</div></div><div className="case-cover"><img src={p.cover} alt={p.title} /><div className="case-cover-label">Selected work<br /><strong>{p.year}</strong></div></div></section><section className="case-info">{[["Role", p.role], ["Client", p.client], ["Duration", p.duration], ["Tools", p.tools.join(" · ")]].map(item => <div className="info" key={item[0]}><small>{item[0]}</small><b>{item[1]}</b></div>)}</section><section className="case-story"><div className="case-story-label"><div className="kicker">Behind the work</div><span>01—04</span></div><article className="case-body"><div><span className="case-number">01</span><h2>The challenge</h2><p>{p.challenge}</p></div><div><span className="case-number">02</span><h2>My approach</h2><p>{p.process}</p></div><div><span className="case-number">03</span><h2>The solution</h2><p>{p.solution}</p></div><div><span className="case-number">04</span><h2>Outcome</h2><p>{p.outcome}</p></div>{p.gallery.length > 0 && <div className="case-gallery">{p.gallery.map((image, index) => <img src={image} key={index} alt="Project screen" />)}</div>}<div className="case-actions">{p.figma && <a className="pill" href={p.figma}>View Figma <ArrowUpRight size={16} /></a>}{p.live && <a className="pill primary" href={p.live}>View live project <ArrowUpRight size={16} /></a>}</div></article></section></main></>;
}
