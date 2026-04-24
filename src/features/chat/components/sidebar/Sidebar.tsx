import { useState, useSyncExternalStore } from "react"
import SidebarHeader from "./SidebarHeader"
import UserSearchList from "./UserSearchList"
import type { SearchUserResponse } from "../../../../services/chatServices"
import { SidebarSearchContext } from "../../context/SidebarSearchContext"
import ConversationList from "./ConversationList"
import SidebarSearch from "./SidebarSearch"
import { sidebarViewStore } from "../../../../store/SidebarViewStore"
import SettingsList from "./SettingsList"

export default function Sidebar() {

  const [searchResults, setSearchResults] = useState<Array<SearchUserResponse>>([])
  const [isSearching, setIsSearching] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const view = useSyncExternalStore(sidebarViewStore.subscribe, sidebarViewStore.getSnapshot)

  function renderList() {
    console.log(view)
    if (view === 'SETTINGS') return <SettingsList/>
    if (view === 'ARCHIVED') return <h1>Archived</h1>
    if (view === 'BLOCKED') return <h1>Blocked</h1>
    
    return searchTerm.length < 3 ? <ConversationList /> : <UserSearchList />
  }

  return (
    <SidebarSearchContext.Provider
      value={{
        searchResults,
        setSearchResults,
        isSearching,
        setIsSearching,
        searchTerm,
        setSearchTerm
      }}
    >
      <aside className="w-full md:w-80 lg:w-96 flex flex-col border-r border-bg-tertiary/20 bg-bg-primary">
        <SidebarHeader/>
        {view === 'HOME' && <SidebarSearch />}

        <div className="flex-1 overflow-y-auto">
          {renderList()}
        </div>
      </aside>
    </SidebarSearchContext.Provider>
  )
}