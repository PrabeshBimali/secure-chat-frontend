import React, { createContext, useContext, useState } from 'react';
import { type UserRelationshipStatusType } from '../services/chatServices';

interface SelectedUser {
  id: number;
  username: string;
  friendshipStatus: UserRelationshipStatusType;
}

interface ChatContextType {
  selectedUser: SelectedUser | null;
  setSelectedUser: (user: SelectedUser | null) => void;
}

const SelectedUserForChatContext = createContext<ChatContextType | undefined>(undefined)

export function ActiveChatProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null)

  return (
    <SelectedUserForChatContext.Provider value={{selectedUser, setSelectedUser}}>
      {children}
    </SelectedUserForChatContext.Provider>
  )
}

export const useSelectedUserForChat = () => {
  const context = useContext(SelectedUserForChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
};