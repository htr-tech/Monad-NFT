require("dotenv").config();
const fs = require("fs");
const hre = require("hardhat");
const chalk = require("chalk");
const inquirer = require("inquirer").default;

async function mintNFT() {
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const NFT_CONTRACT = process.env.NFT_CONTRACT;
    const MONAD_RPC_URL = process.env.MONAD_RPC_URL;

    if (!PRIVATE_KEY || !NFT_CONTRACT || !MONAD_RPC_URL) {
        console.error(chalk.red.bold("[-] Error: Missing required .env variables"));
        process.exit(1);
    }

    // Setup provider and wallet
    const provider = new hre.ethers.JsonRpcProvider(MONAD_RPC_URL);
    const wallet = new hre.ethers.Wallet(PRIVATE_KEY, provider);
    console.log(chalk.green(`[+] Using Wallet: ${wallet.address}`));
    console.log(chalk.blue(`[i] Current balance: ${hre.ethers.formatEther(await provider.getBalance(wallet.address))} MON\n`));

    // Get recipient address
    const answers = await inquirer.prompt([{
            type: "input",
            name: "recipient",
            message: "Enter recipient address:",
            default: wallet.address,
            validate: (input) => hre.ethers.isAddress(input) || "Invalid address"
        },
        {
            type: "confirm",
            name: "confirm",
            message: "This will mint 1 NFT. Continue?",
            default: true
        }
    ]);

    if (!answers.confirm) {
        console.log(chalk.yellow("[~] Minting cancelled"));
        process.exit(0);
    }

    // Load contract
    const TestTemplate = await hre.ethers.getContractAt("TestTemplate", NFT_CONTRACT, wallet);
    console.log(chalk.blue(`\n[i] NFT Contract: ${NFT_CONTRACT}`));

    // Mint NFT
    try {
        console.log(chalk.blue.bold("[+] Minting NFT..."));

        const mintPrice = await TestTemplate.MINT_PRICE();
        console.log(chalk.blue(`[i] Mint price: ${hre.ethers.formatEther(mintPrice)} MON`));

        // Check if sender is owner (owner mints free)
        const owner = await TestTemplate.owner();
        const isOwner = owner.toLowerCase() === wallet.address.toLowerCase();

        const txOptions = {
            value: isOwner ? 0 : mintPrice,
            // gasLimit: 80000 // Adjust as needed
        };

        const balance = await provider.getBalance(wallet.address);
        if (!isOwner && balance < mintPrice) {
            throw new Error(`Insufficient balance. Need ${hre.ethers.formatEther(mintPrice)} MON`);
        }

        // Send mint transaction
        const tx = await TestTemplate.mint(answers.recipient, txOptions);
        console.log(chalk.blue(`[i] Transaction hash: ${tx.hash}`));

        const receipt = await tx.wait();
        console.log(chalk.green.bold(`[+] NFT minted successfully!`));
        
        // Check how much gas fee used
        console.log(chalk.blue(`[i] Gas used: ${receipt.gasUsed.toString()}`));
        // Check the current supply
        console.log(chalk.blue(`[i] Total supply: ${await TestTemplate.totalSupply()}`));
        
    } catch (error) {
        console.error(chalk.red.bold("[-] Minting failed:"), error.message);
        process.exit(1);
    }
}

mintNFT().catch((error) => {
    console.error(chalk.red.bold("\n[-] Script failed:"), error);
    process.exit(1);
});
