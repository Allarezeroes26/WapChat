import {Outlet} from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuthStore } from '../store/useAuthStore'

const MainLayout = () => {
    const { authUser } = useAuthStore()
  return (
    <div>
        <Navbar />
        <Outlet />
    </div>
  )
}

export default MainLayout
