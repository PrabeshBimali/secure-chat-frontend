import { generateStorageKey } from "./keys"

export interface EncryptedVaultPackage {
  cipherText: ArrayBuffer
  iv: Uint8Array
  salt: Uint8Array
}

export async function prepareVaultForRegistration(password: string, masterSeed: Uint8Array): Promise<EncryptedVaultPackage> {
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
    {name: 
      "AES-GCM", 
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