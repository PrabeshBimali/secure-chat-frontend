import { useEffect } from "react"
import { useSocket } from "../context/SocketProvider"

export default function SocketEventsWrapper() {

  const { socket } = useSocket()

  useEffect(() => {
    console.log("Wrapper Socket State:", socket?.id || "No Socket Yet");

    return () => {
      socket?.off("message")
    }
  }, [socket])

  return null
}