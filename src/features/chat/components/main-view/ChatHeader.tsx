import { IoSearchOutline, IoEllipsisVertical, IoShieldCheckmark } from "react-icons/io5"
import { useSelectedUserForChat } from "../../context/SelectedUserForChatProvider"

export default function ChatHeader() {

  const { selectedUser } = useSelectedUserForChat()

  if(!selectedUser) {
    return
  }

  return (
    <header className="px-6 py-3 bg-bg-primary/80 backdrop-blur-md flex items-center justify-between border-b border-bg-tertiary/10 z-10">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center font-bold text-white flex-shrink-0 border border-bg-tertiary/10">
          {selectedUser.username[0].toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-text-secondary leading-tight">{selectedUser.username}</p>
          <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase tracking-wider">
            <IoShieldCheckmark size={12} />
            <span>Verified Session</span>
          </div>
        </div>
      </div>
      <div className="flex gap-3 text-text-primary">
         <button className="p-2 hover:bg-bg-secondary rounded-full transition-colors"><IoSearchOutline size={20}/></button>
         <button className="p-2 hover:bg-bg-secondary rounded-full transition-colors"><IoEllipsisVertical size={20}/></button>
      </div>
    </header>
  )
}