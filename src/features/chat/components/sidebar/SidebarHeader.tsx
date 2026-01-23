import { IoAdd, IoSearchOutline, IoEllipsisVertical } from "react-icons/io5";

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

      <div className="px-4 pb-4">
        <div className="relative group">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-bg-tertiary group-focus-within:text-text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-bg-secondary/60 border border-transparent focus:border-bg-tertiary/30 py-2 pl-10 pr-4 rounded-full focus:outline-none transition-all placeholder:text-bg-tertiary"
          />
        </div>
      </div>
    </div>
  )
}