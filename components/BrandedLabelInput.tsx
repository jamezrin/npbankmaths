import styles from '../styles/BrandedInput.module.css';
import { BrandedInput } from './BrandedInput';

type BrandedLabelInputProps = React.PropsWithChildren<
  {
    labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  } & React.InputHTMLAttributes<HTMLInputElement>
>;

export function BrandedLabelInput({
  labelProps,
  children,
  ...inputProps
}: BrandedLabelInputProps) {
  return (
    <div className={styles.numberInput__wrapper}>
      <label
        {...labelProps}
        className={styles.brandedInput__label}
        htmlFor={inputProps.id}>
        {children}
      </label>
      <BrandedInput {...inputProps} />
    </div>
  );
}

export default BrandedLabelInput;
