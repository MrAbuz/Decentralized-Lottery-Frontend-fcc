//we can do header.js or header.jsx, they do literally the exact same thing. .jsx means its a react file

import { useMoralis } from "react-moralis"

//we could build our whole connect button in our index.js and then stick it in the html, but instead we're gonna make it a "component"
//Components are independent and reusable bits of code. They serve the same purpose as JavaScript functions, but work in isolation and return HTML.
//This helps modularize and re-use this header component across our project.
//We're only gonna be using our header in one area tho, however its still nice to modularize the project regardless
//this will be what's called a "functional base component":

export default function ManualHeader() {
    const { enableWeb3 } = useMoralis() //usemoralis() is what's known as a "hook". It's a way to keep track of state in our application.
    //(super nice) changing the state with a hook will make our frontend re-render, with a normal boolian it wouldnt
    //so hooks are a way for us to actually work with state specially and automatically re-render when something changes (one of the best things hooks can do)

    return <div>Hi from Header! You are 5head!</div>
}

// Patrick is going to show us the hard way to do this first (ManualHeader)
// Then the easy and much simpler way
