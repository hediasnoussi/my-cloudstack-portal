import React from 'react';

const SimpleTest = () => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        🎉 Login Successful!
      </h1>
      <p className="text-gray-600 mb-4">
        Welcome to Focus Technology Solutions Dashboard
      </p>
      <div className="bg-blue-100 p-4 rounded-lg">
        <h2 className="font-semibold text-blue-800 mb-2">User Info:</h2>
        <p className="text-blue-700">Role: Admin</p>
        <p className="text-blue-700">Status: Authenticated</p>
      </div>
      <div className="mt-6 p-4 bg-green-100 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2">✅ No API calls made!</h3>
        <p className="text-green-700">This component works without any backend calls</p>
      </div>
    </div>
  );
};

export default SimpleTest;
