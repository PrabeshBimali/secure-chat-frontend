import { bytesToHex, hexToBytes } from "@noble/curves/utils.js";
import { derivePrivateKeysFromSeed, generateStorageKey } from "./keys";
import { ed25519 } from "@noble/curves/ed25519.js";

export async function signDevice(nonceHex: string, privateKey: CryptoKey): Promise<string> {
  const nonceBytes = hexToBytes(nonceHex)

  const signature = await crypto.subtle.sign(
    {
      name: "ECDSA",
      hash: {"name": "SHA-256"}
    },
    privateKey,
    nonceBytes.buffer as ArrayBuffer
  )

  const signatureHex = bytesToHex(new Uint8Array(signature))

  return signatureHex
}

export function signIdentity(nonceHex: string, privateKey: Uint8Array): string {
  const nonceBytes = hexToBytes(nonceHex)
  const rawSignature = ed25519.sign(nonceBytes, privateKey)

  const signatureHex = bytesToHex(rawSignature)

  return signatureHex
}


export async function signIdentityWithPassword(nonceHex: string, password: string, cipherText: Uint8Array, iv: Uint8Array, salt: Uint8Array): Promise<string> {
  try{
    const rawStorageKey = await generateStorageKey(password, salt)

    const storageKey = await crypto.subtle.importKey(
      "raw", 
      rawStorageKey.buffer as ArrayBuffer, 
      "AES-GCM", 
      false, 
      ["decrypt"]
    );
    
    const masterSeed = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv.buffer as ArrayBuffer
      },
      storageKey,
      cipherText.buffer as ArrayBuffer
    )

    const privateKeys = await derivePrivateKeysFromSeed(new Uint8Array(masterSeed))

    return signIdentity(nonceHex, privateKeys.identityKey)

  } catch(e) {
    if(e instanceof DOMException && e.name === "OperationError") {
      throw new Error("INVALID_PASSWORD")
    }

    throw e
  }

}
