let provider;
let signer;
let contract;

const contractAddress = "0x8a11748f0e0600aafdedee205deab5b9bb534cf0"; // Replace with your deployed contract address
const contractABI = [
    [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "tusk",
                    "type": "string"
                }
            ],
            "name": "AddTusk",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "index",
                    "type": "uint256"
                }
            ],
            "name": "Remove",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "Show",
            "outputs": [
                {
                    "internalType": "string[]",
                    "name": "",
                    "type": "string[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
    // Add your contract ABI here
    // Example ABI, replace it with your contract's ABI from Remix
];

// Initialize provider and contract only if MetaMask is connected

async function connectToMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            const userAddress = await signer.getAddress();
            document.getElementById('metaAddress').textContent = `Connected: ${userAddress}`;
            
            contract = new ethers.Contract(contractAddress, contractABI, signer);
        } catch (error) {
            console.error("MetaMask connection error:", error);
            alert("Error connecting to MetaMask");
        }
    } else {
        alert("Please install MetaMask!");
    }
}

// Ensure the contract is properly initialized before calling functions
async function showTasks() {
    if (!contract) {
        alert("Please connect to MetaMask first.");
        return;
    }

    try {
        const tasks = await contract.getTasks();
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = ''; // Clear previous tasks

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task;
            taskList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        alert("Failed to load tasks.");
    }
}

document.getElementById('connectButton').addEventListener('click', connectToMetaMask);
document.getElementById('showTasksButton').addEventListener('click', showTasks);
