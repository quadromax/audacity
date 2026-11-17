import Link from "next/link";
export default function NotFound() {
  return (
    <section className="content-wrap page-loading">
      <p className="eyebrow">404 / OFF THE MAP</p>
      <h1>DEAD END.</h1>
      <p>This case file doesn’t exist.</p>
      <Link href="/" className="button">
        Back to Leonida
      </Link>
    </section>
  );
}
