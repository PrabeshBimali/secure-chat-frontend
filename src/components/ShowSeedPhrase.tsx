import { FaCopy } from "react-icons/fa";
import PrimaryButton from "./PrimaryButton";
import { useEffect, useState } from "react";
import { generateMnemonics } from "../lib/crypto/bip39";
import { useToast } from "../context/ToastProvider";

export default function ShowSeedPhrase() {
  const [rawPhrase, setRawPhrase] = useState<string>("")
  const [seedPhrase, setSeedPhrase] = useState<Array<string>>([])
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const { addToast } = useToast()

  function generateNewPhrase() {
    const phrase = generateMnemonics()
    setRawPhrase(phrase)
    const phraseArr = phrase.split(" ")
    setSeedPhrase(phraseArr)
  }

  async function copyPhraseOnClipboard() {
    if(rawPhrase.length < 1) return

    await navigator.clipboard.writeText(rawPhrase)
    addToast("Text copied", "success", 2)
  }

  useEffect(() => {
    generateNewPhrase()
  }, [])

  return (
    <div>
      <div title="copy phrase" className="pb-3" onClick={copyPhraseOnClipboard}>
        <FaCopy className="cursor-pointer text-3xl text-gray-400 hover:text-green-500"/>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {
          seedPhrase.map(v => {
            return (
              <input 
                type="text"
                value={v} 
                readOnly
                className={`bg-white dark:bg-gray-800 cursor-default text-text-primary text-center tracking-wide focus:outline-none rounded-lg px-4 py-3
                            border-1 border-gray-300 dark:border-gray-600`}
              />
            )
          })
        }
      </div>
      <div>
        <div className="flex items-center gap-2 my-4 justify-center">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="w-5 h-5"
          />
          <label>
            I have saved my seed phrase securely. 
          </label>
        </div>
        <div className="flex md:flex-row flex-col md:justify-around gap-3">
          <PrimaryButton name="Generate New Key" isLoading={false} handleClick={generateNewPhrase}/>
          <PrimaryButton name="Move Forward" isLoading={false} handleClick={() => console.log("hmm")} disable={!isChecked}/>
        </div>
      </div>
    </div>
  )
}