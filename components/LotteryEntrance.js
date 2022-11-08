//we'll use Moralis to call this functions
//because Moralis has hooks for pretty much anything we wanna do, and one of this hooks is "useWeb3Contract()" that allows us to call functions and has a bunch
//of functionality related to calling that function: ex: gives the "data" returned from calling it, "error" returned, "isFetching", "isLoading" (if we want to have
//our UI do something while its fetching/loading the transaction), "runContractFunction" to call the function.

import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
//we can just specify the folder instead of each individual files cuz I created a "index.js" to export both, which basically represents the whole folder.
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    //receives the chainid that we're connected to
    //if we console.log(chainId) we could see that it provides the hex version of chainId. So we called it "chainIdHex" and we did parseInt() to get the int version, nice
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    //[0] means the first address in that chainId I think

    //we created a useState hook to re-render the frontend when we obtain the value and immediately update it in the frontend
    //it renders when we set its value with setEntranceFee
    const [entranceFee, setEntranceFee] = useState("0")

    //runContractFunction, which we renamed to enterRaffle, its to include in the html to call this function
    //const {runContractFunction: enterRaffle} = useWeb3Contract({
    //    abi: abi, //abi doesnt change no matter the network we're on
    //    contractAddress: raffleAddress,
    //    functionName: "enterRaffle",
    //    params: {}, //there are no params
    //    msgValue: //
    //})

    //to make the call in the useEffect() to know the entrance fee
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {}, //there are no params
    })

    useEffect(() => {
        if (isWeb3Enabled) {
            //we need to create this function because we need to use the 'await' and useEffect isnt async, so we need to create an async function to do the await and call it
            async function updateUI() {
                //this await getEntranceFee() comes in hex, good thing is to console.log() to find out
                const entranceFeeFromCall = (await getEntranceFee()).toString()
                setEntranceFee(ethers.utils.formatUnits(entranceFeeFromCall, "ether"))
                //different syntax than what we used with parseEther to change from wei to ether. is it like this when doing it in the frontend?
            }
            updateUI()
        }
        //the first time that this useEffect runs, isWeb3Enabled is false, so instead of [] we wanna use [isWeb3Enabled] so that when it turns to true we run this section
    }, [isWeb3Enabled])

    return (
        <div>
            Hi from Lottery entrance! <div>Entrance Fee: {entranceFee} ETH</div>
        </div>
    )
}

//we're gonna make our aplication network agnostic, so that we can test locally and also try it on a testnet.
//we're gonna make it so that the frontend works exactly the same, independent of what network we're on

//patrick uses this an "update frontend deploy script" to make his life easier.
//this script that we created in the backend code makes it so that if we want to make some change in our backend code, that change is instantly reflected in the frontend
//so, after the contract (that was changed) gets deployed, it automatically runs the script that creates the constants folder for us here in the frontend file
