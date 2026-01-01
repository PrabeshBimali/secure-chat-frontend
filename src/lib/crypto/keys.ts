import type { DerivedKeys, MasterPublicKeys } from "../../types/global.interfaces";
import { ed25519, x25519 } from "@noble/curves/ed25519.js";

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

async function deriveKeysFromSeed(seed: Uint8Array): Promise<DerivedKeys> {
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

export async function derivePublicKey(seed: Uint8Array): Promise<MasterPublicKeys> {

  const masterKeys = await deriveKeysFromSeed(seed)

  const identityPublicKey = ed25519.getPublicKey(masterKeys.identityKey)
  const encryptionPublicKey = x25519.getPublicKey(masterKeys.encryptionKey)

  return {
    identityPublicKey,
    encryptionPublicKey
  }
}