// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract NFT is ERC721, Ownable {

  // Constants
  uint256 public constant MAX_SUPPLY = 1000;

  /// @dev Base token URI used as a prefix by tokenURI().
  string public baseTokenURI;

  constructor() ERC721("PH_8747", "B4S") {
    baseTokenURI = "https://api.breath4.sale/PH_8747/metadata/";
    uint i=0;
    for (i = 0; i < MAX_SUPPLY; i += 1) {  //for loop example
      _safeMint(owner(), i);
    }
  }

  /// @dev Returns an URI for a given token ID
  function _baseURI() internal view virtual override returns (string memory) {
    return baseTokenURI;
  }

  /// @dev Sets the base token URI prefix.
  function setBaseTokenURI(string memory _baseTokenURI) public onlyOwner {
    baseTokenURI = _baseTokenURI;
  }

}
