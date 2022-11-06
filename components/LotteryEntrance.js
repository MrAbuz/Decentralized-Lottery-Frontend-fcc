//we'll use Moralis to call this functions
//because Moralis has hooks for pretty much anything we wanna do, and one of this hooks is "useWeb3Contract()" that allows us to call functions and have a bunch
//of functionality related to calling that function: ex: gives the "data" returned from calling it, "error" returned, "isFetching", "isLoading", if we want to have
//our UI do something while its fetching/loading the transaction, "runContractFunction" to call the function.

import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
//we can just specify the folder instead of each individual files cuz I created "index.js" to export both, which basically represents the whole folder

export default function LotteryEntrance() {
    //runContractFunction, which we renamed to enterRaffle, its to include in the html to call this function
    //const {runContractFunction: enterRaffle} = useWeb3Contract({
    //    abi: //, //abi doesnt change no matter the network we're on
    //    contractAddress: //,
    //    functionName: //,
    //    params: {},
    //    msgValue: //
    //})

    return <div> Hi from Lottery entrance!</div>
}

//we're gonna make our aplication network agnostic, so that we can test locally and also try it on a testnet.
//we're gonna make it so that the frontend works exactly the same, independent of what network we're on

//patrick uses this script to make his life easier, an update frontend deploy script
//it makes it so that if we want to make some change in our backend code, that change is instantly reflected on the frontend
//so, after that contract (that was changed) gets deployed, we run a script that creates the constants folder for us on the frontend file
