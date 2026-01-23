import { useEffect, useState } from "react"
import PrimaryButton from "../../../components/PrimaryButton"
import { generateSeed } from "../../../lib/crypto/bip39"
import { derivePrivateKeysFromSeed, derivePublicKeys, generateDeviceIdKeys } from "../../../lib/crypto/keys"
import { requestRecoveryChallenge, verifyRecoveryChallenge, type DeviceRegistration } from "../../../services/authServices"
import { bytesToHex } from "@noble/curves/utils.js"
import { useToast } from "../../../context/ToastProvider"
import { signIdentity } from "../../../lib/crypto/sign"
import getDeviceInfo from "../../../lib/utils/device"

interface RecoveryFormProps {
  onRecoverySuccess: (masterSeed: Uint8Array, device_privk: CryptoKey, device_pbk: string, username: string) => void
}

export default function RecoveryForm(props: RecoveryFormProps) {

  const { onRecoverySuccess } = props

  const emptyArr = new Array(12).fill("")
  const [loading, setLoading] = useState(false)
  const [inputWords, setInputWords] = useState<Array<string>>(emptyArr)
  const [formError, setFormError] = useState<string>("")
  const { addToast } = useToast()

  useEffect(() => {
    console.log(inputWords)
  }, [inputWords])

  function handleInputChange(index: number, value: string) {
    setFormError("")
    const inputWordsCopy = inputWords.map((word, i) => (i === index ? value : word))
    setInputWords(inputWordsCopy)
  }

  function handleClear() {
    setInputWords(emptyArr)
    setFormError("")
  }

  function convertInputWordsToMnemonic(wordsArr: Array<string>): string | null {
    const sanitizedArr = wordsArr.map((words) => words.trim().toLowerCase())

    const isLengthInvalid = sanitizedArr.some((word) => word === "")

    if(isLengthInvalid) {
      setFormError("Seed Phrase must be 12 Words")
      return null
    }

    const regex = new RegExp("^[a-zA-Z]+$")

    const isWordNotAlphabet = sanitizedArr.some((word) => !regex.test(word))

    if(isWordNotAlphabet) {
      setFormError("Only English Alphabets a-z or A-Z are allowed in Seed Phrase")
      return null
    }

    return sanitizedArr.join(" ")
  }

  function handleServerErrors(response: any) {

    if(response.details === undefined) {
      addToast(response.message, "error", 5000)
      return
    }

    if(response.details.fieldErrors.credentials) {
      setFormError(response.details.fieldErrors.credentials)
    } else {
      addToast("Some Error has occured!", "error", 5000)
    }
  }

  async function handleLogin() {
    setLoading(true)
    setFormError("")

    try {
      const mnemonic = convertInputWordsToMnemonic(inputWords)
      if(mnemonic === null) return

      const masterSeed = await generateSeed(mnemonic)
      const privateKeys = await derivePrivateKeysFromSeed(masterSeed)
      const publicKeys = await derivePublicKeys(privateKeys.identityKey, privateKeys.encryptionKey)
      const identity_pbk = bytesToHex(publicKeys.identityPublicKey)

      const requestChallengeRes = await requestRecoveryChallenge(identity_pbk)

      if(requestChallengeRes.success) {

        if(requestChallengeRes.data === undefined) {
          addToast("Some Error has occured", "error", 5000)
          return
        }

        const { nonce, userid, username } = requestChallengeRes.data
        const signature = signIdentity(nonce, privateKeys.identityKey)
        
        const deviceKeys = await generateDeviceIdKeys()
        const {name, os, browser} = getDeviceInfo()
        const devicePublicKey = await crypto.subtle.exportKey("raw", deviceKeys.publicKey)
        const devicePublicKeyHex = bytesToHex(new Uint8Array(devicePublicKey))

        const device: DeviceRegistration = {
          name,
          os,
          browser,
          device_pbk: devicePublicKeyHex
        }

        const verifyChallengeRes = await verifyRecoveryChallenge(userid, signature, device)

        if(verifyChallengeRes.success) {
          // save device
          addToast("Recovery Successful", "success", 3000)
          onRecoverySuccess(masterSeed, deviceKeys.privateKey, devicePublicKeyHex, username)
        } else {
          handleServerErrors(verifyChallengeRes)
        }

      } else {
          handleServerErrors(requestChallengeRes)
      }

    } catch(e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-text-primary flex flex-col gap-3">
      <p className="text-2xl font-semibold mb-4 text-center">Please Enter Seed Phrase</p>
      <div className="grid grid-cols-3 gap-5">
        {
          inputWords.map((word, index) => {
            return (
              <input 
                type="text"
                value={word} 
                key={index}
                className={`bg-white dark:bg-gray-800 cursor-text text-text-primary tracking-wide focus:outline-none rounded-lg px-4 py-3
                            border-1 border-gray-300 dark:border-gray-600 select-none`}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            )
          })
        }
      </div>
      <div className={`text-xs font-semibold tracking-wide text-center ${formError === "" ? "text-bg-secondary" : "text-red-500"}`}>
        { formError === "" ? "No Error" : formError }
      </div>
      <div className="flex md:flex-row flex-col md:justify-center gap-3">
        <PrimaryButton name="Clear" isLoading={false} handleClick={handleClear}/>
        <PrimaryButton name="Submit" isLoading={loading} handleClick={handleLogin}/>
      </div>
    </div>
  )
}