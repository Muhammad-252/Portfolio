import { ArrowUpRight, Instagram, Linkedin } from "lucide-react";

const profiles = [
  { label: "LinkedIn", detail: "Professional network", href: "https://www.linkedin.com/in/muhammad-arslan-pak786/", icon: <Linkedin size={18} /> },
  { label: "Instagram", detail: "Behind the scenes", href: "https://www.instagram.com/muhammadarslan112/", icon: <Instagram size={18} /> },
  { label: "Behance", detail: "Design case studies", href: "https://www.behance.net/muhammadarslan294", icon: <span className="behance-icon">Be</span> },
];

export default function SocialLinks({ variant = "icons" }: { variant?: "icons" | "cards" }) {
  return <div className={variant === "cards" ? "social-links social-cards" : "social-links"}>{profiles.map(profile => <a key={profile.label} href={profile.href} target="_blank" rel="noreferrer" aria-label={profile.label}><span className="social-icon">{profile.icon}</span>{variant === "cards" && <span className="social-copy"><strong>{profile.label}</strong><small>{profile.detail}</small></span>}{variant === "cards" && <ArrowUpRight className="social-arrow" size={17} />}</a>)}</div>;
}
