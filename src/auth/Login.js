import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginImg from "../assets/login.png";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // For HTTP-only cookies
      });

      const userData = await response.json();
      if (!response.ok) throw new Error(await response.text());

      // If using cookies for auth, no token storage needed
      dispatch(loginSuccess(userData));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f6f9fc]">
      {/* Left Side */}
      <div className="w-1/2 bg-[#3478f6] text-white flex flex-col justify-center items-center p-10">
        <div className="flex items-center gap-2 mb-10">
          <img src="https://img.icons8.com/ios-filled/50/ffffff/task.png" alt="Logo" className="w-8 h-8" />
          <h1 className="text-2xl font-semibold">Woorkroom</h1>
        </div>
        <h2 className="text-3xl font-bold mb-4">Your place to work</h2>
        <p className="text-lg">Plan. Create. Control.</p>
        <img 
          src={loginImg} 
          alt="Task Board" 
          className="w-2/3 mt-10"
        />
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex flex-col justify-center items-center px-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sign In to Woorkroom</h2>

        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="youremail@gmail.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-2">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <span className="absolute right-3 top-3 text-gray-400 cursor-pointer">👁️</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-blue-500" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200"
          >
            Sign In →
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
          )}

          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account? <a href="#" className="text-blue-500 hover:underline">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}
