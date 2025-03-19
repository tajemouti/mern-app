import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const url = 'http://localhost:3000/users';

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <h1>Uers List</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <strong>{user.name}</strong>
            {' '}
            <span>
              {user.role}
              {' '}
              (
              {user.age}
              {' years old'}
              )
              {' '}
              {user.email}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
