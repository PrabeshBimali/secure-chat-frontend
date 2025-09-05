import { useEffect, useRef, useState } from "react";
import BasicLayout from "../layouts/BasicLayout";
import { useSearchParams } from "react-router";

export default function SendEmailVerification() {

  const [searchParams] = useSearchParams()
  const email = searchParams.get("email")
  const id = searchParams.get("id")

  const [message, setMessage] = useState<string>("Sending Email Please Wait...")
  const hasUseEffectRun = useRef(false)

  async function sendVerificationEmail() {
    try{
      if(!email) {
        setMessage("Invalid Email")
      }

      const rawResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/send-verification-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, id})
      })

      const response = await rawResponse.json()

      if(response.success) {
        setMessage(`Verification link has been sent to: ${email}. Please click the link and verify your  email`)
      } else {
        console.error(response.message)

        if(rawResponse.status === 409) {
          setMessage(response.message)
          return
        }

        setMessage(`Some error occured when sending verification link`)
      }

    } catch(error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (!hasUseEffectRun.current) {
      sendVerificationEmail()
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