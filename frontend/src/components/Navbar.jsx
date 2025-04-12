import { useSelector } from 'react-redux';
import LogoutButton from './LogoutButton';
import '../assets/navbar.css';

function Navbar() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="navbar">
      <h3 className="navbar-title">Welcome to Dashboard</h3>
      {user && (
        <p className="user-info2">
          Logged in as:
          {' '}
          <strong>{user.name}</strong>
          {' '}
          (
          {user.role}
          )
        </p>
      )}
      <LogoutButton />
    </div>
  );
}

export default Navbar;
