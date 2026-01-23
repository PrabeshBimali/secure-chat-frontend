import ConversationList from "./ConversationList";
import SidebarHeader from "./SidebarHeader";

export default function Sidebar() {
  return (
    <aside className="w-full md:w-80 lg:w-96 flex flex-col border-r border-bg-tertiary/20 bg-bg-primary">
      <SidebarHeader/>
      <ConversationList/>   
    </aside>
  )
}