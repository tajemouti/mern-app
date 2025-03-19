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

  const resetInputFields = () => {
    setName('');
    setAge('');
    setRole('');
    setEmail('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    createUser();
    resetInputFields();
  };

  return (
    <>
      <h1>MERN USER MANAGEMENT</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
        >
          Add User
        </button>
      </form>
      <h2>Uers List</h2>
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
