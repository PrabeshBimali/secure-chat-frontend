import { useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import BasicLayout from "../layouts/BasicLayout"

export default function VerifyEmail() {

  const navigate = useNavigate()

  const [message, setMessage] = useState<string>("Verifying Email ...")

  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  
  const hasUseEffectRun = useRef(false)

  async function verifyEmail() {
    try {

      const rawResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({token})
      })

      const response = await rawResponse.json()

      if(response.success) {
        setMessage(response.message + " Redirecting to Login...")
        setTimeout(() => navigate(`/login`,), 3000)
      } else {
        setMessage(response.message)
      }

    } catch(error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if(!hasUseEffectRun.current) {
      verifyEmail()
      hasUseEffectRun.current = true
    }
  }, [])

  return (
    <BasicLayout>
      <div className="flex justify-center">
        <div className="md:w-1/2 md:text-2xl text-md font-semibold text-center">
          {message}
        </div>
      </div>
    </BasicLayout>
  )
}