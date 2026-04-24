import { IoChatbubble } from "react-icons/io5"
import { useSelectedUserForChat } from "../../context/SelectedUserForChatProvider"
import React, { useEffect, useRef, useSyncExternalStore } from "react"
import { activeChatStore } from "../../../../store/ActiveChatStore"
import MessageBox from "./MessageBox"

interface MessageListProps {
  isMessagesLoading: boolean
  isLoadingHistory: boolean
  hasMoreHistory: boolean | undefined
  onLoadHistory: () => Promise<void>
}

export default function MessageList(props: MessageListProps) {

  const messages = useSyncExternalStore(
    activeChatStore.subscribe,
    activeChatStore.getSnapshot
  )

  const scrollRef = useRef<HTMLDivElement>(null)

  const isFetchingRef = useRef(false)
  const cooldownRef = useRef(false)
  const shouldAutoScrollRef = useRef(true)
  const isInitialLoadRef = useRef(true)

  const { isMessagesLoading, isLoadingHistory, hasMoreHistory, onLoadHistory } = props
  const { selectedUser } = useSelectedUserForChat()

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight

    shouldAutoScrollRef.current = distanceFromBottom < 100

    if (
      container.scrollTop > 100 ||
      isLoadingHistory ||
      !hasMoreHistory ||
      isFetchingRef.current ||
      cooldownRef.current
    ) return

    try {
      isFetchingRef.current = true

      await onLoadHistory()

      cooldownRef.current = true
      setTimeout(() => {
        cooldownRef.current = false
      }, 1500)

    } finally {
      isFetchingRef.current = false
    }
  }

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false
      container.scrollTop = container.scrollHeight
      return
    }

    if (shouldAutoScrollRef.current) {
      container.scrollTop = container.scrollHeight
    }

  }, [messages])

  useEffect(() => {
    isInitialLoadRef.current = true
    shouldAutoScrollRef.current = true
  }, [selectedUser])

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-bg-primary text-text-secondary">
        <div className="w-20 h-20 mb-4 opacity-20">
          <IoChatbubble size={80} />
        </div>
        <h2 className="text-xl font-semibold">No Conversation Selected</h2>
        <p className="text-sm opacity-60">
          Pick someone from the left to start a chat.
        </p>
      </div>
    )
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-bg-tertiary">
        <div className="w-8 h-8 border-4 border-t-blue-500 border-bg-secondary rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Messages are Loading...</p>
      </div>
    )
  }
  return ( 
    <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col"> 
    { hasMoreHistory && 
        <div className={`flex-1 flex flex-col items-center justify-center p-5 text-bg-tertiary ${ isLoadingHistory ? "" : "invisible"}`}> 
          <div className="w-4 h-4 border-3 border-t-blue-500 border-bg-secondary rounded-full animate-spin mb-4" /> 
          <p className="text-xs font-medium">Loading message History...</p> </div> } 
          <div className="flex-1"/> 
      
      { 
        messages.map((message) => 
        { 
          return <MessageBox messageDetail={message} key={message.id}/> 
        }) 
      } 
    </div>
    )
  }