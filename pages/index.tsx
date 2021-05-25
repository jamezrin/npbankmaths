import Head from 'next/head';

import CalculatorApp from '../components/CalculatorApp';

function CalculatorPage() {
  return (
    <>
      <Head>
        <title>NoPixel Bank Heist Calculator</title>
        <link rel="icon" href="/dollar.png" />
      </Head>

      <CalculatorApp />
    </>
  );
}

export default function Root() {
  return <CalculatorPage />;
}
