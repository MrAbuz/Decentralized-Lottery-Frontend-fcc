import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit" //we need to wrap our component with this NotificationProvider to add notifications from web3uikit

//this initializeOnMount={false}, is us rejecting the optionality of Moralis to hook into a server to add some more features to our website.
//This is the way I think we connect to our centralized database to make api calls, which would make this app a little centralized.
function MyApp({ Component, pageProps }) {
    return (
        <MoralisProvider initializeOnMount={false}>
            <NotificationProvider>
                <Component {...pageProps} />
            </NotificationProvider>
        </MoralisProvider>
    )
}

export default MyApp

//Having MoralisProvider (or others) wrapped around our "Component" means that we don't have to pass parameters between our components or pages.
//For example our "LotteryEntrance" will know which chainId we're on because our "Header" is gonna pass it to "MoralisProvider" which is gonna pass to the "LotteryEntrance"
