import { generateStorageKey } from "./keys"

export interface EncryptedVaultPackage {
  cipherText: ArrayBuffer
  iv: Uint8Array
  salt: Uint8Array
}

export async function encryptMasterSeed(password: string, masterSeed: Uint8Array): Promise<EncryptedVaultPackage> {
  const salt = crypto.getRandomValues(new Uint8Array(16))

  const rawKey = await generateStorageKey(password, salt)

  const cryptoKey = await crypto.subtle.importKey(
    "raw", 
    rawKey.buffer as ArrayBuffer, 
    "AES-GCM", 
    false, 
    ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12))

  const cipherText = await crypto.subtle.encrypt(
    {
      name: "AES-GCM", 
      iv
    }, 
    cryptoKey, 
    masterSeed.buffer as ArrayBuffer
  );

  return {
    cipherText,
    iv,
    salt
  }
}

export async function decryptMasterSeed(password: string, ciphertext: Uint8Array, iv: Uint8Array, salt: Uint8Array): Promise<Uint8Array> {
  try {
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
      ciphertext.buffer as ArrayBuffer
    )

    return new Uint8Array(masterSeed)
  } catch(error) {
    if(error instanceof DOMException && error.name === "OperationError") {
      throw new Error("INVALID_PASSWORD")
    }

    throw error
  }
}