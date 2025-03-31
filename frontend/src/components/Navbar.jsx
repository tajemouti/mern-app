import { useSelector } from 'react-redux';
import LogoutButton from './LogoutButton';

function Navbar() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div>
      <h3>Welcome to Dashboard</h3>
      {user && (
        <p>
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
