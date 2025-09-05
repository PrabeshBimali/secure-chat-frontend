import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../context/AuthProvider'
import { PageLoading } from '../pages/PageLoading'

export default function PrivateRoutes() {
  const { isAuthenticated, loading } = useAuth()

  if(loading) {
    return <PageLoading/>
  }

  return (
    isAuthenticated ? <Outlet/> : <Navigate to='/login'/>
  )
}