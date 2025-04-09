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

async function connectToMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        // Create a new instance of the Web3 provider using MetaMask
        provider = new ethers.providers.Web3Provider(window.ethereum);

        // Request the user's Ethereum accounts
        try {
            await provider.send("eth_requestAccounts", []);  // Requesting the user's accounts from MetaMask
            signer = provider.getSigner();  // Get the signer to interact with the blockchain
            const userAddress = await signer.getAddress();  // Get the user's address
            console.log("Connected with address:", userAddress);
            document.getElementById('metaAddress').textContent = `Connected Address: ${userAddress}`;

            // Create contract instance
            contract = new ethers.Contract(contractAddress, contractABI, signer);

        } catch (error) {
            console.error("User denied account access", error);
            alert("Please allow MetaMask to connect to your account!");
        }
    } else {
        alert("Please install MetaMask to use this app!");
    }
}

async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const task = taskInput.value;

    if (task === "") {
        alert("Please enter a task!");
        return;
    }

    // Call the addTask function from the contract
    try {
        const tx = await contract.addTask(task);
        await tx.wait();
        console.log("Task added:", task);
        alert("Task added successfully!");
        taskInput.value = '';  // Clear the input field
    } catch (error) {
        console.error("Error adding task:", error);
        alert("Failed to add task!");
    }
}

// Ensure the contract is initialized before calling functions
if (contract) {
    const tasks = await contract.getTasks();
    // Continue with your logic
} else {
    alert("Contract not initialized. Please connect MetaMask first.");
}

async function showTasks() {
    try {
        // Call the getTasks function from the contract
        const tasks = await contract.getTasks();
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';  // Clear existing list

        // Display each task in the list
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task;
            taskList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        alert("Failed to load tasks!");
    }
}

// Event listeners
document.getElementById('connectButton').addEventListener('click', connectToMetaMask);
document.getElementById('addTaskButton').addEventListener('click', addTask);
document.getElementById('showTasksButton').addEventListener('click', showTasks);