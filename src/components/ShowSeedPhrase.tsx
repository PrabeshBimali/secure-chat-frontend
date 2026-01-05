import { FaCopy } from "react-icons/fa";
import PrimaryButton from "./PrimaryButton";
import { useState } from "react";
import { useToast } from "../context/ToastProvider";

interface ShowSeedPhraseProps {
  rawPhrase: string
  seedPhrase: string[]
  onNext: () => void
  onSeedRefresh: () => void
}

export default function ShowSeedPhrase(props: ShowSeedPhraseProps) {

  const { rawPhrase, seedPhrase, onNext, onSeedRefresh} = props

  const [isChecked, setIsChecked] = useState<boolean>(false)
  const { addToast } = useToast()

  async function copyPhraseOnClipboard() {
    if(rawPhrase.length < 1) return

    await navigator.clipboard.writeText(rawPhrase)
    addToast("Text copied", "success", 1000)
  }

  return (
    <div>
      <div title="copy phrase" className="pb-3" onClick={copyPhraseOnClipboard}>
        <FaCopy className="cursor-pointer text-3xl text-gray-400 hover:text-green-500"/>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {
          seedPhrase.map((word, index) => {
            return (
              <input 
                type="text"
                value={`${index + 1}. ${word}`} 
                key={index}
                readOnly
                className={`bg-white dark:bg-gray-800 cursor-default text-text-primary text-center tracking-wide focus:outline-none rounded-lg px-4 py-3
                            border-1 border-gray-300 dark:border-gray-600 select-none`}
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
            className="w-5 h-5 cursor-pointer"
          />
          <label>
            I have saved my seed phrase. 
          </label>
        </div>
        <div className="flex md:flex-row flex-col md:justify-around gap-3">
          <PrimaryButton name="Generate New Key" isLoading={false} handleClick={onSeedRefresh}/>
          <PrimaryButton name="Move Forward" isLoading={false} handleClick={onNext} disable={!isChecked}/>
        </div>
      </div>
    </div>
  )
}