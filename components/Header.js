// Patrick first showed us the hard way to do all of this functionality for the connect button (ManualHeader.js file)
// Then he showed us this easier/cheaty way (Header.js file)
// It's good to first learn how everything works and can be done, then learn the easier ways to do it
import { ConnectButton } from "web3uikit"

//This ConnectButton does everything our ManualHeader button does!!

//"moralisAuth={false}" again just making clear we're not trying to connect to a server
export default function Header() {
    return (
        <div>
            Decentralized Lottery
            <ConnectButton moralisAuth={false} />
        </div>
    )
}
