import { useState } from "react";
import SidebarHeader from "./SidebarHeader";
import UserSearchList from "./UserSearchList";
import type { SearchUserResponse } from "../../services/chatServices";
import { SidebarSearchContext } from "../../context/SidebarSearchContext";
import ConversationList from "./ConversationList";

export default function Sidebar() {

  const [searchResults, setSearchResults] = useState<Array<SearchUserResponse>>([])
  const [isSearching, setIsSearching] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>("")

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
        {
          searchTerm.length < 3 ? <ConversationList/> : <UserSearchList/>
        }
      </aside>
    </SidebarSearchContext.Provider>
  )
}