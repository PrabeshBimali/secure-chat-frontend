export interface LocalVault {
  username: string
  salt: Uint8Array
  iv: Uint8Array
  ciphertext: Uint8Array
  device_pbk: string
  device_privk: CryptoKey
}
const DB_NAME = "VaultDB"
const DB_VERSION = 1

export async function initializeDb(): Promise<IDBDatabase> {

  return new Promise((resolve, reject) => {

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("identities")) {
        db.createObjectStore("identities", { keyPath: "username" })
      }
    };

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error) 
  })
}

export async function saveIdentity(db: IDBDatabase, data: LocalVault): Promise<void> {
  const tx = db.transaction("identities", "readwrite")
  const store = tx.objectStore("identities")

  const request = store.put(data)

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(request.error)
    }

  })
}

export async function getIdentity(db: IDBDatabase, username: string): Promise<LocalVault> {
  const tx = db.transaction("identities", "readonly")
  const store = tx.objectStore("identities")

  const request = store.get(username)

  return new Promise((resolve, reject) => {
    request.onsuccess = () => { 
      resolve(request.result) 
    }

    request.onerror = () => { 
      reject(request.error)
    }
  })
}