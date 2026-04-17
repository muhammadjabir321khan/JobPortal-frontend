import { useAuth as useAuthContext } from '../contexts/AuthContext';

function useAuth() {
  return useAuthContext();
}

export default useAuth;
