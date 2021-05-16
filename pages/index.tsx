import Head from 'next/head';
import styles from '../styles/General.module.css';

import Calculator from '../components/Calculator';
import SocialLinks from '../components/SocialLinks';

const Background = () => (
  <div className={styles.backgroundWrapper}>
    <div className={styles.backgroundChild} />
  </div>
);

function CalculatorPage() {
  return (
    <>
      <Head>
        <title>NoPixel Bank Heist Calculator</title>
        <link rel="icon" href="/dollar.png" />
      </Head>

      <div className={styles.container}>
        <Calculator />
        <Background />
        <SocialLinks />
      </div>
    </>
  );
}

export default function Root() {
  return <CalculatorPage />;
}
