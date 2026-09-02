import Link from "next/link";
export default function Nav() {
  return (
    <header className="container nav">
      <Link href="/" className="logo">
        ARSLAN<i>.</i>
      </Link>
      <nav className="navlinks">
        <Link href="/work">Work</Link>
        <a href="/#about">About</a>
        <a href="/#services">Services</a>
        <Link href="/blog">Blog</Link>
        <Link href="/contact">Contact</Link>
      </nav>
      <Link className="pill primary" href="/contact">
        Let's talk ↗
      </Link>
    </header>
  );
}
