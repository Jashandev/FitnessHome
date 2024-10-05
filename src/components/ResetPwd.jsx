import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useNotificationApi } from '../Providers/NotificationProvider'; // Assuming you have a notification provider
import { Input, Button } from 'antd'; // Using Ant Design components for form fields (optional)
import { useDispatch } from 'react-redux';
import { resetPassword } from '../Store/Slices/AuthSlice';

const ResetPassword = () => {
  const { token } = useParams(); // Extract token from URL
  const navigate = useNavigate();
  const notify = useNotificationApi(); // Notification hook
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
        notify('error', 'Password Mismatch', 'Passwords do not match', 'bottomLeft');
        return;
      }

    const resultAction = await dispatch(resetPassword({ token, newPassword }));
        if (resetPassword.fulfilled.match(resultAction)) {
            const { error, msg } = resultAction.payload;
            notify(error ? 'error' : 'success', error ? 'Password Reset Error' : 'Password Reset Successful', msg, 'bottomLeft');
        }
        
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Reset Your Password</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <Input.Password
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your new password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <Input.Password
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Confirm your new password"
            />
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
