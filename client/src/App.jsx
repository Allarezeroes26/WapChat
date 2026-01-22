import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import Homepage from './pages/Homepage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingPages from './pages/SettingPages'
import ProfilePage from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore'
import {Loader} from 'lucide-react'
import { Navigate } from 'react-router-dom'

function App() {
  
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  console.log({authUser})

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
        {
          index: true,
          element: authUser ? <Homepage /> : <Navigate to='/login'/>
        },
        {
          path: '/signup',
          element: !authUser ? <SignUpPage /> : <Navigate to='/'/>
        },
        {
          path: '/login',
          element: !authUser ? <LoginPage /> : <Navigate to='/'/>
        },
        {
          path: '/settings',
          element: <SettingPages />
        },
        {
          path: '/profile',
          element: authUser ? <ProfilePage /> : <Navigate to='/login'/>
        },
      ]
    }
  ])

  return (
    <RouterProvider router={router}/>
  )
}

export default App
