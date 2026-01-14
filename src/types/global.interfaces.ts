export interface DerivedKeys {
  identityKey: Uint8Array
  encryptionKey: Uint8Array
}

export interface MasterPublicKeys {
  identityPublicKey: Uint8Array
  encryptionPublicKey: Uint8Array
}

export interface HTTPResponse<T> {
  success: boolean
  message: string
  details?: any
  data?: T
}