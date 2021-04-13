import { GetStaticProps } from 'next';
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
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
            <span>for only {product.amount} a month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="Woman coding" />
      </main>
    </>
  )
}

const ONE_DAY = 60 * 60 * 24;

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1Id446EWv77XdtNrACNXwAjI', {
    expand: ['product']
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format((price.unit_amount / 100)),
  }

  return {
    props: {
      product
    },
    revalidate: ONE_DAY,
  }
}