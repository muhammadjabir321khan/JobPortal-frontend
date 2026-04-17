import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from './Modal';
import { updateUserProfile } from '../services/userService';
import { setAuthUser } from '../stores/authSlice';

function skillsToString(profile) {
  const s = profile?.skill ?? profile?.skills;
  if (Array.isArray(s)) return s.filter(Boolean).join(', ');
  return '';
}

/**
 * Edit profile — POST /api/users/update (multipart) with Bearer token.
 */
function ProfileEditModal({ show, onHide, user }) {
  const dispatch = useDispatch();
  const [formKey, setFormKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) {
      setFormKey((k) => k + 1);
      setError('');
    }
  }, [show]);

  const profile = user?.profile ?? {};
  const defaultName = user?.name ?? '';
  const defaultEmail = user?.email ?? '';
  const defaultPhone = user?.phone != null ? String(user.phone) : '';
  const defaultBio = profile.bio ?? '';
  const defaultSkills = skillsToString(profile);
  const resumeHint = profile.resumeOriginalName || profile.resume || '';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!localStorage.getItem('token')) {
      setError('Please log in to update your profile.');
      return;
    }

    const form = e.target;
    const fd = new FormData(form);

    const photo = form.elements.profilePhoto?.files?.[0];
    const resume = form.elements.resume?.files?.[0];
    if (!photo) {
      fd.delete('profilePhoto');
    }
    if (!resume) {
      fd.delete('resume');
    }

    setLoading(true);
    try {
      const { data } = await updateUserProfile(fd);
      if (!data.success) {
        throw new Error(data.message || 'Update failed');
      }
      if (data.data?.user) {
        dispatch(setAuthUser(data.data.user));
      }
      onHide();
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Could not update profile. Try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      title="Edit profile"
      size="lg"
      footer={
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={onHide} disabled={loading}>
            Cancel
          </button>
          <button
            type="submit"
            form="profile-edit-form"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving…' : 'Save changes'}
          </button>
        </>
      }
    >
      <form id="profile-edit-form" key={formKey} onSubmit={handleSubmit}>
        {error ? (
          <div className="alert alert-danger py-2 small" role="alert">
            {error}
          </div>
        ) : null}
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label htmlFor="edit-name" className="form-label">
              Full name
            </label>
            <input
              id="edit-name"
              name="name"
              type="text"
              className="form-control"
              defaultValue={defaultName}
              required
              autoComplete="name"
            />
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="edit-email" className="form-label">
              Email
            </label>
            <input
              id="edit-email"
              name="email"
              type="email"
              className="form-control"
              defaultValue={defaultEmail}
              required
              autoComplete="email"
            />
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="edit-phone" className="form-label">
              Phone
            </label>
            <input
              id="edit-phone"
              name="phone"
              type="tel"
              className="form-control"
              defaultValue={defaultPhone}
              placeholder="Optional"
              autoComplete="tel"
            />
          </div>
          <div className="col-12">
            <label htmlFor="edit-bio" className="form-label">
              Bio
            </label>
            <textarea
              id="edit-bio"
              name="bio"
              className="form-control"
              rows={4}
              defaultValue={defaultBio}
              placeholder="Short introduction for employers"
            />
          </div>
          <div className="col-12">
            <label htmlFor="edit-skills" className="form-label">
              Skills
            </label>
            <input
              id="edit-skills"
              name="skills"
              type="text"
              className="form-control"
              defaultValue={defaultSkills}
              placeholder="e.g. React, Node.js, UX research (comma-separated)"
            />
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="edit-photo" className="form-label">
              Profile photo
            </label>
            <input
              id="edit-photo"
              name="profilePhoto"
              type="file"
              className="form-control"
              accept="image/*"
            />
            <div className="form-text">Leave empty to keep current photo.</div>
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="edit-resume" className="form-label">
              Resume
            </label>
            <input
              id="edit-resume"
              name="resume"
              type="file"
              className="form-control"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
            {resumeHint ? (
              <div className="form-text text-truncate" title={resumeHint}>
                Current: {resumeHint}
              </div>
            ) : (
              <div className="form-text">PDF or Word. Leave empty to keep current file.</div>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default ProfileEditModal;
