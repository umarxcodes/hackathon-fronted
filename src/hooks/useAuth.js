import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
export function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const handleLogout = () => dispatch(logout());
  return { ...auth, handleLogout };
}
