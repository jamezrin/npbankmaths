import Head from 'next/head';
import styles from '../styles/Calculator.module.css';
import { FaGithub, FaTwitter } from 'react-icons/fa';
import React from 'react';

import BrandedLabelledNumberInput from '../components/BrandedLabelledNumberInput';

const Background = () => (
  <div className={styles.backgroundWrapper}>
    <div className={styles.backgroundChild} />
  </div>
);

const TwitterSocial = () => (
  <a
    href="https://twitter.com/jamezrin"
    style={{
      ['--hover-color' as any]: '#00acee',
    }}
  >
    <FaTwitter />
  </a>
);

const GithubSocial = () => (
  <a
    href="https://github.com/jamezrin"
    style={{
      ['--hover-color' as any]: '#afb5bb',
    }}
  >
    <FaGithub />
  </a>
);

const SocialLinks = () => (
  <div className={styles.links}>
    <TwitterSocial />
    <GithubSocial />
  </div>
);

function PartTakeCalculator() {
  return (
    <section className={styles.partTakeCalculator}>
      <h2>Calculator</h2>

      <BrandedLabelledNumberInput id="takeCalculator__bankPayout" placeholder="100000" min={0}>
        Bank Payout
      </BrandedLabelledNumberInput>

      <div className={styles.calculatorTable}>
        
      </div>
    </section>
  );
}

function PayoutValueCalculator() {
  return (
    <section className={styles.payoutValueCalculator}>
      <h2>Payout Value Calculator</h2>
    </section>
  );
}

function PayoutSplitCalculator() {
  return (
    <section className={styles.payoutSplitCalculator}>
      <h2>Payout Split Calculator</h2>
    </section>
  );
}

function CalculatorPage() {
  return (
    <>
      <Head>
        <title>NoPixel Bank Heist Calculator</title>
        <link rel="icon" href="/dollar.png" />
      </Head>

      <div className={styles.container}>
        <div className={styles.calculatorContainer}>
          <aside className={styles.leftSide}>
            <PartTakeCalculator />
          </aside>
          <aside className={styles.rightSide}>
            <PayoutValueCalculator />
            <PayoutSplitCalculator />
          </aside>
        </div>
        <Background />
        <SocialLinks />
      </div>
    </>
  );
}

export default function Root() {
  return <CalculatorPage />;
}
