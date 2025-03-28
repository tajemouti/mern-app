import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../redux/authSlice';

function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(signOut());
    navigate('/');
  };

  return <button type="button" onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;
