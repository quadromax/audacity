export default function Loading() {
  return (
    <div className="content-wrap page-loading" role="status">
      <p className="eyebrow">TUNING INTO LEONIDA</p>
      <div className="loading-block skeleton" />
      <p>Loading the next case file…</p>
    </div>
  );
}
