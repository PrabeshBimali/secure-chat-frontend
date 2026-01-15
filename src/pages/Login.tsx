import { useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import AuthLayout from "../layouts/AuthLayout";
import { validatePassword, validateUsername } from "../lib/utils/formValidation";
import { useAuth } from "../context/AuthProvider";
import { useToast } from "../context/ToastProvider";
import { useNavigate } from "react-router";
import { getIdentity, initializeDb } from "../db/indexedb";
import { requestChallenge, verifyChallenge } from "../services/authServices";
import { signDevice, signIdentity } from "../lib/crypto/sign";

interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginPage() {

  const auth = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: ""
  })

  const [usernameError, setUsernameError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target

    if(name === "username") {
      setUsernameError("")
    } else if(name === "password") {
      setPasswordError("")
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validateInputs(username: string, password: string): boolean {

    const usernameErr = validateUsername(username)
    const pwdErr = validatePassword(password)
    let isErr = false

    if(usernameErr !== "") {
      setUsernameError(usernameErr)
      isErr = true
    }

    if(pwdErr !== "") {
      setPasswordError(pwdErr)
      isErr = true
    }

    return isErr
  }

  function handleServerErrors(response: any) {
    if(response.details.fieldErrors.credentials) {
      setUsernameError(" ")
      setPasswordError(response.details.fieldErrors.credentials)
    } else if(response.details.fieldErrors.device) {
      setUsernameError(" ")
      setPasswordError(response.details.fieldErrors.device)
    } else {
      addToast(response.message, "error", 5000)
    }
  }

  async function handleLogin() {
    try {
      setLoading(true)
      setUsernameError("")
      setPasswordError("")
      const validationErr = validateInputs(formData.username, formData.password)

      if(validationErr) {
        setLoading(false)
        return
      }

      const db = await initializeDb()
      const userData = await getIdentity(db, formData.username)

      if(!userData) {
        setUsernameError("Account not linked with the Device")
        return
      }

      const requestChallengeResponse = await requestChallenge(formData.username, userData.device_pbk)

      if(requestChallengeResponse.success) {

        if(requestChallengeResponse.data === undefined) {
          addToast("Server Error. Please, Try again!", "error", 5000)
          throw new Error("data not received from server")
        }

        const deviceSignature = await signDevice(requestChallengeResponse.data.nonce, userData.device_privk)
        const identitySignature = await signIdentity(requestChallengeResponse.data.nonce, formData.password, userData.ciphertext, userData.iv, userData.salt)

        const verifyChallengeResponse = await verifyChallenge(
          requestChallengeResponse.data.userid, 
          userData.device_pbk,
          deviceSignature,
          identitySignature
        )

        if(verifyChallengeResponse.success) {
          // complete this
          //auth.refreshUser()
          //addToast("Logged in! Redirecting ...", "success")
          //setTimeout(() => navigate("/"), 3000)
          console.log(verifyChallengeResponse)
        } else {
          handleServerErrors(verifyChallengeResponse)
        }

      } else {
        handleServerErrors(requestChallengeResponse)
      }
    } catch(e) {
      console.error("Unknown Error: ", e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-3">
        <div className="text-2xl font-semibold">
          Login
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-text-secondary">Username:</label>
          <input 
            type="text" 
            placeholder="andrew123"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border-2 ${usernameError !== "" ? "border-red-500" : "border-gray-300 dark:border-gray-600"} 
                    bg-white dark:bg-gray-800 text-text-primary placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 
                    focus:ring-blue-500 focus:border-blue-500 tracking-wide transition`}
          />
          <div className={`text-xs font-semibold tracking-wide ${usernameError === "" ? "text-bg-secondary" : "text-red-500"}`}>
            { usernameError === "" ? "No Error" : usernameError }
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-text-secondary">Device Password:</label>
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border-2 ${passwordError !== "" ? "border-red-500" : "border-gray-300 dark:border-gray-600"} 
                    bg-white dark:bg-gray-800 text-text-primary placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 
                    focus:ring-blue-500 focus:border-blue-500 tracking-wide transition`}
          />
          <div className={`text-xs font-semibold tracking-wide ${passwordError === "" ? "text-bg-secondary" : "text-red-500"}`}>
            { passwordError === "" ? "No Error" : passwordError }
          </div>
        </div>
        <PrimaryButton
          handleClick={handleLogin}
          isLoading={loading}
          name="Login"
        />
      </div>
    </AuthLayout>
  )
}