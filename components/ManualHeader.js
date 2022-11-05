//we can do header.js or header.jsx, they do literally the exact same thing. .jsx means its a react file

// Patrick first showed us this hard way to do all of this functionality for the connect button (This ManualHeader.js file)
// Then he showed us the easier/cheaty way (Header.js file)
// It's good to first learn how everything works and can be done, then learn the easier ways to do it

import { useMoralis } from "react-moralis"
import { useEffect } from "react"

//we could build our whole connect button in our index.js and then stick it in the html, but instead we're gonna make it a "component"
//Components are independent and reusable bits of code. They serve the same purpose as JavaScript functions, but work in isolation and return HTML.
//This helps modularize and re-use this header component across our project.
//We're only gonna be using our header in one area tho, however its still nice to modularize the project regardless
//this will be what's called a "functional base component":

export default function ManualHeader() {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis()
    //usemoralis() is what's known as a "hook". It's a way to keep track of state in our application.
    //(super nice) changing the state with a hook will make our frontend re-render, with a normal boolian it wouldnt
    //so hooks are a way for us to actually work with state specially and automatically re-render when something changes (one of the best things hooks can do)

    //isWeb3Enabled. Keeps track of whether of not our wallet is connected
    //Account. We'll actually check if there is an account instead, because maybe web3 is connected but they didnt connect it to an account. how?

    //UseEffect hook:
    //Core react hook, one of the most popular along with "UseState" hooks.
    //we'll use this hook so that when we render (refresh) it automatically checks to see if we're connected, so the connect button doesnt turn
    //to connect again even tho we're already connected, because it doesn't know if we're connected or not.
    // useEffect(() => {}, []) we have a function called useEffect() that takes 2 parameters.
    // A function as its 1st parameter and 2nd it optionally takes a dependency array [].
    // What this useEffect() does is its gonna keep checking the values in this dependency array, and if anything there changes, its gonna call the
    // function and then re-render the front end.
    // This useEffect is running all the time, listening.
    // Cheatsheet:
    // 1) if we dont give it a dependency array: it will run anytime something re-renders
    //    (careful, you can get circular renders. if when u render it changes a variable and u have other useEffect that when that variable changes it
    //    renders, then you get a loop that it wont stop rendering).
    // 2) if we give it a blank dependency array []: it will run once on load (think it means on refresh), not everytime it renders.
    // 3) if there is stuff inside the array: its gonna run everytime something in this array changes, like a variable

    //so we want to eliminate having to press "connect" after refreshing, and for it to turn to "connected" automatically because we are already connected.
    useEffect(() => {
        if (isWeb3Enabled) return //if we're already connected to web3 we dont need to do anything. but if not:
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                //we do this so that we only call enableWeb3() if its already connected, so that we dont enter/refresh the page
                //while not connected and it insta opens the wallet window because we're calling enableWeb3().
                enableWeb3()
                //with this functionality now, when we refresh it will automatically run enableWeb3() for us which will make the button say "connected" if
                //we are connected. Before we had to click the button every time we refreshed for it to say "connected" even tho we were already connected, and
                //if we didnt use this localStorage, it would pop the wallet window automatically if you just joined the platform and you hadn't connected yet.
            }
        }
    }, [isWeb3Enabled])

    //useEffect to check to see if we have disconnected
    //It will run if any account has changed. onAccountChanged also takes on a function as an input parameter
    //this will make it so that when we change our account to null(disconnect), it removes the localStorage key "connected", which wont make the above useEffect trigger.
    //what was happening was that after we disconnected, the localStorage key was still there so it would insta pop up when we refreshed the website.
    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3() //which will set isWeb3Enabled to false. doesnt it change automatically?
                console.log("Null account found")
            }
        })
    }, [])

    //if we want to stick javascript inside the html we add the {} brackets, we can do this with react, we couldnt with normal html
    //{account ? () : ()}
    //we can either say "connected to {account}" or "connected to {account.slice(0,6)}...{account.slice(account.length - 4)}" to show "04eu28...48e0" with the ...
    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        //in some versions of nextjs it has a hard time knowing about this window variable, so we can just do this typeof window !== "undefined"
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem("connected", "injected")
                        }
                    }}
                    disabled={isWeb3EnableLoading} //button is disabled when metamask has already popped up
                >
                    Connect
                </button>
            )}
        </div>
    )
}

//So we added enableWeb3(), but then when we refreshed, the button didnt say connected and waited for us to press it again to know that its already connected.
//So we added an useEffect() so that when isWeb3Enabled called, it calls enableWeb3(), and since isWeb3Enabled is called when we restart (why?), it will call
//enableWeb3() when it restarts and automatically change the button to "connected".
//But that made it so that every user that joined the platform, connected or not, would automatically have its wallet window popped up because we programed it to
//call enableWeb3() at refreshes/load.
//So we added a setItem to localStorage when we connect, and made an if statement so that the useEffect() only calls enableWeb3() at the start if the users has that
//setItem in the localStorage i.e. is already connected (so that non connected people dont get it poped up when they enter).
//But that had another bug, that was if you disconnected, the item would stay in your localStorage, and if you refreshed after it would instantly pop the wallet window
//for you because you have that item in localStorage
//So we made a 2nd useEffect that removes the item from localStorage if we disconnect from the wallet.
//And that resolved all the issues, our button now stays connected if we refresh, dont pop if someone not connected enters the platform, and if we disconnect and
//refresh it wont pop.
