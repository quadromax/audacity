"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="content-wrap page-loading">
      <p className="eyebrow">SIGNAL LOST</p>
      <h1>WRONG TURN.</h1>
      <p>
        Something interrupted the connection. Let’s get you back on the road.
      </p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
