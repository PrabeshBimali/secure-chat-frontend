import { 
  IoPersonOutline, 
  IoDesktopOutline, 
  IoShieldCheckmarkOutline, 
  IoChevronForward 
} from "react-icons/io5"

export default function SettingsList() {
  const settingsOptions = [
    { 
      id: "profile", 
      label: "Profile", 
      desc: "Change your username or email", 
      icon: <IoPersonOutline size={22} /> 
    },
    { 
      id: "devices", 
      label: "Devices", 
      desc: "Manage active devices", 
      icon: <IoDesktopOutline size={22} /> 
    },
    { 
      id: "security", 
      label: "Security", 
      desc: "Passwords, E2EE keys, and account deletion", 
      icon: <IoShieldCheckmarkOutline size={22} /> 
    },
  ]

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
      {settingsOptions.map((option) => (
        <div 
          key={option.id} 
          className="flex items-center gap-4 px-4 py-4 hover:bg-bg-secondary/50 cursor-pointer transition-colors group"
          onClick={() => console.log(`Navigating to ${option.id}`)}
        >
          <div className="w-10 h-10 rounded-full bg-bg-tertiary/20 flex items-center justify-center text-text-primary shrink-0 group-hover:bg-bg-tertiary/40 transition-colors">
            {option.icon}
          </div>

          <div className="flex-1 min-w-0 border-b border-bg-tertiary/10 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-text-secondary">{option.label}</h3>
                <p className="text-xs text-text-primary/60 truncate">{option.desc}</p>
              </div>
              <IoChevronForward className="text-text-primary/30 group-hover:text-text-primary/60 transition-colors" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}