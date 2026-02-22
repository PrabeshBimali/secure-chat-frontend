import { bytesToHex, hexToBytes } from "@noble/curves/utils.js";
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