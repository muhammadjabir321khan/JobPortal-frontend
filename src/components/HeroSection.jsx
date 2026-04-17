import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HeroSection({
  title = 'Find your next role',
  subtitle = 'Search roles, skills, or companies — all in one place on JobPortal.',
}) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate({ pathname: '/jobs', search: `?q=${encodeURIComponent(q)}` });
  }

  return (
    <section className="jp-hero mb-4" aria-labelledby="hero-heading">
      <div className="jp-hero__glow" aria-hidden />
      <div className="container py-5 px-3 position-relative">
        <p className="jp-hero__eyebrow text-uppercase small fw-semibold mb-2">Careers</p>
        <h1 id="hero-heading" className="jp-hero__title display-5 fw-bold mb-3">
          {title}
        </h1>
        <p className="jp-hero__lead lead mb-4 mx-auto col-lg-9">{subtitle}</p>
        <form
          onSubmit={handleSubmit}
          className="mx-auto col-lg-8 col-xl-7"
          role="search"
          aria-label="Search jobs"
        >
          <div className="jp-hero-search input-group input-group-lg shadow-sm">
            <input
              type="search"
              name="job-search"
              className="form-control border-0 jp-hero-search__input"
              placeholder="Job title, keywords, or company"
              aria-label="Search jobs"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn jp-hero-search__btn px-4 fw-semibold">
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default HeroSection;
