import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppliedJobsList from '../components/AppliedJobsList';
import ProfileEditModal from '../components/ProfileEditModal';
import { getMyApplications } from '../services/applicationService';

function selectUser(state) {
  return state.auth?.data?.user ?? null;
}

function mapApplicationForList(row) {
  return {
    applicationId: row._id,
    status: row.status,
    appliedAt: row.createdAt,
    resumeUrl: row.resumeUrl || '',
    job: row.job || { _id: '', title: 'Job unavailable', company: null, location: '' },
  };
}

/** Profile with live applied jobs for students when logged in. */
function Profile() {
  const user = useSelector(selectUser);
  const [editOpen, setEditOpen] = useState(false);
  const [appliedItems, setAppliedItems] = useState([]);
  const [appliedLoading, setAppliedLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== 'student') {
      setAppliedItems([]);
      return;
    }
    let cancelled = false;
    setAppliedLoading(true);
    getMyApplications()
      .then((res) => {
        const rows = res.data?.data || [];
        if (!cancelled) setAppliedItems(rows.map(mapApplicationForList));
      })
      .catch(() => {
        if (!cancelled) setAppliedItems([]);
      })
      .finally(() => {
        if (!cancelled) setAppliedLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.role, user?._id]);

  const displayName = user?.name || 'Your name';
  const email = user?.email || 'you@example.com';
  const role = user?.role || 'guest';
  const photo = user?.profile?.profilePhoto || 'https://via.placeholder.com/120';
  const bio = user?.profile?.bio;

  

  return (
    <div className="container py-4 py-lg-5">
      <nav aria-label="breadcrumb" className="jp-breadcrumb-wrap mb-3">
        <ol className="breadcrumb jp-breadcrumb mb-0">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Profile
          </li>
        </ol>
      </nav>

      <header className="jp-page-lead mb-4">
        <p className="jp-eyebrow text-primary small fw-semibold mb-2">Account</p>
        <h1 className="display-6 fw-bold mb-0">Profile</h1>
      </header>

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="card jp-rise h-100 overflow-hidden">
            <div className="card-body text-center text-lg-start p-4">
              <div className="d-flex flex-column align-items-center align-items-lg-start">
                <img
                  src={photo}
                  alt=""
                  width={120}
                  height={120}
                  className="rounded-circle border border-3 border-primary object-fit-cover mb-3"
                />
                <h2 className="h5 fw-semibold mb-1">{displayName}</h2>
                <p className="small text-muted mb-2">{email}</p>
                <span className="badge jp-pill-role text-capitalize mb-3">{role}</span>
                {bio ? (
                  <p className="small text-body-secondary mb-3" style={{ whiteSpace: 'pre-wrap' }}>
                    {bio}
                  </p>
                ) : (
                  <p className="small text-muted mb-3 mb-lg-0">
                    Add a short bio when you connect your profile API.
                  </p>
                )}
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm mt-auto rounded-pill px-3"
                  onClick={() => setEditOpen(true)}
                >
                  Edit profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <section className="card jp-rise h-100 overflow-hidden" aria-labelledby="applied-jobs-heading">
            <div className="card-header jp-card-header py-3">
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
                <div>
                  <h2 id="applied-jobs-heading" className="h5 fw-bold mb-1">
                    Applied jobs
                  </h2>
                  <p className="small text-muted mb-0">
                    Track where you have applied and each application status.
                  </p>
                </div>
                <span className="badge jp-badge">
                  {user?.role === 'student' ? appliedItems.length : '—'}
                </span>
              </div>
            </div>
            {user?.role === 'student' ? (
              appliedLoading ? (
                <p className="text-muted small p-4 mb-0">Loading applications…</p>
              ) : (
                <AppliedJobsList items={appliedItems} />
              )
            ) : (
              <p className="text-muted small p-4 mb-0">
                Application history is available for job seeker accounts.
              </p>
            )}
          </section>
        </div>
      </div>

      <ProfileEditModal show={editOpen} onHide={() => setEditOpen(false)} user={user} />
    </div>
  );
}

export default Profile;
