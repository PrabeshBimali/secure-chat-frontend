import { useEffect, useState } from "react"
import PrimaryButton from "./PrimaryButton";

interface VerifySeedPhraseProps {
  seedPhrase: string[]
  onBack: () => void
  onNext: () => void
}

export default function VerifySeedPhrase(props: VerifySeedPhraseProps) {

  const { seedPhrase, onNext, onBack } = props

  const [targetIndices, setTargetIndices] = useState<number[]>([])

  useEffect(() => {
    const indices = new Set<number>();
  
    while(indices.size < 3) {
      const randomNum = Math.floor(Math.random() * 12);
      indices.add(randomNum);
    }
  
    setTargetIndices(Array.from(indices).sort((a, b) => a - b));
  }, [])

  return (
    <div className="text-text-primary flex flex-col gap-3">
      <p className="text-2xl font-semibold mb-4 text-center">Please verify seed phrase below</p>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {
          targetIndices.map((index) => {
            return (
              <div key={index} className="flex flex-col">
                <span className="text-sm font-semibold">Word #{index + 1}</span>
                <input 
                 type="text" 
                 className={`bg-white dark:bg-gray-800 cursor-text text-text-primary tracking-wide focus:outline-none rounded-lg px-4 py-3
                              border-1 border-gray-300 dark:border-gray-600 select-none`}
                />
              </div>
            )
          })
        }
      </div>
      <div>
        <div className="flex md:flex-row flex-col md:justify-center gap-3">
            <PrimaryButton name="Go Back" isLoading={false} handleClick={onBack}/>
            <PrimaryButton name="Move Forward" isLoading={false} handleClick={onNext}/>
        </div>
      </div>
    </div>
  )
}