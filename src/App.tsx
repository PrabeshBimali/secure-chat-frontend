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
import RecoverWithSeed from './pages/RecoverWithSeed'
import { MessageEncryptionProvider } from './context/MessageEncryptionProvider'

function App() {

  return (
    <>
      <AuthProvider>
        <ToastProvider>
          <MessageEncryptionProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<PrivateRoutes/>}>
                  <Route path="/" element={<HomePage/>}/>
                </Route>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/email-verification-sent" element={<SendEmailVerification/>}/>
                <Route path="/verify-email" element={<VerifyEmail/>}/>
                <Route path="/recover-account" element={<RecoverWithSeed/>}/>
              </Routes>
            </BrowserRouter>
          </MessageEncryptionProvider>
        </ToastProvider>
      </AuthProvider>
    </>
  )
}

export default App
