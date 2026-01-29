import React, { createContext, useContext, useState } from 'react';
import { type UserRelationshipStatusType } from '../services/chatServices';

interface SelectedUser {
  id: number;
  username: string;
  frienddshipStatus: UserRelationshipStatusType;
}

interface ChatContextType {
  selectedUser: SelectedUser | null;
  setSelectedUser: (user: SelectedUser | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null)

  return (
    <ChatContext.Provider value={{selectedUser, setSelectedUser}}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
};