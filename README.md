# 🛡️ SecureChat E2EE

A real-time, End-to-End Encrypted (E2EE) messaging platform designed with a focus on cryptographic integrity and modern security practices.



## 🚀 The Technical "Moat"

This project isn't just a socket application; it's a deep dive into the browser's cryptographic capabilities. By moving the encryption boundary to the client, the server acts purely as a blind relay.

* **Identity & Key Exchange:** Implements **X25519 Diffie-Hellman** (via `noble-curves`) to derive shared secrets locally.
* **Authenticated Encryption:** Utilizes **AES-256-GCM** via the native **Web Crypto API**, ensuring both confidentiality and data integrity (tamper-proofing).
* **Memory Management:** Implements "Zero-Knowledge" principles—private keys are never stored in LocalStorage or sent to the backend.
* **Optimistic UI:** Custom state management to handle message delivery statuses (`sending`, `sent`, `failed`) for a seamless user experience.

## 🏗️ Security Architecture

### 1. Zero-Knowledge Handshake
The backend is "blind." During the connection handshake:
1.  User A retrieves User B’s **Public Key** from the database.
2.  User A derives a `sharedSecret` using their own **Private Key**.
3.  The message is encrypted to **Ciphertext** before it ever hits the network.



### 2. Socket Authentication & Presence
* **Handshake Middleware:** Utilizes `io.use()` to verify **HttpOnly JWT cookies** before establishing a WebSocket connection.
* **Session Isolation:** Each socket connection is mapped to a verified `userId` on the server, preventing identity spoofing.
* **Automatic Reconnection:** Robust handling of connectivity blips with automatic socket re-handshaking and state synchronization.

### 3. Attack Vector Mitigations
* **XSS Defense:** Use of `HttpOnly` cookies for session tokens ensures that even if a script is injected, the session cannot be hijacked.
* **Content Security Policy (CSP):** Strict script-loading rules to prevent unauthorized code execution.
* **Non-Exportable Keys:** Leverages Web Crypto's ability to keep keys in a non-readable memory space.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Node.js (Express), Socket.io, PostgreSQL
- **Cryptography:** `@noble/curves` (X25519/Ed25519), Web Crypto API (AES-GCM)
- **State:** React Context API + Custom Hooks

## 📚 References & Technical Research

This project was built following industry-standard security research and documentation:

### Standards & RFCs
* [RFC 7748: Elliptic Curves for Security](https://datatracker.ietf.org/doc/html/rfc7748) - The math behind X25519.
* [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf) - Recommendation for Block Cipher Modes of Operation: Galois/Counter Mode (GCM).
* [The Noise Protocol Framework](http://noiseprotocol.org/) - Design patterns for modern crypto handshakes.

### Documentation & Tools
* [Web Crypto API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) - Native browser encryption.
* [Noble Curves](https://github.com/paulmillr/noble-curves) - High-security cryptographic JS library by Paul Miller.
* [Socket.io Security Best Practices](https://socket.io/docs/v4/security-considerations/) - Handling authenticated handshakes.

---

## 🚦 Roadmap
- [ ] **Perfect Forward Secrecy (PFS):** Implementing the Double Ratchet algorithm.
- [ ] **Encrypted Media:** Supporting E2EE for images and voice notes using Blobs.
- [ ] **Multi-Device Sync:** Handling key distribution across multiple authorized devices.

---