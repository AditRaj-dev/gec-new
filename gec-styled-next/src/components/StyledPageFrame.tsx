// Shared iframe wrapper that loads styled.html with a hash to activate a specific canvas
export default function StyledPageFrame({ page }: { page: 'home' | 'about' | 'teams' | 'initiatives' | 'stories' }) {
  return (
    <iframe
      className="styled-site-frame"
      src={`/styled.html#${page}`}
      title={`Galgotias Entrepreneurship Cell — ${page}`}
    />
  );
}
