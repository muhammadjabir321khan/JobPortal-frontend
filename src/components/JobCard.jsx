import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPostedTime } from '../utils/formatPostedTime';
import { IconBookmark, IconClock } from './JobMetaIcons';

/**
 * Presentational job card. Wrap in e.g. <div className="col-12 col-md-4"> for a 3-column row.
 */
function JobCard({
  title,
  companyName,
  location,
  salary,
  jobType,
  experienceLevel,
  description,
  postedAt,
  href = '#',
}) {
  const [bookmarked, setBookmarked] = useState(false);

  const salaryLabel =
    typeof salary === 'number'
      ? new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }).format(salary)
      : salary;

  const preview =
    description && description.length > 120 ? `${description.slice(0, 117)}…` : description;

  const timeLabel = formatPostedTime(postedAt);

  return (
    <article className="card jp-rise jp-job-card h-100 job-card">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
          <div className="min-w-0 flex-grow-1">
            <h3 className="h6 fw-semibold text-primary mb-1">{title}</h3>
            <p className="small fw-medium text-dark mb-0">{companyName}</p>
          </div>
          <button
            type="button"
            className={`btn btn-link p-1 job-card-bookmark text-primary ${bookmarked ? 'job-card-bookmark--active' : ''}`}
            aria-label={bookmarked ? 'Remove saved job' : 'Save job'}
            aria-pressed={bookmarked}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setBookmarked((v) => !v);
            }}
          >
            <IconBookmark filled={bookmarked} />
          </button>
        </div>

        {timeLabel && (
          <p className="small text-muted mb-2 d-flex align-items-center gap-1">
            <IconClock className="flex-shrink-0 opacity-75" />
            <span>{timeLabel}</span>
          </p>
        )}

        <ul className="list-unstyled small text-muted mb-3 flex-grow-1">
          <li className="mb-1">{location}</li>
          {salaryLabel != null && salaryLabel !== '' && (
            <li className="mb-1">{salaryLabel}</li>
          )}
          {jobType != null && jobType !== '' && <li className="mb-1">{jobType}</li>}
          {experienceLevel != null && experienceLevel !== '' && (
            <li>
              {typeof experienceLevel === 'number'
                ? `${experienceLevel}+ yrs experience`
                : experienceLevel}
            </li>
          )}
        </ul>
        {preview != null && preview !== '' && (
          <p className="small text-muted mb-3">{preview}</p>
        )}
        <Link to={href} className="btn btn-outline-primary btn-sm mt-auto stretched-link text-center">
          View job
        </Link>
      </div>
    </article>
  );
}

export default JobCard;
