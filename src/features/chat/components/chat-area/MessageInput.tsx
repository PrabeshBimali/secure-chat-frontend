import { IoSend } from "react-icons/io5"
import { MdOutlineImage } from "react-icons/md"
import { useActiveChat } from "../../context/ActiveChatProvider";
import { UserRelationshipStatus, type UserRelationshipStatusType } from "../../services/chatServices";

export default function MessageInput() {
  
  const {selectedUser} = useActiveChat()
  
  function statusPlaceholderMapping(status: UserRelationshipStatusType) {
    switch(status) {
      case UserRelationshipStatus.NONE:
        return "Send your first message"
      
      case UserRelationshipStatus.REQUEST_RECEIVED:
        return "Wants to chat"

      case UserRelationshipStatus.FRIENDS:
        return "Click to chat"

      case UserRelationshipStatus.REQUEST_SENT:
        return "Pending request..."

      case UserRelationshipStatus.THEY_BLOCKED:
        return "Cannot message the user"

      case UserRelationshipStatus.YOU_BLOCKED:
        return "You blocked this user"
    }
  }

  if(!selectedUser) {
    return
  }

  return (
    <div className="p-4 bg-bg-primary">
      <div className="flex items-end gap-2 max-w-5xl mx-auto">
        <button className="p-3 text-text-primary hover:bg-bg-secondary rounded-full transition-colors">
          <MdOutlineImage size={24} />
        </button>
        
        <div className="flex-1 flex items-center bg-bg-secondary/50 border border-bg-tertiary/10 rounded-3xl px-4 py-2 shadow-inner">
          <textarea 
            rows={1}
            placeholder={statusPlaceholderMapping(selectedUser.friendshipStatus)}
            className="flex-1 bg-transparent border-none focus:outline-none resize-none py-1 text-[15px] text-text-primary placeholder:text-bg-tertiary"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
        </div>

        <button className="p-3 bg-bg-tertiary text-white rounded-full hover:brightness-110 active:scale-95 transition-all shadow-md">
          <IoSend size={20} />
        </button>
      </div>
    </div>
  )
}