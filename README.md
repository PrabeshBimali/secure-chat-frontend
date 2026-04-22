# SecureChat E2EE

A real-time, End-to-End Encrypted (E2EE) messaging platform on web, designed with a focus on cryptographic integrity and modern security practices.

## Demo

### Register

![Seed Phrase Demo](./public/demo/register-seedphrase.jpg)

1. First 12 words Seed phrase is generated using [@scure/bip39](https://github.com/paulmillr/scure-bip39) library from [2048 English wordlists](https://github.com/paulmillr/scure-bip39/blob/main/src/wordlists/english.ts). 
2. 12 word mnemonics is converted to 64 length Unit8Array using `mnemonicToSeedWebCrypto`  function from same library which will be our master seed.

![Register Form](./public/demo/register-form.jpg)

3. Once user clicks register, two private keys `encryption key` and `identity key` are generated from the masterseed utilizing `deriveBits` function from native `crypto` library using **HKDF (HMAC-based Key Derivation Function)** with **SHA-256** hashing algorithm.
4. Generated Private keys will be used to create two public keys `encryption public key` which will be utilized for encrypting messages and `identity public key` which will be utilized for verifying identity i.e. seed phrase.
    * **Identity public key**: This will be generated using [ED25519](https://github.com/paulmillr/noble-curves) elliptical curve.
    * **Encryption public key**: This will be generated using [curve25519](https://cryptography.io/en/latest/hazmat/primitives/asymmetric/x25519/) elliptical curve.
5. Password and a random 12 byte **salt** will be used to create storage key using [Aragon2id](https://www.npmjs.com/package/hash-wasm) hashing algorithm. Generated hash will be used to encrypt masterseed using **AES-GCM** algorithm from native `crypto` library.
6. `private and public keys` for device is generated using **ECDSA** with **P-256** curve.

![Data Saved in IndexedDB](./public/demo/indexeddb.jpg)

7. User data like `username, email, identity public key, encryption public key, device name` will be sent to backend and if response is successful `encrypted master seed, device private (non-extractable) and public keys etc.` will be stored in indexedDB.

### Login


![Login Form](./public/demo/login-form.jpg)

1. When user enters `username` and `password` first **indexedDB** is checked to make sure data for this user exists. Then `username` and `device public key` from indexedDB is sent to server.

![Nonces for client](./public/demo/32bytes-nonces.jpg)

2. `Server` checks if `username and device public key` are valid then generates two 32 bytes random nonces: `identityNonce` and `deviceNonce` (as shown in figure above) and sends them to the client.

3. After getting `nonces` from `server` client uses `password` entered by user along with salt saved in indexedDB to generate storage key (the key which was used to `encrypt` masterseed before storing in indexedDB). This storage key is used to `decrypt` masterseed.

![Decrypt Master Seed](./public/demo/decrypt-masterseed.jpg)

4. Once `masterseed` is decrypted it can be used to generate `Identity private key` which will sign `identityNonce` and `Device private key` will sign `deviceNonce`. Nonces signed by both private keys are sent to the `server`.

5. After receiving `nonces` signed by `identity and device private keys` server will check if `signatures` are valid against their respective public keys which are stored in server. If both signatures are valid user can login. If any one of the `signatures` is invalid, appropriate error message is sent to client.

### Chatting

![Homepage after user logs in for the first time](./public/demo/home-first-login.jpg)

(***Note: Let's say our user is user-A and their friend is user-B***)

1. If `user-A` does not have any chats they can search for other users using their `username` in `search bar`.
2. When `user-A` finds their `user-B's username` in search list, they can click the `user-B` and send message. Once `user-B` is clicked server will send that `user-B's` data like `id, username, encryption public key etc` which will be saved in `ActiveChatPartner` global store.

![First chat](./public/demo/first-chat.jpg)

3. when `user-A` sends `message` an `encryption key` will be generated using `user-A's` `private encryption key` (*Remember two private keys we generated when registering.*) and `user-B's public key`. This process of generating `shared secret key` without sharing secret key through **insecure channel** is called [**Elliptical Curve Diffie Hellman (ECDH)**](https://cryptobook.nakov.com/asymmetric-key-ciphers/ecdh-key-exchange) key exchange scheme. `Elliptical Curve` because we used **curve25519** to generate public keys for encryption.
4. Generated `shared secret key` will be used to encrypt `message` before sending it to the `server`. `Server` will check relationship between users and if relationship is valid, save and send message to `user-B`. 

![Message saved in Database](./public/demo/message-saved.jpg)

5. Once `user-B` gets encrypted message from server it will use `user-B's public key` and and its own `private encryption key` to generate same **Shared secret key** which will be used to `decrypt` the `message`.` Message Decryption` can take long time (*few seconds of calculation*) if there are many messsages and it will freeze the UI. So, ir will be performed in different `process` utilizing **Web Worker API** as shown in figure below.

![Utilizing Web Worker](./public/demo/web-worker.jpg)

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
- [ ] **Settings:** Implement Settings to view devices and manage them, change username, password etc.
- [ ] **Multi-Device Sync:** Handling key distribution across multiple authorized devices.

---

## Possible Upgrades in Future
- Perfect Forward Secrity
- Device based jwt token, where we validate jwt is linked to device for each requireAuth requets (High computation cost, only for critical operations)
- Sign msg with identity so server can be sure msg is from correct user.