import { useEffect, useState } from "react"
import PrimaryButton from "./PrimaryButton"
import { generateSeed } from "../lib/crypto/bip39"

export default function SeedLoginForm() {

  const emptyArr = new Array(12).fill("")
  const [loading, setLoading] = useState(false)
  const [inputWords, setInputWords] = useState<Array<string>>(emptyArr)
  const [formError, setFormError] = useState<string>("")

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

  async function handleLogin() {
    setLoading(true)
    setFormError("")

    try {
      const mnemonic = convertInputWordsToMnemonic(inputWords)
      if(mnemonic === null) return

      const masterSeed = await generateSeed(mnemonic)

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