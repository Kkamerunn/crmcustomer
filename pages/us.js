import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '../components/Layout'

export default function Home() {
  return (
    <div className={styles.container}>
      <Layout>
        <h2>From us</h2>
      </Layout>
    </div>
  )
}