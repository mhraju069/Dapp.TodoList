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

let provider;
let signer;
let contract;

// Wait for MetaMask to connect
async function connectToMetaMask() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        document.getElementById("connectButton").innerText = "Connected to MetaMask";
    } else {
        alert("Please install MetaMask to use this DApp");
    }
}

// Add task to the list
async function addTask() {
    const task = document.getElementById("taskInput").value;
    if (task) {
        await contract.AddTusk(task);
        loadTasks();
    }
}

// Load tasks from the contract
async function loadTasks() {
    const tasks = await contract.Show();
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    tasks.forEach((task) => {
        const li = document.createElement("li");
        li.textContent = task;
        taskList.appendChild(li);
    });
}

// Event Listeners
document.getElementById("connectButton").addEventListener("click", connectToMetaMask);
document.getElementById("addTaskButton").addEventListener("click", addTask);

// Load tasks on page load
window.onload = loadTasks;
