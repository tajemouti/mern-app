import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../redux/authSlice';
import '../assets/css/auth.css';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.token && data.user) {
        dispatch(signIn({ token: data.token, user: data.user }));
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-input"
        />
        <button type="submit" className="auth-button">Sign In</button>
      </form>
      <p className="auth-text">
        Don&apos;t have an account yet? Sign up
        {' '}
        <Link to="/signup" className="auth-link">here</Link>
      </p>
    </div>
  );
}

export default Signin;
