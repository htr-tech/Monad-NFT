// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract TestTemplate is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    uint256 public constant MAX_SUPPLY = 100; // MAXIMUM SUPPLY
    uint256 public constant MINT_PRICE = 0.69 * 10**18; // 0.69 MON  (MINT PRICE FOR NON-OWNERS)
    string private constant _IMAGE_URI = "ipfs://QmQEVVLJUR1WLN15S49rzDJsSP7za9DxeqpUzWuG4aondg"; // NFT IMAGE IPFS (CHANGE IT TO YOURS)

    constructor() ERC721("Test NFT Template", "TNT") Ownable(msg.sender) {
        _tokenIdCounter = 0;
    }

    // Mint function, restricted to owner, free for owner
    function mint(address to) external payable onlyOwner {
        require(_tokenIdCounter < MAX_SUPPLY, "Max supply reached");
        if (msg.sender != owner()) {
            require(msg.value >= MINT_PRICE, "Insufficient payment");
        }

        _tokenIdCounter++;
        _safeMint(to, _tokenIdCounter);
    }

    // HardCoded tokenURI
    function tokenURI(uint256) public pure override returns (string memory) {
        return string(abi.encodePacked(
            'data:application/json;utf8,',
            '{"name":"Test NFT",',
            '"description":"A TEST ERC NFT TEMPLATE",',
            '"image":"', _IMAGE_URI, '",',
            '"attributes":[',            
            '{"trait_type":"Status","value":"Active"},',
            '{"trait_type":"Food","value":"Copium"}',
            ']}'
        ));
    }

    // Current total supply
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

}
