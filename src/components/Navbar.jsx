import Button from './Button';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../stores/authSlice';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.data?.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const handleLogout = () => {
    dispatch(logout());
  };

  function goPostJob() {
    if (!isAuthenticated) {
      navigate('/login', { state: { redirectTo: '/dashboard', hash: 'post-job' } });
      return;
    }
    if (user?.role !== 'recruiter') {
      navigate('/signup');
      return;
    }
    navigate({ pathname: '/dashboard', hash: 'post-job' });
  }

  return (
    <nav className="navbar jp-navbar navbar-expand-lg navbar-light border-0">
      <div className="container-fluid px-3 px-lg-4">
        <Link to="/" className="navbar-brand jp-brand fw-bold text-decoration-none">
          JobPortal
        </Link>
        <button
          className="navbar-toggler jp-navbar-toggler border-0 shadow-sm"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarScroll"
          aria-controls="navbarScroll"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link fw-semibold jp-nav-link${isActive ? ' active' : ''}`
                }
                end
              >
                Browse
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/jobs"
                className={({ isActive }) =>
                  `nav-link fw-semibold jp-nav-link${isActive ? ' active' : ''}`
                }
              >
                Jobs
              </NavLink>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto d-flex align-items-lg-center flex-column flex-lg-row gap-2 gap-lg-0 py-3 py-lg-0">
            <li className="nav-item me-lg-3 w-100 w-lg-auto">
              <Button
                variant="secondary"
                className="rounded-pill px-3 fw-semibold jp-btn-soft w-100 w-lg-auto"
                type="button"
                onClick={goPostJob}
              >
                Post a job
              </Button>
            </li>

            {user ? (
              <>
                <li className="nav-item me-2">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `nav-link fw-semibold jp-nav-link${isActive ? ' active' : ''}`
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item dropdown">
                <button
                  type="button"
                  className="nav-link dropdown-toggle d-flex align-items-center btn btn-link text-decoration-none text-dark border-0 jp-user-menu-btn"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user?.profile?.profilePhoto || 'https://via.placeholder.com/40'}
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-circle me-2 border border-2 border-primary flex-shrink-0 object-fit-cover"
                  />
                  <span className="fw-semibold">{user.name || 'Guest'}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Settings
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Button
                    variant="primary"
                    className="rounded-pill px-3 fw-semibold"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                </li>
                <li className="nav-item ms-2">
                  <Button
                    variant="outline-primary"
                    className="rounded-pill px-3 fw-semibold"
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </Button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
