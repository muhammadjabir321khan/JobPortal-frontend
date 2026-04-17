import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import api from '../services/api';
import { login, logout } from '../stores/authSlice';

/**
 * Restores Redux auth from JWT in localStorage on first load.
 */
function AuthBootstrap() {
  const dispatch = useDispatch();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const token = localStorage.getItem('token');
    if (!token) return;

    api
      .get('/users/me')
      .then((res) => {
        const user = res.data?.data?.user;
        if (!user) {
          localStorage.removeItem('token');
          dispatch(logout());
          return;
        }
        dispatch(login({ user, token }));
      })
      .catch(() => {
        localStorage.removeItem('token');
        dispatch(logout());
      });
  }, [dispatch]);

  return null;
}

export default AuthBootstrap;
