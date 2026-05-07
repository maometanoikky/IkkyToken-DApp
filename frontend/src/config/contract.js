/**
 * IkkyToken Contract ABI
 * 
 * Berisi fungsi-fungsi yang digunakan oleh frontend untuk berinteraksi dengan smart contract.
 * ABI ini harus di-update setiap kali kontrak di-compile ulang.
 */
export const IKKYTOKEN_ABI = [
    // ERC-20 Standard
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address account) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) returns (bool)",

    // Ownable
    "function owner() view returns (address)",
    "function transferOwnership(address newOwner)",
    "function renounceOwnership()",

    // Pausable
    "function paused() view returns (bool)",
    "function pause()",
    "function unpause()",

    // IkkyToken Custom
    "function mint(address to, uint256 amount)",
    "function renounceOwnershipPermanently()",
    "function isOwnershipRenounced() view returns (bool)",
    "function blacklist(address account)",
    "function unblacklist(address account)",
    "function isBlacklisted(address account) view returns (bool)",

    // Events
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)",
    "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
    "event OwnershipRenouncedPermanently(address indexed previousOwner)",
    "event Paused(address account)",
    "event Unpaused(address account)",
    "event Blacklisted(address indexed account)",
    "event UnBlacklisted(address indexed account)"
];

/**
 * Contract Address
 * 
 * PENTING: Ganti dengan alamat kontrak setelah deploy!
 * Alamat ini akan berbeda untuk setiap deployment.
 */
export const CONTRACT_ADDRESS = "0x78E7ff55799D465670895bbb2A3E142E32dc39E6";

/**
 * Network Configuration
 */
export const NETWORKS = {
    sepolia: {
        chainId: "0xaa36a7", // 11155111 in hex
        chainName: "Sepolia Testnet",
        nativeCurrency: {
            name: "Sepolia ETH",
            symbol: "ETH",
            decimals: 18
        },
        rpcUrls: ["https://rpc.sepolia.org"],
        blockExplorerUrls: ["https://sepolia.etherscan.io"]
    },
    localhost: {
        chainId: "0x7a69", // 31337 in hex
        chainName: "Localhost",
        nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18
        },
        rpcUrls: ["http://127.0.0.1:8545"],
        blockExplorerUrls: []
    }
};

/**
 * Fungsi helper untuk format alamat wallet
 */
export const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Fungsi helper untuk format token amount
 */
export const formatTokenAmount = (amount, decimals = 18) => {
    if (!amount) return "0";
    const value = Number(amount) / Math.pow(10, decimals);
    return value.toLocaleString("en-US", { maximumFractionDigits: 4 });
};
