import cx from 'clsx';

const Background = () => (
  <div className={cx('fixed overflow-hidden inset-0 -z-10')}>
    <div
      className={cx(
        'bg-center',
        'bg-no-repeat',
        'bg-cover',
        'filter',
        'blur-sm',
        'transform',
        'scale-105',
        'h-screen',
        'w-screen',
        'custom-bg-bills',
      )}
    />
  </div>
);

export default Background;
