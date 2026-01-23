import { useEffect, useState } from "react"
import PrimaryButton from "../../../components/PrimaryButton";

interface VerifySeedPhraseProps {
  seedPhrase: string[]
  onBack: () => void
  onNext: () => void
}

export default function VerifySeedPhrase(props: VerifySeedPhraseProps) {

  const { seedPhrase, onNext, onBack } = props

  const [inputWords, setInputWords] = useState<Record<number, string>>({})
  const [targetIndices, setTargetIndices] = useState<number[]>([])

  useEffect(() => {
    const indices = new Set<number>();
  
    while(indices.size < 3) {
      const randomNum = Math.floor(Math.random() * 12);
      indices.add(randomNum);
    }
  
    setTargetIndices(Array.from(indices).sort((a, b) => a - b));
  }, [])

  function handleInputChange(index: number, word: string) {
    setInputWords((prev) => ({
      ...prev,
      [index]: word,
    }))
  }

  const isVerified = targetIndices.every((index) => { 
    return inputWords[index]?.trim().toLowerCase() === seedPhrase[index]?.toLowerCase()
  })

  return (
    <div className="text-text-primary flex flex-col gap-3">
      <p className="text-2xl font-semibold mb-4 text-center">Please verify seed phrase below</p>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {
          targetIndices.map((wordIndex, index) => {
            return (
              <div key={index} className="flex flex-col">
                <span className="text-sm font-semibold">Word #{wordIndex + 1}</span>
                <input 
                  value={inputWords[wordIndex]}
                  type="text" 
                  className={`bg-white dark:bg-gray-800 cursor-text text-text-primary tracking-wide focus:outline-none rounded-lg px-4 py-3
                              border-1 border-gray-300 dark:border-gray-600 select-none`}
                  onChange={(e) => handleInputChange(wordIndex, e.target.value)}
                />
              </div>
            )
          })
        }
      </div>
      <div>
        <div className="flex md:flex-row flex-col md:justify-center gap-3">
            <PrimaryButton name="Go Back" isLoading={false} handleClick={onBack}/>
            <PrimaryButton name="Move Forward" isLoading={false} handleClick={onNext} disable={!isVerified}/>
        </div>
      </div>
    </div>
  )
}