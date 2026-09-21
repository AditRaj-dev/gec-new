export default function Home() {
  return (
    <main aria-label="Galgotias Entrepreneurship Cell website">
      <div id="navbar-brand-logo" className="site-logo-dock" aria-label="Galgotias Entrepreneurship Cell">
        <img src="/assets/gec-full-logo.svg" alt="Galgotias Entrepreneurship Cell" />
      </div>
      <iframe
        className="styled-site-frame"
        src="/styled.html"
        title="Galgotias Entrepreneurship Cell"
      />
    </main>
  );
}
