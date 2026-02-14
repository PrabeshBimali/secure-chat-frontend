# SecureChat E2EE

A real-time, End-to-End Encrypted (E2EE) messaging platform designed with a focus on cryptographic integrity and modern security practices.



## The Technical Aspects

This project isn't just a socket application; it's a deep dive into the browser's cryptographic capabilities. By moving the encryption boundary to the client, the server acts purely as a blind relay.

* **Identity & Key Exchange:** Implements **ED25519 and X25519 Diffie-Hellman** (via `noble-curves`) to derive private keys for encryption and identity locally.
* **Authenticated Encryption:** Utilizes **AES-256-GCM** via the native **Web Crypto API**, ensuring both confidentiality and data integrity (tamper-proofing).
* **Memory Management:** Implements "Zero-Knowledge" principles—private keys are never stored in LocalStorage or sent to the backend.
* **Unique Devices:** Devices have their own private key which are saved locally for identification. Generated using **Web crypto API** which uttilized **ECDSA with P-256 curve**

## Security Architecture

### 1. Registration Flow
User create private key from master seed. Backend verifies user and device using Digital signature.
1. User creates account and saves seed phrase securely
2. User creates username, enters email and
3. User generates password for the device, which will be used for decrypting encrypted masterseed saved in IndexeDB
4. Master seed will in IndexedDB after encrypted using password hash along device private which will be saved as non-extractable Private CryptoKey
5. Database will only store username, email, identity public key and encryption public key used for verifying user identity later.

### 2. Login Flow
1. User enters username and device's password
2. Password's hash will be used for decrypt masterseed and derive private keys
3. server send two nonces (random bytes) one for device private key and other for identity private key to sign
4. frontend will sign nonces and send to backend which will verify if right private keys signed those nonces using saved public keys

### 2. Zero-Knowledge Handshake
The backend is "blind." During the connection handshake:
1.  User A retrieves User B’s **Public Key** from the database.
2.  User A derives a `sharedSecret` using their own **Private Key**.
3.  The message is encrypted to **Ciphertext** before it ever hits the server.

### 3. Socket Authentication & Presence
* **Handshake Middleware:** Utilizes `io.use()` to verify **HttpOnly JWT cookies** before establishing a WebSocket connection.
* **Session Isolation:** Each socket connection is mapped to a verified `userId` on the server, preventing identity spoofing.
* **Ungoing Research**

### 4. Attack Vector Mitigations
* **XSS Defense:** Use of `HttpOnly` cookies for session tokens ensures that even if a script is injected, the session cannot be hijacked.
* **Non-Exportable Keys:** Leverages Web Crypto's ability to keep keys in a non-readable memory space wherever possible.

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Node.js (Express), Socket.io, PostgreSQL, Redis
- **Cryptography:** `@noble/curves` (X25519/Ed25519), Web Crypto API (AES-GCM)
- **State:** React Context API + Custom Hooks

## References & Technical Research

### Standards & RFCs
* [Secure Messaging Apps and Group Protocols](https://blog.quarkslab.com/secure-messaging-apps-and-group-protocols-part-1.html) - Designing Simple DH based E2EE chat protocol.
* [Learning fast elliptic-curve cryptography](https://paulmillr.com/posts/noble-secp256k1-fast-ecc/) - Basic understanding of ECC
* [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) - For secure Hashing algorithms research
* [Database Indexing Explained](https://computersciencesimplified.substack.com/p/database-indexing-explained)- Learning Database indexing

### Documentation & Tools
* [Web Crypto API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) - Native browser encryption.
* [Noble Curves](https://github.com/paulmillr/noble-curves) - High-security light-weight cryptographic JS library by Paul Miller.

---

## TODO
- [ ] **Implementing message transfer:** send encrypted message to server and save it.
- [ ] **Settings:** Implement Settings to view devices and manage them, change username, password etc.
- [ ] **Multi-Device Sync:** Handling key distribution across multiple authorized devices.

---

## Possible Upgrades in Future
- Perfect Forward Secrity
- Device based jwt token, where we validate jwt is linked to device for each requireAuth requets (High computation cost, only for critical operations)
- Sign msg with identity so server can be sure msg is from correct user.