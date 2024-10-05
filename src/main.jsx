import { createRoot } from 'react-dom/client'
import './index.css'
import router from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './Store/index.js'
import NotificationProvider from './Providers/NotificationProvider.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <NotificationProvider>
    <RouterProvider router={router} />
    </NotificationProvider>
  </Provider>
)
