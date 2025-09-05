import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import HomePage from './pages/Home'
import RegisterPage from './pages/Register'
import LoginPage from './pages/Login'
import { ToastProvider } from './context/ToastProvider'
import SendEmailVerification from './pages/SendEmailVerification'
import VerifyEmail from './pages/VerifyEmail'
import PrivateRoutes from './components/PrivateRoutes'
import { AuthProvider } from './context/AuthProvider'

function App() {

  return (
    <>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<PrivateRoutes/>}>
                <Route path="/" element={<HomePage/>}/>
              </Route>
              <Route path='/login' element={<LoginPage/>}/>
              <Route path="/register" element={<RegisterPage/>}/>
              <Route path="/email-verification-sent" element={<SendEmailVerification/>}/>
              <Route path="/verify-email" element={<VerifyEmail/>}/>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </>
  )
}

export default App
