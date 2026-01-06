import type { DerivedKeys, MasterPublicKeys } from "../../types/global.interfaces";
import { ed25519, x25519 } from "@noble/curves/ed25519.js";
import { argon2id } from "hash-wasm"

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

async function derivePrivateKeysFromSeed(seed: Uint8Array): Promise<DerivedKeys> {
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

export async function derivePublicKeys(seed: Uint8Array): Promise<MasterPublicKeys> {

  const keys = await derivePrivateKeysFromSeed(seed)

  const identityPublicKey = ed25519.getPublicKey(keys.identityKey)
  const encryptionPublicKey = x25519.getPublicKey(keys.encryptionKey)

  return {
    identityPublicKey,
    encryptionPublicKey
  }
}

export async function generateStorageKey(password: string, salt: Uint8Array): Promise<Uint8Array> {
  const storageKey = await argon2id({
    password: password,
    salt: salt,
    parallelism: 1,
    iterations: 2,
    memorySize: 19456, // use 19Mb memory
    hashLength: 32, // output size = 32 bytes
    outputType: "binary", // return Uint8Array
  });

  return storageKey
}

