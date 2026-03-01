import { useEffect, useState } from "react"
import { type ConversationData, getConversationList } from "../../../../services/chatServices"
import { useSelectedUserForChat, type SelectedUser } from "../../context/SelectedUserForChatProvider"

export default function ConversationList() {
  const [ conversationList, setConversationList ] = useState<Array<ConversationData>>([])
  const [ loading, setLoading ] = useState<boolean>(true)
  const { setSelectedUser } = useSelectedUserForChat()

  useEffect(() => {
    setLoading(true)
    const controller = new AbortController()
    const signal = controller.signal

    const fetchConversationList = async () => {
      try { 
        const response = await getConversationList(signal)

        if(!response.success) {
          throw new Error(response.message)
        }

        const data = response.data

        if(data === undefined) {
          throw new Error("Conversation list is undefined")
        }
        setConversationList(data)
      } catch(error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversationList()

    return () => controller.abort()
  }, [])

  function userClicked(user: ConversationData) {
    const selectedUser: SelectedUser = {
      id: user.partnerId,
      username: user.partnerName,
      friendshipStatus: null
    }

    setSelectedUser(selectedUser)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-bg-tertiary">
        <div className="w-8 h-8 border-4 border-t-blue-500 border-bg-secondary rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Fetching Conversations ...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide">
      {conversationList.map((conversation) => (
        <div 
          key={conversation.roomId} 
          onClick={() => userClicked(conversation)}
          className="flex items-center gap-3 px-4 py-3 hover:bg-bg-secondary/50 cursor-pointer transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-bg-tertiary/40 flex-shrink-0" />
          <div className="flex-1 min-w-0 border-b border-bg-tertiary/10 pb-3">
            <div className="flex justify-between items-baseline">
              <span className="font-semibold truncate text-text-secondary">{conversation.partnerName}</span>
              <span className="text-[11px] text-text-primary">Tue</span>
            </div>
            <p className="text-sm text-text-primary/60 truncate mt-0.5">
              Test
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}