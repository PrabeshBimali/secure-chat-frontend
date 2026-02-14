// TODO this should be stored in session later
class PrivateKeyStore {
  key: Uint8Array | null

  constructor() {
    this.key = null
  }

  getKey() {
    return this.key
  }

  setKey(pirvateKey: Uint8Array) {
    this.key = pirvateKey
  }

  clear() {
    this.key = null
  }
}

export const privateKeyStore = new PrivateKeyStore()