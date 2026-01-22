import {Outlet} from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuthStore } from '../store/useAuthStore'
import {Toaster} from "react-hot-toast"

const MainLayout = () => {
    const { authUser } = useAuthStore()
  return (
    <div>
        <Navbar />
        <div className='mt-10'>
          <Toaster/>
          <Outlet />
        </div>
    </div>
  )
}

export default MainLayout
