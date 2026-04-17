import { Link } from 'react-router-dom';
import { formatPostedTime } from '../utils/formatPostedTime';

const STATUS_STYLES = {
  pending: { label: 'Pending', className: 'text-bg-warning' },
  accepted: { label: 'Accepted', className: 'text-bg-success' },
  rejected: { label: 'Rejected', className: 'text-bg-secondary' },
};

/**
 * List of jobs the current user has applied to (design-only).
 */
function AppliedJobsList({ items = [] }) {
  if (!items.length) {
    return (
      <div className="text-center text-muted py-5 px-3 profile-applied-empty">
        <p className="mb-1 fw-medium">No applications yet</p>
        <p className="small mb-3">Browse jobs and apply to roles you like.</p>
        <Link to="/jobs" className="btn btn-primary btn-sm">
          Browse jobs
        </Link>
      </div>
    );
  }

  return (
    <ul className="list-group list-group-flush applied-jobs-list">
      {items.map((row) => {
        const { job } = row;
        const meta = STATUS_STYLES[row.status] || STATUS_STYLES.pending;
        const companyName =
          typeof job.company === 'object' && job.company?.name
            ? job.company.name
            : 'Company';
        const appliedRaw = formatPostedTime(row.appliedAt);
        const appliedShort = appliedRaw ? appliedRaw.replace(/^Posted\s+/i, '').trim() : '';

        return (
          <li
            key={row.applicationId || row._id}
            className="list-group-item d-flex flex-column flex-md-row flex-wrap align-items-md-center gap-3 py-3 applied-jobs-list-item"
          >
            <div className="flex-grow-1 min-w-0">
              <Link
                to={`/jobs/${job._id}`}
                className="fw-semibold text-primary text-decoration-none"
              >
                {job.title}
              </Link>
              <div className="small text-muted">{companyName}</div>
              <div className="small text-muted">{job.location}</div>
              {appliedShort && (
                <div className="small text-muted mt-1">Applied {appliedShort}</div>
              )}
            </div>
            <div className="d-flex align-items-center flex-wrap gap-2 ms-md-auto">
              <span className={`badge rounded-pill ${meta.className}`}>{meta.label}</span>
              {row.resumeUrl ? (
                <a
                  href={row.resumeUrl}
                  className="btn btn-sm btn-outline-secondary position-relative z-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CV
                </a>
              ) : null}
              <Link to={`/jobs/${job._id}`} className="btn btn-sm btn-outline-primary position-relative z-1">
                View job
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default AppliedJobsList;
