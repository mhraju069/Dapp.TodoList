
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


// Initialize provider and contract only if MetaMask is connected
async function connectToMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
            await provider.send("eth_requestAccounts", []); // MetaMask এ একাউন্ট রিকোয়েস্ট
            signer = provider.getSigner(); // বর্তমান সাইনারের জন্য একটি signer তৈরি
            const userAddress = await signer.getAddress(); // সাইনারের ঠিকানা পেতে
            document.getElementById('metaAddress').textContent = `Connected: ${userAddress}`;
            
            contract = new ethers.Contract(contractAddress, contractABI, signer); // contract ইন্সট্যান্স তৈরি
        } catch (error) {
            console.error("MetaMask connection error:", error);
            alert("Error connecting to MetaMask");
        }
    } else {
        alert("Please install MetaMask!");
    }
}

// টাস্ক দেখানো
async function showTasks() {
    if (!contract) {
        alert("Please connect to MetaMask first.");
        return;
    }

    try {
        const tasks = await contract.Show(); // contract থেকে টাস্ক রিট্রিভ করা
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = ''; // পুরানো টাস্ক মুছে দিন

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task; // টাস্ক দেখানো
            taskList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        alert("Failed to load tasks.");
    }
}

// নতুন টাস্ক যোগ করা
async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const task = taskInput.value;

    if (!task) {
        alert("Please enter a task");
        return;
    }

    if (!contract) {
        alert("Please connect to MetaMask first.");
        return;
    }

    try {
        const tx = await contract.AddTusk(task); // টাস্ক contract এ যোগ করা
        await tx.wait(); // transaction confirmation এর জন্য অপেক্ষা করা
        alert("Task added successfully!");

        taskInput.value = ''; // ইনপুট ফিল্ড পরিষ্কার করা
        showTasks(); // টাস্কগুলো আবার দেখানো
    } catch (error) {
        console.error("Error adding task:", error);
        alert("Failed to add task.");
    }
}

// DOM এ ইভেন্ট লিসনার সেট করা
document.getElementById('connectButton').addEventListener('click', connectToMetaMask);
document.getElementById('showTasksButton').addEventListener('click', showTasks);
document.getElementById('addTaskButton').addEventListener('click', addTask);