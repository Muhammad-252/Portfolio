import { ArrowUpRight, Instagram, Linkedin } from "lucide-react";

const profiles = [
  {
    label: "LinkedIn",
    detail: "Professional network",
    href: "https://www.linkedin.com/in/muhammad-arslan-pak786/",
    icon: <Linkedin size={18} />,
  },
  {
    label: "Instagram",
    detail: "Behind the scenes",
    href: "https://www.instagram.com/muhammadarslan112/",
    icon: <Instagram size={18} />,
  },
  {
    label: "Behance",
    detail: "Design case studies",
    href: "https://www.behance.net/muhammadarslan294",
    icon: <span className="behance-icon">Be</span>,
  },
  {
    label: "GitHub",
    detail: "Code repositories",
    href: "https://github.com/Muhammad-252",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    ),
  },
];

export default function SocialLinks({
  variant = "icons",
}: {
  variant?: "icons" | "cards";
}) {
  return (
    <div
      className={
        variant === "cards" ? "social-links social-cards" : "social-links"
      }
    >
      {profiles.map((profile) => (
        <a
          key={profile.label}
          href={profile.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={profile.label}
        >
          <span className="social-icon">{profile.icon}</span>
          {variant === "cards" && (
            <span className="social-copy">
              <strong>{profile.label}</strong>
              <small>{profile.detail}</small>
            </span>
          )}
          {variant === "cards" && (
            <ArrowUpRight className="social-arrow" size={17} />
          )}
        </a>
      ))}
    </div>
  );
}
