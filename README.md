Things to add:
Add a way to add more than 1 entry at a time. With an input field with how many entries
Add a display like a list with the addresses that already joined in the lottery and with how much entries each one (by listening to the event of EnterRaffle())
Add a listener for the event that is emited when someone wins the lottery, so that it updates an winner address state hook and automatically renders the frontend when some address wins. Atm we need to manually refresh (proposed by Patrick)
Add notifications to failed transactions (i think its ilke: instead of onSuccess that used for the positive notification, its something like onFail, need to search exactly which is the syntax, and then the function like handleSuccess() is pretty much the same. Really easy)
Add a table with previous winners and how much they've won. Maybe an all time all prize amounts combined ever. Also the address with the biggest prize and how much.

For me: 
Remember that i'm opening 3 terminals in total for dev:
-One normal in nextjs-smartcontract-lottery-fcc
-One with "yarn dev" (terminal to run it localhost in the browser)
-Other one where I: cd ..; cd hardhat-smartcontract-lottery-fcc; yarn hardhat node (terminal where hardhat localhost node is running)

And while using our hardhat node, in order to choose a winner because we obviously don't have chainlink keepers working in hardhat localhost:
i'm doing "code ." to hardhat-smartcontract-lottery-fcc, and in there running the script: yarn hardhat run scripts/mockOffchain.js --network localhost
to choose the winner

Give life to this with style, showing its an improved version of Euromillion
Euromillion but provably and verifiably random lottery