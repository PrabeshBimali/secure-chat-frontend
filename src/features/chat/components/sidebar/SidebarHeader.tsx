import { IoAdd, IoEllipsisVertical } from "react-icons/io5";
import SidebarSearch from "./SidebarSearch";

export default function SidebarHeader() {
  return (
    <div>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-bg-tertiary flex items-center justify-center font-bold text-white shadow-sm">
            U
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text-secondary">Chats</h1>
        </div>
        <div className="flex gap-1">
          <button className="p-2 hover:bg-bg-secondary rounded-full transition-colors text-text-primary">
            <IoAdd size={24} />
          </button>
          <button className="p-2 hover:bg-bg-secondary rounded-full transition-colors text-text-primary">
            <IoEllipsisVertical size={20} />
          </button>
        </div>
      </div>
      <SidebarSearch/>
    </div>
  )
}