// const CONTRACT_ADDRESS = "0xBfe7f07224c0cEB5B164649e92E7772E6D859B9A"
const PORT = 3000
const IS_REVEALED = true
const UNREVEALED_METADATA = {
  "name":"Unrevealed Croc",
  "description":"???",
  "image":"http://ntf.test.sovereignnature.ch/unrevealed/image.png",
  "attributes":[{"???":"???"}]
}

const fs = require('fs')
const express = require('express')
require('dotenv').config()
// const { getContract } = require("./helpers");
// const contract = await getContract("NFT", hre);
const transactionResponse = await contract.mintTo(taskArguments.address, {
    gasLimit: 500_000,
});

const app = express()

app.use(express.static(__dirname + 'public'))
app.use('/unrevealed', express.static(__dirname + '/unrevealed'));

async function initAPI() {
  app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
  })
}
async function serveMetadata(res, nft_id) {
  // var token_count = parseInt(await contract.currentTokenId())
  let return_value = {}
  try {
    return_value = fs.readFileSync("./metadata/" + nft_id).toString().trim()
  } catch (err) {
    return_value = {error: `${err}`};
  }
  // if(nft_id < 0)
  // {
  //   return_value = {error: "NFT ID must be greater than 0"}
  // }else if (nft_id >= token_count)
  // {
  //   return_value = {error: "NFT ID must be already minted"}
  // }else
  // {
  // }
  res.send(return_value)
}

app.get('/:id', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if(isNaN(req.params.id))//in not number
  {
    res.send(UNREVEALED_METADATA)    
  }
  else if(!IS_REVEALED)
  {
    res.send(
      )
  }else
  {
    serveMetadata(res, req.params.id)
  }
})

initAPI()
