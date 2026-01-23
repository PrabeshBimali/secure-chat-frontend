import { useState } from "react"
import PrimaryButton from "../../../components/PrimaryButton"
import { validatePassword } from "../../../lib/utils/formValidation"
import { encryptMasterSeed } from "../../../lib/crypto/vault"
import { initializeDb, saveIdentity, type LocalVault } from "../../../db/indexedb"
import { useToast } from "../../../context/ToastProvider"
import { useAuth } from "../../../context/AuthProvider"
import { useNavigate } from "react-router"

interface CreateVaultOnRecoveryProps {
  masterSeed: Uint8Array | undefined
  devicePbk: string
  devicePrivk: CryptoKey | undefined
  username: string
}

export default function CreateVaultOnRecovery(props: CreateVaultOnRecoveryProps) {

  const { masterSeed, devicePbk, devicePrivk, username } = props

  const { addToast } = useToast()
  const auth = useAuth()
  const navigate = useNavigate()

  const [password, setPassword] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")
  
  function handleChange(pwd: string) {
    setPasswordError("")
    setPassword(pwd)
  }

  async function handleSubmit() {
    const pwdErr = validatePassword(password)

    if(pwdErr !== "") {
      setPasswordError(pwdErr)
      return
    }

    try {

      if(masterSeed === undefined) {
        throw new Error(`Master Seed undefined`)
      }

      if(devicePrivk === undefined) {
        throw new Error(`Deivce Private Key is undefined`)
      }

      const encryptionInfo = await encryptMasterSeed(password, masterSeed)

      const vault: LocalVault = {
        username: username,
        device_pbk: devicePbk,
        device_privk: devicePrivk,
        salt: encryptionInfo.salt,
        iv: encryptionInfo.iv,
        ciphertext: new Uint8Array(encryptionInfo.cipherText)
      }

      const db = await initializeDb()
      await saveIdentity(db, vault)

      auth.refreshUser()
      addToast("Success. Redrecting...", "success", 5000)
      setTimeout(() => navigate("/"), 3000)
    } catch(error) {
      console.error(error)
      addToast("Something went wront, Try Again", "error", 5000)
    }
  }

  return (
    <div className="text-text-primary flex flex-col gap-3">
      <p className="text-2xl font-semibold mb-4 text-center">Create Password for this Device</p>
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-text-secondary">Device's Password:</label>
        <input 
          type="password" 
          name="password"
          value={password}
          onChange={(e) => handleChange(e.target.value)}
          className={`w-full px-4 py-2 rounded-lg border-2 ${passwordError !== "" ? "border-red-500" : "border-gray-300 dark:border-gray-600"} 
                  bg-white dark:bg-gray-800 text-text-primary placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 
                  focus:ring-blue-500 focus:border-blue-500 tracking-wide transition`}
        />
        <div className={`text-xs font-semibold tracking-wide ${passwordError === "" ? "text-bg-secondary" : "text-red-500"}`}>
          { passwordError === "" ? "No Error" : passwordError }
        </div>
      </div>
      <div className="flex md:flex-row flex-col md:justify-center gap-3">
        <PrimaryButton name="Submit" isLoading={false} handleClick={handleSubmit}/>
      </div>
    </div>
  )
}