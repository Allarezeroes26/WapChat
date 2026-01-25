import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import { Loader } from 'lucide-react'

// Components
import MainLayout from './layout/MainLayout'
import Homepage from './pages/Homepage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingPages from './pages/SettingPages'
import ProfilePage from './pages/ProfilePage'

function App() {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore(); // Fixed: Destructured theme

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Apply theme to the whole document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className='size-10 animate-spin'/>
    </div>
  )

  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { index: true, element: authUser ? <Homepage /> : <Navigate to='/login'/> },
        { path: '/signup', element: !authUser ? <SignUpPage /> : <Navigate to='/'/> },
        { path: '/login', element: !authUser ? <LoginPage /> : <Navigate to='/'/> },
        { path: '/settings', element: <SettingPages /> },
        { path: '/profile', element: authUser ? <ProfilePage /> : <Navigate to='/login'/> },
      ]
    }
  ])

  return <RouterProvider router={router} />;
}

export default App