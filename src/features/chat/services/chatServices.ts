import type { HTTPResponse } from "../../../types/global.interfaces";

const API_URL = `${import.meta.env.VITE_API_URL}`

export const UserRelationshipStatus = {
  NONE: "NONE",
  FRIENDS: "FRIENDS",
  REQUEST_SENT: "REQUEST_SENT",
  REQUEST_RECEIVED: "REQUEST_RECEIVED",
  YOU_BLOCKED: "YOU_BLOCKED",
  THEY_BLOCKED: "THEY_BLOCKED",
} as const

export type UserRelationshipStatusType = typeof UserRelationshipStatus[keyof typeof UserRelationshipStatus]

export interface SearchUserResponse {
  id: number,
  username: string,
  friendshipStatus: UserRelationshipStatusType
}

export interface MessageDetail {
  id: string
  ciphertext: string
  iv: string
  isEdited: string
  status: "sent" | "delivered" | "read"
  createdAt: Date
  senderId: number
  replyId: string
}

interface RecentChatHistoryResponse {
  id: number
  username: string
  publicKey: string
  friendshipStatus: UserRelationshipStatusType
  roomid: string
  messsages: Array<MessageDetail>
}

export async function searchUser(userid: number, searchTerm: string, signal: AbortSignal): Promise<HTTPResponse<Array<SearchUserResponse>>> {

  const payload = {
    userid: userid,
    usernamePattern: searchTerm
  }

  const rawResponse = await fetch(`${API_URL}/users/search`, {
    signal: signal,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const response: HTTPResponse<Array<SearchUserResponse>> = await rawResponse.json()

  return response
}

export async function getRecentChatHistory(userid: number, signal: AbortSignal): Promise<HTTPResponse<RecentChatHistoryResponse>> {
  const rawResponse = await fetch(`${API_URL}/chat/${userid}`, {
    signal: signal,
    method: "GET",
    credentials: "include"
  });

  const response: HTTPResponse<RecentChatHistoryResponse> = await rawResponse.json()

  return response
}