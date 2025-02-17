import React, { useState } from 'react';
import axios from 'axios'; // To make API calls

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      setMessage(response.data.message); // Display message returned from the backend
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Forgot Your Password?</h2>
        <p className="text-center text-gray-600 mb-6">Enter your email address below to receive a password reset link.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-primary hover:bg-sky-500'}`}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center ${message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
