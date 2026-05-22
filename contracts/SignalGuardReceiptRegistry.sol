// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title SignalGuardReceiptRegistry
/// @notice Minimal Arc-compatible registry for anchoring prediction-market agent receipts.
/// @dev The receipt hash is produced off-chain from a canonical JSON decision receipt.
contract SignalGuardReceiptRegistry {
    event DecisionReceiptAnchored(
        bytes32 indexed receiptHash,
        address indexed anchor,
        string receiptId,
        string market,
        string action,
        uint256 maxNotionalMicrousd,
        uint256 anchoredAt
    );

    mapping(bytes32 => bool) public anchored;

    function anchorReceipt(
        bytes32 receiptHash,
        string calldata receiptId,
        string calldata market,
        string calldata action,
        uint256 maxNotionalMicrousd
    ) external {
        require(receiptHash != bytes32(0), "empty receipt");
        require(!anchored[receiptHash], "already anchored");

        anchored[receiptHash] = true;

        emit DecisionReceiptAnchored(
            receiptHash,
            msg.sender,
            receiptId,
            market,
            action,
            maxNotionalMicrousd,
            block.timestamp
        );
    }
}
