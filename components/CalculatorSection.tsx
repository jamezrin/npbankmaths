import cx from 'clsx';
import React from 'react';

type Props = {
  title: string;
};

const CalculatorSection = ({
  children,
  title,
}: React.PropsWithChildren<Props>) => (
  <section className={cx('p-2')}>
    <h2
      className={cx(
        'text-white',
        'ml-2',
        'mt-1',
        'pb-2',
        'text-xl',
        'border-b-4',
        'inline-block',
        'mb-4',
      )}>
      {title}
    </h2>
    {children}
  </section>
);

export default CalculatorSection;
