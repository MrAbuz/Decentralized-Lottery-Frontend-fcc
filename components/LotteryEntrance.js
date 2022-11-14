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

    const dispatch = useNotification() //this dispatch is that little popup notification. Had to import and add it as a wrapped around component in the app.js file

    //runContractFunction, which we renamed to enterRaffle, its to include in the html to call this function
    const { runContractFunction: enterRaffle } = useWeb3Contract({
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
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI() //super important.when the transaction goes through,the number of players is not updated cuz it doesnt render.so after .wait(1) we add this updateUI(). So nice!
    }

    const handleNewNotification = function () {
        //nice that we can add parameters to variables that were assigned by functions like dispatch, or this one
        //we can find all this dif parameters of web3uikit to setup our notifications (that we entering as parameters of dispatch) in the link in the end of this code(*)
        //dispatch launches one of this notifications
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    //different syntax to change from wei to ether, we used used parseEther in the backend. is it like this when doing it in the frontend?
    //{raffleAddress ? : } -> we can only call the function button and see the entrance fee, as long as there is a raffle address, which makes sense.
    //we gave the "onSuccess" parameter to the enterRaffle(). This functions come with "onComplete", "onError" etc, super useful!
    //we should always add onError to call our runContractFunction calls, because if any of those calls break we wont know if we dont add it!
    return (
        <div>
            Hi from Lottery entrance!
            {raffleAddress ? (
                <div>
                    <button
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                    >
                        Enter Raffle
                    </button>
                    Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH Players:
                    {numPlayers}
                    Recent Winner: {recentWinner}
                </div>
            ) : (
                <div>No Raffle Address Detected</div>
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
// in the left menu -> 5 POPUP -> notification -> hook Demo; then "docs" above; then "show code" in the right
