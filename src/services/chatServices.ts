import { x25519 } from "@noble/curves/ed25519.js";
import type { MessageDetailForUI } from "../store/ActiveChatStore";
import type { HTTPResponse } from "../types/global.interfaces";
import { decryptMessage } from "../lib/crypto/msgEncDec";
import { formatDate } from "../lib/utils/dateFormatter";
import {} from "../lib/crypto/decryptWorker"

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
  createdAt: string
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

interface SendMessageResponse {
  messageId: string
  status: "sent" | "delivered" | "read"
  partnerId: number
}

export interface ConversationData {
  roomId: string
  partnerId: number
  partnerName: string
  lastMessageAt: Date
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
  })

  const response: HTTPResponse<RecentChatHistoryResponse> = await rawResponse.json()
  return response
}

export async function getConversationList(signal: AbortSignal): Promise<HTTPResponse<Array<ConversationData>>> {
  const rawResponse = await fetch(`${API_URL}/rooms/list`, {
    signal: signal,
    method: "GET",
    credentials: "include"
  })

  const response = await rawResponse.json()
  return response as HTTPResponse<Array<ConversationData>>
}

export async function sendMessage(partnerId: number, ciphertext: string, iv: string): Promise<HTTPResponse<SendMessageResponse>> {

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

  const response = await rawResponse.json() as HTTPResponse<SendMessageResponse>
  return response
}

export function decryptMessagesWorker(messages: Array<MessageDetail>, encryptionKey: Uint8Array, publicKey: Uint8Array): Promise<Array<MessageDetailForUI>> {
  console.log("Worker started")

  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("../lib/crypto/decryptWorker.ts", import.meta.url), { type: "module" })

    worker.postMessage({ type: "message_decrypt", payload: {messages, encryptionKey, publicKey} })

    worker.onmessage = (e) => {
      const data = e.data
      worker.terminate()
      resolve(data)
    }

    worker.onerror = (err) => {
      const error = err
      worker.terminate()
      reject(error)
    }
  })
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
      createdAt: formatDate(value.createdAt),
      senderId: value.senderId,
      replyId: value.replyId
    }
  }))

  return messagesPromises
}