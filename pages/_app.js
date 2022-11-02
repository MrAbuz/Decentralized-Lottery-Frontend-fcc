import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"

//this initializeOnMount={false}, is us rejecting the optionality of Moralis to hook into a server to add some more features to our website.
//we dont want to hook into a server for this app, we dont need aditional functionality.
//This is the way I think we connect to our centralized database to make api calls, which would make our app a little centralized.
function MyApp({ Component, pageProps }) {
    return (
        <MoralisProvider initializeOnMount={false}>
            <Component {...pageProps} />
        </MoralisProvider>
    )
}

export default MyApp
