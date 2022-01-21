const Web3 = require('web3')  // Connect to web3
const web3 = new Web3('http://127.0.0.1:7545') 

// Import smart contract
const nftBuild = require('../build/contracts/NFT.json')
const nftContract = new web3.eth.Contract(nftBuild.abi, nftBuild.networks[5777].address) // Abi and address. ABSOLOUTELY Needed in order to interact with JS

const amountToMint = 5 
const gas = 450000

// Create function does not execute until called
const main = async () => { 
    // By default, the first account in Ganache is used
    const [account] = await web3.eth.getAccounts() // web3js.readthedocs.io makes it easy

    const baseCost = await nftContract.methods.cost().call()
    const totalCost = baseCost * amountToMint

    console.log(`Base cost of minting  | ${web3.utils.fromWei(baseCost.toString(), 'ether')}`) // toString() because BN
    console.log(`Total cost of minting | ${web3.utils.fromWei(totalCost.toString(), 'ether')}\n`) // `` are used to add metadata to strings
    console.log(`Gas fee: ${gas}\n`)

    console.log(`Attempting to mint ${amountToMint} NFTs...\n`) // \n string escape

    // for loop to mint until amountToMint, increasing by 1 every time it loops
    for (var i = 0; i < amountToMint; i++) {
        await nftContract.methods.mint().send({ from: account, value: totalCost, gas: gas }) // You have to do .send whenever you create transaction
    }

    const totalMinted = await nftContract.methods.walletOfOwner(account).call() // Reads this from smart contract

    console.log(`Total NFTs minted: ${totalMinted.length}\n`)

    // for loop to log all the ipfs urls to the console
    for (var i = 0; i < totalMinted.length; i++) {
        const uri = await nftContract.methods.tokenURI(totalMinted[i]).call()
        console.log(`Metadata URI for token ${totalMinted[i]}: ${uri}`) // URI is the IPFS URLs. 
    }
}

// Call function. Can run the script multiple times and keep track of amount
main()