import { useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import AuthLayout from "../layouts/AuthLayout";
import { validateEmail, validatePassword, validateUsername } from "../lib/authFormValidator";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

export default function RegisterPage() {

  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: ""
  })

  const [usernameError, setUsernameError] = useState<string>("")
  const [emailError, setEmailError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target

    if(name === "username") {
      setUsernameError("")
    } else if(name === "email") {
      setEmailError("")
    } else if(name === "password") {
      setPasswordError("")
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validateInputs(username: string, email: string, password: string): boolean {

    const usrErr = validateUsername(username)
    const emailErr = validateEmail(email)
    const pwdErr = validatePassword(password)
    let isErr = false

    if(usrErr !== "") {
      setUsernameError(usrErr)
      isErr = true
    }

    if(emailErr !== "") {
      setEmailError(emailErr)
      isErr = true
    }

    if(pwdErr !== "") {
      setPasswordError(pwdErr)
      isErr = true
    }

    return isErr
  }

  function handleRegister() {
    try {
      setLoading(true)
      const validationErr = validateInputs(formData.username, formData.email, formData.password)

      if(validationErr) {
        setLoading(false)
        return
      }

    } catch(e) {
      console.error(e)
    }
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-3">
        <div className="text-2xl font-semibold">
          Register
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-text-secondary">Username:</label>
          <input 
            type="text" 
            placeholder="harry123"
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
          <label className="font-semibold text-text-secondary">Email:</label>
          <input 
            type="text" 
            placeholder="harry@gmail.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border-2 ${emailError !== "" ? "border-red-500" : "border-gray-300 dark:border-gray-600"} 
                    bg-white dark:bg-gray-800 text-text-primary placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 
                    focus:ring-blue-500 focus:border-blue-500 tracking-wide transition`}
          />
          <div className={`text-xs font-semibold tracking-wide ${emailError === "" ? "text-bg-secondary" : "text-red-500"}`}>
            { emailError === "" ? "No Error" : emailError }
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-text-secondary">Password:</label>
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
          handleClick={handleRegister}
          isLoading={loading}
          name="Register"
        />
      </div>

    </AuthLayout>
  )
}