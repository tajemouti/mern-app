import Navbar from './Navbar';
import UserManagement from './UserManagement';

function Dashboard() {
  return (
    <div>
      <Navbar />
      <h1>Dashboard</h1>
      <UserManagement />
    </div>
  );
}

export default Dashboard;
