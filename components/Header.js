// Patrick first showed us the hard way to do all of the functionality for the "connect button" (ManualHeader.js file)
// Then he showed us this easier/cheaty way (Header.js file)
// It's good to first learn how everything works and can be done, then learn the easier ways to do it
import { ConnectButton } from "web3uikit"

//This ConnectButton does everything our ManualHeader button does!! Its ridiculous

//"moralisAuth={false}" again just making clear we're not trying to connect to a server
export default function Header() {
    return (
        <div className="p-5 border-b-2 flex flex-row">
            <h1 className="py-4 px-4 font-semibold text-3xl">Decentralized Lottery</h1>
            <div className="ml-auto py-2 px-4">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}

//                  CSS/Tailwind explanation from trial and error:
//p-5 adds 5 pixels in the upper part and lower part of the header (or maybe to every side)
//flex makes the button be in the same line as the title "Decentralized Lottery"
//flex-row didnt change anything but must be related to the flex
//<h1></h1> makes "Decentralized Lottery" the "header 1", in order to add a className to it and format it
//py-4 added some padding to the top(space between "Decentralized Lottery" and the top).But only in "Decentralized Lottery",the button kept the overall padding of the div
//px-4 padding in the left side (x axis)
//font-bold changes the text to bold (I chose font-semibold because I liked it)
//text-3xl increases the text
//ml-auto -> automatic left margin (means that it will be max spaced to the right doesnt matter the screen size? didnt understand 100%, but pushed max to the right)(looks super nice to use)
//py-2 some padding relative to the top
//px-4 added some padding to the right. interesting that now since the button is in the right, the x padding adds to the right. In the tittle it added padding in the left
