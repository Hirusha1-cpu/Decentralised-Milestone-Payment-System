# Escrow System Architecture

## Overview
Decentralized escrow system for freelance payments with dispute resolution.

## Components
1. **Escrow.sol** - Main contract
2. **IEscrow.sol** - Interface
3. **EscrowLibrary.sol** - Data structures
4. **Errors.sol** - Custom errors

## Actors
- Client: Creates escrow, approves work
- Freelancer: Completes work
- Arbitrator: Resolves disputes

## State Machine
PENDING → COMPLETED → RELEASED
         ↓          ↓
      DISPUTED    REFUNDED
         ↓
      RESOLVED

## Security Features
- ReentrancyGuard
- Access Control
- State Validation
- Time-based locks
