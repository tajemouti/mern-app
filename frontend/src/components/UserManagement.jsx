import { useEffect, useState } from 'react';

const UserManagement = () => {
  const token = localStorage.getItem('token');
  const url = 'http://localhost:3000/users';

  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState();
  const [email, setEmail] = useState('');
  const [editedUser, setEditedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      name, age: Number(age), email,
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

  const updateUser = async () => {
    const userData = {
      name, age: Number(age), email,
    };
    try {
      await fetch(`${url}/${editedUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await fetch(`${url}/${id}`, {
        method: 'DELETE',
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const setInputfields = (user) => {
    setName(user.name);
    setAge(user.age);
    setEmail(user.email);
  };

  const resetInputFields = () => {
    setName('');
    setAge('');
    setEmail('');
  };

  const handleCreate = (e) => {
    e.preventDefault();
    createUser();
    resetInputFields();
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateUser();
    setEditedUser(null);
    resetInputFields();
  };

  const handleEdit = (user) => {
    setEditedUser(user);
    setInputfields(user);
  };

  return (
    <>
      <h1>MERN USER MANAGEMENT</h1>
      <form onSubmit={editedUser ? handleUpdate : handleCreate}>
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
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
        >
          {editedUser ? 'Update User' : 'Add User'}
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
            <button
              type="button"
              onClick={() => handleEdit(user)}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => deleteUser(user._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default UserManagement;
