import { x25519 } from "@noble/curves/ed25519.js";
import type { MessageDetailForUI } from "../store/ActiveChatStore";
import type { HTTPResponse } from "../types/global.interfaces";
import { hexToBytes } from "@noble/curves/utils.js";
import { decryptMessage } from "../lib/crypto/msgEncDec";

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
  id: number
  username: string
  friendshipStatus: UserRelationshipStatusType
}

export interface MessageDetail {
  id: string
  ciphertext: string
  iv: string
  isEdited: boolean
  status: "sent" | "delivered" | "read"
  createdAt: Date
  senderId: number
  replyId: string | null
}

interface RecentChatHistoryResponse {
  id: number
  username: string
  publicKey: string
  friendshipStatus: UserRelationshipStatusType
  roomid: string
  messages: Array<MessageDetail>
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

export async function sendMessage(partnerId: number, ciphertext: string, iv: string) {

  const payload = {
    partnerId, 
    ciphertext,
    iv
  }

  const rawResponse = await fetch(`${API_URL}/chat/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(payload)
  })

  const response = await rawResponse.json()
}

export async function decryptMessagesForUI(messages: Array<MessageDetail>, encryptionKey: Uint8Array, publicKey: Uint8Array): Promise<Array<MessageDetailForUI>> {
  const sharedSecret = x25519.getSharedSecret(encryptionKey, publicKey)
  
  const cryptoKey = await crypto.subtle.importKey(
    "raw", 
    sharedSecret.buffer as ArrayBuffer, // shared sectret to encrypt
    "AES-GCM", 
    false, 
    ["decrypt"]
  )

  const messagesPromises = Promise.all(messages.map(async (value) => {
    const decryptedMessage = await decryptMessage(value.ciphertext, value.iv, cryptoKey)
    
    return {
      id: value.id,
      message: decryptedMessage,
      isEdited: value.isEdited,
      status: value.status,
      createdAt: value.createdAt,
      senderId: value.senderId,
      replyId: value.replyId
    }
  }))

  return messagesPromises
}