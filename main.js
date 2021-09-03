let MAX_SUPPLY = 20
let CONTRACT_ADDRESS = "0xB2Fb4178Fb98D546dE65ce57D0e7C07e355b19B9"
const PORT = 3000

const Web3 = require('web3')
const fs = require('fs')
var Contract = require('web3-eth-contract')
Contract.setProvider('https://rinkeby.infura.io/v3/a3e70735b4cf401b9148e1fea8f5a288')
const abi = require('./Contract.json').abi
var contract = new Contract(abi, CONTRACT_ADDRESS)
const express = require('express')

const app = express()

app.use(express.static(__dirname + 'public'))
app.use('/images', express.static(__dirname + '/images'));

async function getContractPublicVariable(res, nft_id) {
  var token_count = await contract.methods.token_count().call()
  let return_value = {}
  if(nft_id < 0)
  {
    return_value = {error: "NFT ID must be greater than 0"}
  }else if(nft_id > MAX_SUPPLY)
  {
    return_value = {error: "NFT ID must be lesser than max supply"}
  }else if (nft_id >= token_count)
  {
    return_value = {error: "NFT ID must be already minted"}
  }else
  {
    return_value = fs.readFileSync("./metadata/" + nft_id).toString().trim()
  }
  res.send(return_value)
}

app.get('/:id', (req, res) => {
  getContractPublicVariable(res, req.params.id)
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})