import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../redux/authSlice';

const UserManagement = () => {
  const token = useSelector((state) => state.auth.token);
  const loggedInUser = useSelector((state) => state.auth.user);
  const url = 'http://localhost:3000/users';
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const updateUser = async () => {
    const userData = {
      name,
      age: Number(age),
      email,
      role,
    };

    if (password) {
      userData.password = password;
    }

    try {
      await fetch(`${url}/${editedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const setInputfields = (user) => {
    setName(user.name);
    setAge(user.age);
    setEmail(user.email);
    setRole(user.role);
    setPassword('');
  };

  const resetInputFields = () => {
    setName('');
    setAge('');
    setEmail('');
    setRole('');
    setPassword('');
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

  const handleLogout = () => {
    dispatch(signOut());
    navigate('/signin');
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    if (loggedInUser?._id === id) {
      handleLogout();
    } else {
      fetchUsers();
    }
  };

  const handleSubmit = () => {
    if (loggedInUser?.role === 'admin') {
      return editedUser ? handleUpdate : handleCreate;
    }

    return handleUpdate;
  };

  const buttonLabel = () => {
    if (loggedInUser?.role === 'admin') {
      return editedUser ? 'Update User' : 'Add User';
    }

    return 'Update User';
  };

  return (
    <>
      <h1>MERN USER MANAGEMENT</h1>
      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loggedInUser?.role !== 'admin'}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          disabled={loggedInUser?.role !== 'admin'}
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loggedInUser?.role !== 'admin'}
        />
        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {loggedInUser?.role === 'admin' ? (
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled selected>Select a role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        ) : (
          <></>
        )}
        <button
          type="submit"
        >
          {buttonLabel()}
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
              disabled={loggedInUser?.role !== 'admin'}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDelete(user._id)}
              disabled={loggedInUser?.role !== 'admin'}
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
