import type { DerivedKeys } from "../../types/global.interfaces";

async function deriveBits(baseKey: CryptoKey, label: string): Promise<Uint8Array> {
  const key = await crypto.subtle.deriveBits(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(),
      info: new TextEncoder().encode(label)
    },
    baseKey,
    256
  )

  return new Uint8Array(key)
}

// derive keys from seed
export async function deriveKeysFromSeed(seed: Uint8Array): Promise<DerivedKeys> {
  const masterKey: CryptoKey = await crypto.subtle.importKey(
    "raw", 
    seed.buffer as ArrayBuffer, 
    "HKDF",
    false,
    ["deriveBits"]
  );

  const identityKey = await deriveBits(masterKey, "identity_v1")
  const encryptionKey = await deriveBits(masterKey, "encryption_v1")

  return {
    identityKey,
    encryptionKey
  }
}