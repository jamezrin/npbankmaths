import styles from '../styles/BrandedInput.module.css';

type BrandedInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function BrandedInput(props: BrandedInputProps) {
  return <input className={styles.brandedInput__input} {...props} />;
}

export default BrandedInputProps;
