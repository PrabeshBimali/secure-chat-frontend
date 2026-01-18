import { useState } from "react";
import RecoveryForm from "../components/RecoveryForm";
import AuthLayout from "../layouts/AuthLayout";
import CreateVaultOnRecovery from "../components/CreateVaultOnRecovery";

export default function RecoverWithSeed() {

  const [step, setStep] = useState<number>(1)
  const [seed, setSeed] = useState<Uint8Array>()
  const [devicePrivk, setDevicePrivk] = useState<CryptoKey>()
  const [devicePbk, setDevicePbk] = useState<string>("")
  const [uname, setUname] = useState<string>("")

  function handleRecoverySuccess(masterSeed: Uint8Array, device_privk: CryptoKey, device_pbk: string, username: string) {
    setStep(2)
    setSeed(masterSeed)
    setDevicePrivk(device_privk)
    setDevicePbk(device_pbk)
    setUname(username)
  }

  return (
    <AuthLayout>
      {step === 1 &&
        <RecoveryForm 
          onRecoverySuccess={handleRecoverySuccess}
        />
      }

      {step === 2 && 
        <CreateVaultOnRecovery/>
      }
    </AuthLayout>
  )
}