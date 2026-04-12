import { useState, useRef, type MouseEvent as MouseEventI } from "react"
import { IoAdd, IoEllipsisVertical, IoSettingsOutline, IoLogOutOutline, IoArchiveOutline, IoBanOutline } from "react-icons/io5"
import { useAuth } from "../../../../context/AuthProvider"
import { sidebarViewStore, type SidebarViewType } from "../../../../store/SidebarViewStore"

export default function SidebarHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useAuth()
  const menuRef = useRef<HTMLDivElement>(null)

  function handleOpenMenu(event: MouseEventI<HTMLDivElement, MouseEvent>) {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false)
    }
  }

  function handleMenuOptionClick(option: SidebarViewType) {
    sidebarViewStore.setState(option)
    setIsMenuOpen(false)
  }

  return (
    <div className="relative">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-bg-tertiary flex items-center justify-center font-bold text-white shadow-sm">
            U
          </div>
          <h1 
            className="hover:text-text-secondary text-xl font-semibold tracking-tight cursor-pointer"
            onClick={() => handleMenuOptionClick("HOME")}
          >
            {user?.username}
          </h1>
        </div>

        <div className="flex gap-1 relative">
          <button className="p-2 hover:bg-bg-secondary rounded-full transition-colors text-text-primary">
            <IoAdd size={24} />
          </button>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2 hover:bg-bg-secondary rounded-full transition-colors text-text-primary ${isMenuOpen ? 'bg-bg-secondary' : ''}`}
          >
            <IoEllipsisVertical size={20} />
          </button>

          {isMenuOpen && (
            <div 
              ref={menuRef}
              onClick={(e) => handleOpenMenu(e)}
              className="absolute right-0 top-12 w-48 bg-bg-primary border border-bg-tertiary rounded-lg shadow-xl z-50 animate-in fade-in zoom-in duration-100"
            >
              <MenuOption icon={<IoArchiveOutline />} label="Archived" onClick={() => handleMenuOptionClick("ARCHIVED")} />
              <MenuOption icon={<IoBanOutline />} label="Blocked" onClick={() => handleMenuOptionClick("BLOCKED")} />
              <MenuOption icon={<IoSettingsOutline />} label="Settings" onClick={() => handleMenuOptionClick("SETTINGS")} />
              <hr className="border-bg-tertiary" />
              <MenuOption 
                icon={<IoLogOutOutline />} 
                label="Logout" 
                onClick={() => console.log('logout')} 
                variant="danger" 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MenuOption({ icon, label, onClick, variant = "default" }: any) {
  const colorClass = variant === "danger" ? "text-red-500 hover:bg-red-200" : "text-text-primary hover:bg-bg-secondary";
  
  return (
    <button 
      onClick={onClick}
      className={`cursor-pointer w-full px-4 py-2 flex items-center gap-3 text-sm transition-colors ${colorClass}`}
    >
      <span className="opacity-70">{icon}</span>
      {label}
    </button>
  );
}