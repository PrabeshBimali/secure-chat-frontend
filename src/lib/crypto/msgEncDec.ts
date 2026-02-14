import { x25519 } from "@noble/curves/ed25519.js"
import { bytesToHex, hexToBytes } from "@noble/curves/utils.js"

interface EncryptedMessagePackage {
  ciphertext: string
  iv: string
}

export async function encryptMessage(text: string, encryptionKey: Uint8Array, partnerPublicKey: Uint8Array): Promise<EncryptedMessagePackage> {

  if (!encryptionKey) throw new Error("Key not initialized")

  const sharedSecret = x25519.getSharedSecret(encryptionKey, partnerPublicKey)

  const cryptoKey = await crypto.subtle.importKey(

    "raw", 
    sharedSecret.buffer as ArrayBuffer, // shared sectret to encrypt
    "AES-GCM", 
    false, 
    ["encrypt"]
  )

  const encodedText = new TextEncoder().encode(text)
  const iv = crypto.getRandomValues(new Uint8Array(12))

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: "AES-GCM", 
      iv

    }, 
    cryptoKey, 
    encodedText
  )

  return { 
    ciphertext: bytesToHex(new Uint8Array(ciphertext)), 
    iv: bytesToHex(iv) 
  }

}

export async function decryptMessage(ciphertext: string, iv: string, encryptionKey: Uint8Array, partnerPublicKey: Uint8Array): Promise<string> {
  if (!encryptionKey) throw new Error("Key not initialized");

  const sharedSecret = x25519.getSharedSecret(encryptionKey, partnerPublicKey)
  
  const cryptoKey = await crypto.subtle.importKey(
    "raw", 
    sharedSecret.buffer as ArrayBuffer, // shared sectret to encrypt
    "AES-GCM", 
    false, 
    ["decrypt"]
  )

  const cipherTextBytes = hexToBytes(ciphertext)
  const ivBytes = hexToBytes(iv)
  
  const decryptedText = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivBytes.buffer as ArrayBuffer
    },
    cryptoKey,
    cipherTextBytes.buffer as ArrayBuffer
  )

  const decodedText = new TextDecoder().decode(decryptedText)

  return decodedText
}