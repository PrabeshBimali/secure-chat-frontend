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

export async function getChatContext(userid: number, signal: AbortSignal) {
  const rawResponse = await fetch(`${API_URL}/chat/${userid}`, {
    signal: signal,
    method: "GET",
    credentials: "include"
  });
}