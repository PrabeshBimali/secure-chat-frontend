import { useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import { validateEmail, validatePassword, validateUsername } from "../services/authServices";
import { useToast } from "../context/ToastProvider";
import { useNavigate } from "react-router";
import { generateSeed } from "../lib/crypto/bip39";
import { derivePublicKeys, generateDeviceIdKeys } from "../lib/crypto/keys";
import { bytesToHex } from "@noble/curves/utils.js";
import getDeviceInfo from "../lib/utils/device";
import { prepareVaultForRegistration } from "../lib/crypto/vault";
import { initializeDb, saveIdentity, type LocalVault } from "../db/indexedb";

export interface BasicRegistration {
  username: string;
  email: string;
  password: string;
}

export interface DeviceRegistration {
  name: string
  browser: string
  os: string
  device_pbk: string
}

interface RegistrationPayload {
  username: string
  email: string
  encryption_pbk: string
  identity_pbk: string
  device: DeviceRegistration
}

interface RegisteredUser {
  id: number;
  email: string;
  username: string;
}

interface RegisterResponse<T> {
  success: boolean;
  message: string;
  details?: any;
  data?: T
}

interface RegisterFormProps {
  rawPhrase: string
}

export default function RegisterForm(props: RegisterFormProps) {

  const { rawPhrase } = props

  const { addToast } = useToast()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<BasicRegistration>({
    username: "",
    email: "",
    password: ""
  })

  const [usernameError, setUsernameError] = useState<string>("")
  const [emailError, setEmailError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")
  const [loading, setLoading] = useState(true)


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

  async function handleRegister() {
    try {
      setLoading(true)
      const validationErr = validateInputs(formData.username, formData.email, formData.password)

      if(validationErr) {
        setLoading(false)
        return
      }

      const masterSeed = await generateSeed(rawPhrase)
      const publicKeys = await derivePublicKeys(masterSeed)
      const identityPublicKey = bytesToHex(publicKeys.identityPublicKey)
      const encryptionPublicKey = bytesToHex(publicKeys.encryptionPublicKey)
      const deviceInfo = getDeviceInfo()
      const deviceIdentityKeys = await generateDeviceIdKeys()
      const devicePublicKey = await crypto.subtle.exportKey("spki", deviceIdentityKeys.publicKey)

      const registrationPayload: RegistrationPayload = {
        username: formData.username,
        email: formData.email,
        encryption_pbk: encryptionPublicKey,
        identity_pbk: identityPublicKey,
        device: {
          name: deviceInfo.name,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          device_pbk: btoa(String.fromCharCode(...new Uint8Array(devicePublicKey)))
        }
      }

      const rawResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationPayload),
      });

      const response: RegisterResponse<RegisteredUser> = await rawResponse.json()

      if(response.success) {
        const vault = await prepareVaultForRegistration(formData.password, masterSeed)

        const dataToStore: LocalVault = {
          username: formData.username,
          ciphertext: new Uint8Array(vault.cipherText),
          iv: vault.iv,
          salt: vault.salt,
          device_pbk: registrationPayload.device.device_pbk,
          device_privk: deviceIdentityKeys.privateKey
        }

        const db = await initializeDb()
        await saveIdentity(db, dataToStore)

        addToast(`${response.message} Redirecting...`, "success")
        setTimeout(() => navigate(`/email-verification-sent?id=${response.data?.id}&email=${response.data?.email}`,), 3000)
      } else {
        if(response.details.fieldErrors.username) {
          setUsernameError(response.details.fieldErrors.username)
        } else if(response.details.fieldErrors.email) {
          setEmailError(response.details.fieldErrors.email)
        } else {
          addToast(response.message, "error")
        }
      }

    } catch(e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
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
          <label className="font-semibold text-text-secondary">Device's Password:</label>
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
  )
}