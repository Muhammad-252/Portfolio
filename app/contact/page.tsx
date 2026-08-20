"use client";

import { FormEvent, useState } from "react";
import { Mail, Phone, Sparkles } from "lucide-react";
import Nav from "@/components/Nav";
import SocialLinks from "@/components/SocialLinks";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = "Portfolio enquiry from " + form.get("name");
    const body = "Name: " + form.get("name") + "\nEmail: " + form.get("email") + "\n\n" + form.get("message");
    setSent(true);
    window.location.href = "mailto:marslanprofessional@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  return <><Nav /><main className="container contact-page"><section className="contact-hero"><div><div className="kicker">Available for selected projects</div><h1>Let’s <span>talk.</span></h1><p>From a fresh idea to a more polished digital experience, let’s make your next move feel considered.</p><div className="contact-quick-links"><a href="mailto:marslanprofessional@gmail.com"><Mail size={17} />Email me</a><a href="https://wa.me/923015517804" target="_blank" rel="noreferrer"><Phone size={17} />WhatsApp</a></div></div><div className="contact-mark"><Sparkles size={31} /><span>MUHAMMAD<br />ARSLAN</span></div></section><section className="contact-layout"><form className="contact-form" onSubmit={submitForm}><div className="form-heading"><div className="kicker">Project enquiry</div><h2>Tell me what you’re building.</h2></div><div className="contact-field-grid"><label className="field"><span>Your name</span><input className="input" name="name" required placeholder="Your name" /></label><label className="field"><span>Email address</span><input className="input" name="email" required type="email" placeholder="you@company.com" /></label></div><label className="field"><span>How can I help?</span><textarea className="textarea" name="message" required placeholder="A short outline of your idea, goals or project timeline." /></label><div className="form-footer"><button className="pill primary form-submit" type="submit">Send enquiry <ArrowIcon /></button>{sent && <p className="form-note">Your email app is opening with your message ready to send.</p>}</div></form><aside className="contact-details"><div className="contact-detail-heading"><div className="kicker">Elsewhere online</div><p>Find project snapshots, case studies and more of my work.</p></div><SocialLinks variant="cards" /><div className="contact-direct"><span>Prefer a direct conversation?</span><a href="mailto:marslanprofessional@gmail.com">marslanprofessional@gmail.com</a></div></aside></section></main></>;
}

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}
