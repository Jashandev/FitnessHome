import React, { createContext, useContext } from 'react';
import { notification } from 'antd';

// Create a context for the notification
export const NotificationContext = createContext();

// Custom hook to use the notification API
export const useNotificationApi = () => useContext(NotificationContext);

const NotificationProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  // Function to trigger the notification
  const openNotificationWithIcon = (type, title, description, placement) => {
    api[type]({
      message: title,
      description,
      placement,
    });
  };

  return (
    <NotificationContext.Provider value={openNotificationWithIcon}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;

