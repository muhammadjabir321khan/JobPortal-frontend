import { useState } from 'react';
import { formatPostedTime } from '../utils/formatPostedTime';

const STATUS_STYLES = {
  pending: { label: 'Pending', className: 'text-bg-warning' },
  accepted: { label: 'Accepted', className: 'text-bg-success' },
  rejected: { label: 'Rejected', className: 'text-bg-secondary' },
};

function initials(name) {
  if (!name || typeof name !== 'string') return '?';
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

function normalizeRow(row) {
  const id = row.id || row._id;
  const name = row.name || row.applicant?.name || 'Candidate';
  const email = row.email || row.applicant?.email || '';
  const appliedAt = row.appliedAt || row.createdAt;
  const status = row.status || 'pending';
  const coverLetter = row.coverLetter || '';
  const resumeUrl = row.resumeUrl || '';
  const resumeOriginalName = row.resumeOriginalName || 'CV';
  return { id, name, email, appliedAt, status, coverLetter, resumeUrl, resumeOriginalName };
}

/**
 * Applications for a job — supports API documents and optional status actions.
 */
function ApplicantsList({ applicants = [], onStatusChange }) {
  const [openId, setOpenId] = useState(null);

  if (!applicants.length) {
    return (
      <div className="text-center text-muted py-5 px-3 applicants-list-empty">
        <p className="mb-1 fw-medium">No applications yet</p>
        <p className="small mb-0">When candidates apply, they will appear here.</p>
      </div>
    );
  }

  return (
    <ul className="list-group list-group-flush applicants-list">
      {applicants.map((raw) => {
        const row = normalizeRow(raw);
        const meta = STATUS_STYLES[row.status] || STATUS_STYLES.pending;
        const appliedLabel = formatPostedTime(row.appliedAt);

        return (
          <li
            key={row.id}
            className="list-group-item flex-column align-items-start gap-2 py-3 applicants-list-item"
          >
            <div className="d-flex flex-wrap align-items-center gap-3 w-100">
              <div
                className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center flex-shrink-0 applicants-list-avatar"
                aria-hidden
              >
                {initials(row.name)}
              </div>
              <div className="flex-grow-1 min-w-0">
                <div className="fw-semibold text-dark">{row.name}</div>
                <div className="small text-muted text-truncate">{row.email}</div>
                {appliedLabel && (
                  <div className="small text-muted mt-1">
                    Applied {appliedLabel.replace(/^Posted\s/i, '')}
                  </div>
                )}
              </div>
              <div className="d-flex flex-wrap align-items-center gap-2 ms-auto">
                <span className={`badge rounded-pill ${meta.className}`}>{meta.label}</span>
                {row.resumeUrl ? (
                  <a
                    href={row.resumeUrl}
                    className="btn btn-sm btn-outline-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                    download={row.resumeOriginalName}
                  >
                    Download CV
                  </a>
                ) : null}
                {row.coverLetter ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    aria-expanded={openId === row.id}
                    onClick={() => setOpenId((cur) => (cur === row.id ? null : row.id))}
                  >
                    {openId === row.id ? 'Hide note' : 'Cover letter'}
                  </button>
                ) : null}
                {onStatusChange && row.status === 'pending' ? (
                  <div className="btn-group" role="group" aria-label="Update application">
                    <button
                      type="button"
                      className="btn btn-sm btn-success"
                      onClick={() => onStatusChange(row.id, 'accepted')}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onStatusChange(row.id, 'rejected')}
                    >
                      Reject
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
            {openId === row.id && row.coverLetter ? (
              <p className="small text-body-secondary mb-0 mt-2 w-100" style={{ whiteSpace: 'pre-wrap' }}>
                {row.coverLetter}
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export default ApplicantsList;
