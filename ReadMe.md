# @repcomm/datasync

## Code
- [anarchy.ts](./src/anarchy.ts)<br/>
- [store.ts](./src/store.ts)

## Methodology
### Pushing data mutation contract
1. Detect mutation needed
2. Detect if concerns peers
3. Create contract with proposed mutation, Time To Live, and sign with private key
4. Distribute contract to peers
5. Await response
6. Verify public keys / validate decisions
7. Apply local copies of mutation based on consensus

### Receiving data mutation contracts
1. Listen to contract proposals
2. Receive individual contract
3. Verify contract w/ creator's public key
4. Determine boolean decision and sign with private key
5. Distribute decision

## Reasoning
- Handling disagreement
  - 50% or more consensus required for decisions
- Artificial decision weight inflation (creating multiple voting identities)
  - Do nothing (sort of)
  - Find other reasons to discriminate duplicate voting identities (ex: idle identities detection, etc)
  - introduce proof of stake

