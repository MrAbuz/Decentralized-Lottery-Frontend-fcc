//imports work with our frontend, require does not
//nodejs != javascript; back end JS is a little different from front end JS

import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"

import ManualHeader from "../components/Header"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Mr Abuz Lottery</title>
                <meta name="description" content="Our Smart Contract Lottery" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ManualHeader />
            {/* header / connect button / nav bar */}
            Hello!
        </div>
    )
}
