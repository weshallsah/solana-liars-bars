# 🎲 Liar’s Bar – Solana Backend (On‑Chain Program)

Liar’s Bar is a **multiplayer bluffing card game** built on **Solana**, inspired by classic *Liar’s Dice / Liar’s Poker* mechanics and redesigned for a **trustless, on‑chain environment**. This repository contains the **Solana backend program** responsible for game state, player actions, and fair gameplay enforcement.

---

## 🧠 Game Concept (High Level)

* Players sit at a virtual bar table
* Each player holds hidden cards
* On each turn, a player:

  * Places a bet (claims cards)
  * Or calls **“Liar”** on the previous player
* The smart contract verifies outcomes and updates state
* Losers are penalized (round loss / elimination)

The blockchain ensures:

* No cheating
* Deterministic outcomes
* Transparent dispute resolution

---

## 🏗 Architecture Overview

```
Frontend (Web / Game UI)
   ↓ (RPC calls)
Anchor Program (Solana)
   ├── Game Account (Room State)
   ├── Player Accounts
   ├── Turn / Bet Logic
   ├── Liar Verification
   └── Round Resolution
```

---

## ⚙️ Tech Stack

* **Blockchain:** Solana
* **Framework:** Anchor
* **Language:** Rust
* **Client SDK:** @coral-xyz/anchor
* **Testing:** Mocha + Anchor Test Validator

---

## 📦 Program Structure

```
programs/liars-bar
├── src/
│   ├── lib.rs              # Program entry
│   ├── state/              # PDA account structures
│   │   ├── game.rs
│   │   └── player.rs
│   ├── instructions/       # Game actions
│   │   ├── create_room.rs
│   │   ├── join_room.rs
│   │   ├── place_bet.rs
│   │   ├── call_liar.rs
│   │   └── resolve_round.rs
│   └── errors.rs           # Custom program errors
│
├── tests/                  # Anchor tests
│   └── liars-bar.ts
│
├── Anchor.toml
└── Cargo.toml
```

---

## 🧩 Core Accounts

### 🎮 GameAccount (PDA)

Stores global game state

* room_id
* admin / creator
* current_turn
* last_bet
* pot / stake
* game_status (waiting / active / finished)

---

### 👤 PlayerAccount (PDA)

Tracks per‑player state

* player_pubkey
* cards_hash (commitment)
* is_active
* penalties

---

## 🔑 Instructions (Core Logic)

### 1️⃣ Create Room

Creates a new game room

```rust
create_room(room_id, max_players)
```

* Initializes GameAccount
* Sets creator as admin

---

### 2️⃣ Join Room

Allows players to join before game starts

```rust
join_room()
```

* Creates PlayerAccount
* Assigns seat index

---

### 3️⃣ Place Bet

Player claims a card combination

```rust
place_bet(card_value, quantity)
```

* Validates turn
* Stores last bet

---

### 4️⃣ Call Liar

Challenges the previous bet

```rust
call_liar()
```

* Triggers round resolution
* Reveals commitments

---

### 5️⃣ Resolve Round

Determines winner & penalties

```rust
resolve_round()
```

* Verifies bets
* Applies penalties
* Advances turn

---

## 🔐 Fairness & Anti‑Cheat Design

* **Commit–Reveal Scheme**

  * Players submit hashed card commitments
  * Revealed only when liar is called

* **Deterministic Rules**

  * All logic enforced on‑chain

* **No Trusted Server**

  * Program is sole authority

---

## 🧪 Testing

Run local validator tests:

```bash
anchor test
```

Includes:

* Room creation
* Player joins
* Turn enforcement
* Liar detection
* Edge‑case handling

---

## 🚀 Deployment

```bash
anchor build
anchor deploy
```

Update `Anchor.toml` with cluster config.

---

## 🛣 Roadmap

* [ ] Token‑based staking
* [ ] Spectator mode
* [ ] NFT avatars
* [ ] Inco / FHE‑based private card logic
* [ ] Mobile‑friendly frontend

---

## 👨‍💻 Author

**Vishal Sah**
Backend & Web3 Engineer
Solana • Rust • Anchor • GameFi

---

## 📜 License

MIT License
