import { useState, createContext, useContext } from 'react'
import { x25519 } from '@noble/curves/ed25519.js'
import { bytesToHex, hexToBytes } from '@noble/curves/utils.js'

interface EncryptMessagePackage {
  ciphertext: string
  iv: string
}

interface EncryptionContextType {
  initializeKey: (rawKey: Uint8Array) => void
  encryptMessage: (text: string, partnerPublicKey: Uint8Array) => Promise<EncryptMessagePackage>
  decryptMessage: (ciphertext: string, iv: string, partnerPublicKey: Uint8Array) => Promise<string>
}

export const EncryptionContext = createContext<EncryptionContextType | null>(null);

export function MessageEncryptionProvider({ children }: {children: React.ReactNode}): React.ReactElement {
  const [encryptionKey, setEncryptionKey] = useState<Uint8Array | null>(null);

  const initializeKey = (rawKey: Uint8Array) => {
    setEncryptionKey(rawKey);
  }

  const encryptMessage = async (text: string, partnerPublicKey: Uint8Array): Promise<EncryptMessagePackage> => {
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

  const decryptMessage = async (ciphertext: string, iv: string, partnerPublicKey: Uint8Array): Promise<string> => {
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

  return (
    <EncryptionContext.Provider value={{ initializeKey, encryptMessage, decryptMessage }}>
      {children}
    </EncryptionContext.Provider>
  )
}

export const useMessageEncryption = (): EncryptionContextType => {
  const context = useContext(EncryptionContext);
  if (!context) throw new Error("useMessageEncyption must be used within a MessageEncryptionProvider");
  return context;
};