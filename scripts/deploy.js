require("dotenv").config();
const fs = require("fs");
const hre = require("hardhat");
const chalk = require("chalk");
const inquirer = require("inquirer").default;

async function deployNFT() {
    console.log(chalk.blue("[+] Deploying NFT..."));

    // Validate environment variables
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    if (!PRIVATE_KEY) {
        console.error(chalk.red("[-] Error: Private key not found in .env"));
        process.exit(1);
    }

    const MONAD_RPC_URL = process.env.MONAD_RPC_URL;
    if (!MONAD_RPC_URL) {
        console.error(chalk.red("[-] Error: RPC URL not found in .env"));
        process.exit(1);
    }

    // Display deployment confirmation
    const answers = await inquirer.prompt([{
        type: "confirm",
        name: "confirm",
        message: "This will deploy the NFT. Continue?",
        default: true
    }]);

    if (!answers.confirm) {
        console.log(chalk.yellow("[!] Deployment cancelled"));
        process.exit(0);
    }

    // Setup provider and wallet
    const provider = new hre.ethers.JsonRpcProvider(MONAD_RPC_URL);
    const wallet = new hre.ethers.Wallet(PRIVATE_KEY, provider);
    console.log(chalk.green(`\n[+] Using Wallet: ${wallet.address}`));
    console.log(chalk.blue(`[i] Current balance: ${hre.ethers.formatEther(await provider.getBalance(wallet.address))} MON`));

    // Deploy the contract
    console.log(chalk.blue("[+] Deploying contract..."));
    const TestTemplate = await hre.ethers.getContractFactory("TestTemplate", wallet);
    const template = await TestTemplate.deploy();
    const deploymentTx = template.deploymentTransaction();

    console.log(chalk.blue(`[i] Transaction hash: ${deploymentTx.hash}`));
    console.log(chalk.blue(`[i] Waiting for confirmation...`));

    await template.waitForDeployment();
    const contractAddress = await template.getAddress();

    console.log(chalk.green(`[+] NFT Contract deployed at: ${contractAddress}`));
    console.log(chalk.yellow(`[i] Explorer: https://testnet.monadexplorer.com/address/${contractAddress}`));

    // Save contract address to .env file
    saveContractAddress(contractAddress);

}

function saveContractAddress(contractAddress) {
    const envPath = ".env";
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";

    // Remove old entries if they exist
    const envLines = envContent.split('\n').filter(line => !line.startsWith("NFT_CONTRACT="));

    // Add new entry
    envLines.push(`NFT_CONTRACT=${contractAddress}`);

    fs.writeFileSync(envPath, envLines.join('\n'));
    console.log(chalk.green("[+] Contract address saved to .env"));
}

deployNFT().catch((error) => {
    console.error("\n[-] Deployment failed:", error);
    process.exit(1);
});
