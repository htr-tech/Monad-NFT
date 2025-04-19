# Monad-NFT - An ERC721 NFT Deployment Template

## Overview
This is an ERC721 NFT demo deployed on the Monad Testnet.

This is just a demo script to demonstrate how to deploy (a minimal template contract was used).

> You can code your own and deploy it the same way — just change the contract name inside `script/deploy.js` and `script/mint.js`.


## Follow Me:

<a href="https://github.com/htr-tech" target="_blank">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" width="40" height="40"/></a>
&nbsp;&nbsp;&nbsp;
<a href="https://twitter.com/catz_web3" target="_blank">
  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg" alt="Twitter" width="40" height="40"/>
</a>


## Requirements
Before using this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- A Monad Testnet wallet with testnet funds

---

## Installation

1. Clone this repository:
   ```sh
   git clone https://github.com/htr-tech/Monad-NFT.git
   cd Monad-NFT
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Configure environment variables:
   - Add your wallet private key in the `.env` file:
     ```env
     PRIVATE_KEY=0x...
     ```

---

## Usage

### 1. Compile the NFT Contract
Compile the smart contract with:
```sh
npm run compile
```

### 2. Deploy the NFT
To deploy the NFT to the Monad Testnet:
```sh
npm run deploy
```
After deployment, the `NFT_CONTRACT` address will be saved to your `.env` file.

### 3. Mint NFT
To mint an NFT to your wallet:
```sh
npm run mint
```
You'll be prompted to confirm the minting after running this command.

