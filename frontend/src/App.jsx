import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const url = 'http://localhost:3000/users';

  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState();
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');

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

  const createUser = async () => {
    const userData = {
      name, age: Number(age), role, email,
    };

    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

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
