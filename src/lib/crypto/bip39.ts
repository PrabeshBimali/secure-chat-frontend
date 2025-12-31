import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";

// Generates 12 words seed phrase
export function generateMnemonicsNewUser(): string {
  return bip39.generateMnemonic(wordlist);
}

// Converts 12 word mnemonic to 64 length each item 8 bit array
export async function generateSeed(mnemonic: string): Promise<Uint8Array> {
  return bip39.mnemonicToSeedWebcrypto(mnemonic);
}


