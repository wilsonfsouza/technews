import Head from 'next/head';
import styles from './home.module.scss';

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | tech.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>✨ Hi,</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the articles <br />
            <span>for only $8.99 a month</span>
          </p>
        </section>
        <img src="/images/avatar.svg" alt="Woman coding" />
      </main>
    </>
  )
}
