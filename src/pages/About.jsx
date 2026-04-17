import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="container py-4 py-lg-5">
      <nav aria-label="breadcrumb" className="jp-breadcrumb-wrap mb-3">
        <ol className="breadcrumb jp-breadcrumb mb-0">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            About
          </li>
        </ol>
      </nav>
      <section className="card jp-rise p-4 p-lg-5">
        <p className="jp-eyebrow text-primary small fw-semibold mb-2">JobPortal</p>
        <h1 className="display-6 fw-bold mb-3">About</h1>
        <p className="text-muted lead fs-6 mb-0" style={{ maxWidth: '36rem' }}>
          We connect job seekers with recruiters in one streamlined experience — search, apply, and manage
          applications from a single dashboard.
        </p>
      </section>
    </div>
  );
}

export default About;
