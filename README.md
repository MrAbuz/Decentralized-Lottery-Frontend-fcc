Things to add:
Add a way to add more than 1 entry at a time. With an input field with how many entries
Add a display like a list with the addresses that already joined in the lottery and with how much entries each one (by listening to the event of EnterRaffle())
Add a listener for the event that is emited when someone wins the lottery, so that it updates an winner address state hook and automatically renders the frontend when some address wins. Atm we need to manually refresh (proposed by Patrick)

For me: 
Remember that i'm opening 3 terminals in total for dev:
-One normal in nextjs-smartcontract-lottery-fcc
-One with "yarn dev" (terminal to run it localhost in the browser)
-Other one where I: cd ..; cd hardhat-smartcontract-lottery-fcc; yarn hardhat node (terminal where hardhat localhost node is running)

And while using our hardhat node, in order to choose a winner because we obviously don't have chainlink keepers working in hardhat localhost:
i'm doing "code ." to hardhat-smartcontract-lottery-fcc, and in there running the script: yarn hardhat run scripts/mockOffchain.js --network localhost
to choose the winner