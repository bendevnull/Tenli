import React from 'react';

const EmailLoginPage = () => {
  return (
    <div className="flex flex-col flex-grow justify-center items-center bg-white relative">
      <form className="flex flex-col p-6 border border-gray-300 rounded-lg bg-white shadow-md mt-[-10%]">
        <h2 className="text-center text-xl font-semibold mb-5">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="mb-3 p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-5 p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </button>
        <div className="text-center mt-4 text-sm text-gray-600 flex justify-center items-baseline">
          <a href="/forgot-password" className="hover:underline">Forgot Password</a>
          <span className="mx-2 text-gray-400">|</span>
          <a href="/register" className="hover:underline">Register</a>
        </div>
      </form>
    </div>
  );
};

export default EmailLoginPage;
