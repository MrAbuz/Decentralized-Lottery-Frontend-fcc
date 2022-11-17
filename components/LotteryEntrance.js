//we'll use Moralis to call this functions
//because Moralis has hooks for pretty much anything we wanna do, and one of this hooks is "useWeb3Contract()" that allows us to call functions and has a bunch
//of functionality related to calling that function: ex: gives the "data" returned from calling it, "error" returned, "isFetching", "isLoading" (if we want to have
//our UI do something while its fetching/loading the transaction), "runContractFunction" to call the function.

import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"
import { abi, contractAddresses } from "../constants"
//we can just specify the folder instead of each individual files cuz I created a "index.js" to export both, which basically represents the whole folder.
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    //receives the chainid that we're connected to
    //if we console.log(chainId) we could see that it provides the hex version of chainId.So we called it "chainIdHex" and we did parseInt() to get the int version,nice
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    //[0] means the first address in that chainId I think

    //we created a useState hook to re-render the frontend when we obtain the value and immediately update it in the frontend
    //it renders when we set its value with setEntranceFee
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const entranceFeeInEth = ethers.utils.formatUnits(entranceFee, "ether")

    const dispatch = useNotification() //this dispatch is that little popup notification. Had to import and add it as a wrapped around component in the app.js file

    //runContractFunction, which we renamed to enterRaffle, its to include in the html to call this function
    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi, //abi doesnt change no matter the network we're on
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {}, //there are no params
        msgValue: entranceFee,
    })

    //to make the call in the useEffect() to know the entrance fee
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {}, //there are no params
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {}, //there are no params
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {}, //there are no params
    })

    async function updateUI() {
        //this await getEntranceFee() comes in hex, good thing is to console.log() to find out
        const entranceFeeFromCall = (
            await getEntranceFee({ onError: (error) => console.log(error) })
        ).toString()
        const numPlayersFromCall = (
            await getNumberOfPlayers({ onError: (error) => console.log(error) })
        ).toString()
        const recentWinnerFromCall = await getRecentWinner({
            onError: (error) => console.log(error),
        })
        //its really good to always add an onError to all our runContractFunction calls, because if any of those calls break we wont know if we dont add it!!
        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            //we needed to create this function because we need to use the 'await' and useEffect isnt async, so we need to create an async function to do the await and call it
            updateUI()
        }
        //the first time that this useEffect runs, isWeb3Enabled is false, so instead of [] we wanna use [isWeb3Enabled] so that when it turns to true we run this section
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        //takes the transaction as an input parameter
        //the onSuccess parameter isnt checking that the transaction has a block confirmation, only that it was sent. Thats why we add tx.wait(1)
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI() //super important.when the transaction goes through,the number of players is not updated cuz it doesnt render.so after .wait(1) we add this updateUI(). So nice!
    }

    const handleNewNotification = function () {
        //nice that we can add parameters to variables that were assigned by functions like dispatch, or this one
        //(*)we can find all this dif parameters of web3uikit to setup our notifications (that we entering as parameters of dispatch) in the link in the end of this code
        //dispatch launches one of this notifications
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Notification",
            position: "topR",
            icon: "bell",
        })
    }

    //different syntax to change from wei to ether, we used used parseEther in the backend. is it like this when doing it in the frontend?
    //{raffleAddress ? : } -> we can only call the function button and see the entrance fee, as long as there is a raffle address, which makes sense.
    //we gave the "onSuccess" parameter to the enterRaffle(). This functions come with "onComplete", "onError" etc, super useful!
    //we should always add onError to call our runContractFunction calls, because if any of those calls break we wont know if we dont add it!
    //And the onSuccess isnt checking that the transaction has a block confirmation, only that it was sent. Thats why in "handleSuccess" we add tx.wait(1)
    // {isLoading || isFetching ? <div></div> : <div><div>} -> if its loading or fetching we add the spinny thing, if not just the text.
    // Nice that you can add logic inside <button></button> where it was suposed to be just the name of the button, previously it was just "Enter Raffle" text
    return (
        <div className="p-5">
            {raffleAddress ? (
                <div className="">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH </div>
                    <div> Players: {numPlayers}</div>
                    <div>Recent Winner: {recentWinner}</div>
                    <div>Prize: {numPlayers * entranceFeeInEth} ETH</div>
                </div>
            ) : (
                <div>Connect your wallet to the Goerli Testnet </div>
            )}
        </div>
    )
}

//we're gonna make our aplication network agnostic, so that we can test locally and also try it on a testnet.
//we're gonna make it so that the frontend works exactly the same, independent of what network we're on

//patrick uses an "update frontend deploy script" to make his life easier.
//this script that we created in the backend code makes it so that if we want to make some change in our backend code, that change is instantly reflected in the frontend
//so, after the contract (that was changed) gets deployed, it automatically runs the script that creates the constants folder for us here in the frontend

// (*) https://web3ui.github.io/web3uikit/?path=/story/1-web3-parse-blockie--custom-seed
// explore the website to find nice thing by visualizing them, and then I have the code aswell
// in the left menu -> 5 POPUP -> notification -> hook Demo; then "docs" above; then "show code" in the right

//                  CSS/Tailwind explanation from trial and error:
//p-5; adds padding to the top and left side (or maybe every side, but can only notice top and left because its on the top left)
//bg-blue-500; changes the background (bg) to the colour blue-500
//hover:bg-blue-700; when we hover over it, it turns into colour blue-700 (nice)
//text-white; text is white
//font-bold; but I used font-semibold because it looks better
//py-2; some y padding (padding inside the button, made the button larger top and bottom)
//px-4; some x padding (pading inside the button, made the button larger right and left)
//rounded; made the buttom be rounded, rounded corners
//ml-auto (margin left auto) in the connect button it pushed to the max right side as possible (even in different screen sizes I think). here it didnt change anything
//animate-spin spinner-border h-8 w-8 border-b-2 rounded-full; it adds the spinny thing, mostly works together but I can try one by one to see the differences

//Patrick challenge:
//Calling is to listen to event of the winner and instantly render the winning address:
//Patrick gave us a challenge in the end to find a way to listen to the event we emit when we find a winner, and when we listen to it, update the address of the
//winner in the UI. Because atm it updates the address of the winner if we refresh, but it doesnt render in the moment that it finds a winner.
//Based on my thoughts until now, I think it would be something like this:
//
//    useEffect(() => {
//        if (isWeb3Enabled) {
//            updateUI() //or only "setRecentWinner(recentWinnerFromCall)" + "const recentWinnerFromCall = await getRecentWinner(onError etc)"
//        }
//    }, Raffle.WinnerPicked()) //this is obviously not the way we listen to the event. Had to have the Raffle contract object defined aswell.
//
//We can also listen to the event of RaffleEnter and update the frontend when some user enters the lottery.
//Need to learn how to listen to events
//If Patrick doesn't explain in the end, i'll try to figure out and add this event to render the address!
