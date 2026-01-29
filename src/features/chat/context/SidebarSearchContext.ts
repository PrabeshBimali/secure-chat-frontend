import React, { createContext, useContext } from "react";
import type { SearchUserResponse } from "../services/chatServices";

type SidebarSearchContextType = {
  searchResults: Array<SearchUserResponse>
  setSearchResults: React.Dispatch<React.SetStateAction<Array<SearchUserResponse>>>
  isSearching: boolean
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>
  searchTerm: string
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
};

export const SidebarSearchContext =
  createContext<SidebarSearchContextType | undefined>(undefined);

export function useSidebarSearch() {
  const ctx = useContext(SidebarSearchContext);
  if (!ctx) throw new Error("useSidebarSearch must be used inside Sidebar");
  return ctx;
}
