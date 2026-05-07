# IkkyToken DApp

DApp untuk Skripsi Informatika - **Pencegahan Kontrol Sentralistik pada Token ERC-20**

## 📋 Deskripsi

Proyek ini mendemonstrasikan mekanisme desentralisasi pada token ERC-20 menggunakan smart contract Solidity dan frontend React. Fitur utama adalah kemampuan untuk melepaskan kepemilikan (ownership) secara permanen, sehingga tidak ada pihak yang dapat mengontrol token secara terpusat setelahnya.

## 🛠️ Teknologi

- **Smart Contract**: Solidity 0.8.20, OpenZeppelin, Hardhat
- **Frontend**: React 18, Tailwind CSS, Ethers.js 6
- **Network**: Sepolia Testnet / Localhost

## 📁 Struktur Proyek

```
DApp/
├── contracts/
│   └── IkkyToken.sol      # Smart contract utama
├── scripts/
│   └── deploy.js          # Script deployment
├── test/
│   └── IkkyToken.test.js  # Unit tests
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── config/        # Contract ABI & config
│   │   ├── App.jsx        # Main app
│   │   └── index.css      # Tailwind styles
│   └── ...
├── hardhat.config.js
└── package.json
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Root folder (smart contract)
npm install

# Frontend
cd frontend
npm install
cd ..
```

### 2. Compile Smart Contract

```bash
npx hardhat compile
```

### 3. Run Tests

```bash
npx hardhat test
```

### 4. Deploy (Local)

```bash
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Deploy
npx hardhat run scripts/deploy.js --network localhost
```

### 5. Configure Frontend

Edit `frontend/src/config/contract.js`:
```javascript
export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_ADDRESS_HERE";
```

### 6. Run Frontend

```bash
cd frontend
npm run dev
```

## 📱 Fitur DApp

1. **Connect Wallet** - Koneksi MetaMask
2. **Dashboard** - Status kepemilikan & info token
3. **Admin Panel** - Mint & Pause (owner only)
4. **Renounce Ownership** - Lepas kepemilikan permanen
5. **Transaction Log** - Bukti untuk Bab IV

## 🧪 Skenario Pengujian (Bab IV)

| No | Skenario | Expected Result |
|----|----------|-----------------|
| 1 | Owner mint sebelum renounce | ✅ Berhasil |
| 2 | Owner pause sebelum renounce | ✅ Berhasil |
| 3 | Renounce ownership | ✅ Owner = address(0) |
| 4 | Mint setelah renounce | ❌ Revert |
| 5 | Pause setelah renounce | ❌ Revert |

## 📄 License

MIT

---

**Author**: Rizqi - Skripsi Informatika
