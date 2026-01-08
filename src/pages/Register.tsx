import { useEffect, useState } from "react";
import ShowSeedPhrase from "../components/ShowSeedPhrase";
import AuthLayout from "../layouts/AuthLayout";
import VerifySeedPhrase from "../components/VerifySeedPhrase";
import { generateMnemonics } from "../lib/crypto/bip39";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {

  const [step, setStep] = useState<number>(1)
  const [rawPhrase, setRawPhrase] = useState<string>("")
  const [seedPhrase, setSeedPhrase] = useState<Array<string>>([])

  function generateNewPhrase() {
    const phrase = generateMnemonics()
    setRawPhrase(phrase)
    const phraseArr = phrase.split(" ")
    setSeedPhrase(phraseArr)
  }

  useEffect(() => {
    if(rawPhrase === "") {
      generateNewPhrase()
    }
  }, [])

  return (
    <AuthLayout>
      {step === 1 && <ShowSeedPhrase 
                        rawPhrase={rawPhrase} 
                        seedPhrase={seedPhrase} 
                        onNext={() => setStep(2)}
                        onSeedRefresh={generateNewPhrase}
                      />
      }

      {step === 2 && <VerifySeedPhrase
                        seedPhrase={seedPhrase}
                        onNext={() => setStep(3)}
                        onBack={() => setStep(1)}
                      />
      }

      {step === 3 && <RegisterForm
                        rawPhrase={rawPhrase}
                      />
      }
    </AuthLayout>
  )
}