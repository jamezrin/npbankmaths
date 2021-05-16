import styles from '../styles/Inputs.module.css';

type BrandedLabelledNumberInputProps = React.PropsWithChildren<
  {
    labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  } & React.InputHTMLAttributes<HTMLInputElement>
>;

function BrandedLabelledNumberInput({ labelProps, children, ...inputProps }: BrandedLabelledNumberInputProps) {
  return (
    <div className={styles.numberInput__wrapper}>
      <label {...labelProps} className={styles.numberInput__label} htmlFor={inputProps.id}>
        {children}
      </label>
      <input {...inputProps} className={styles.numberInput__input} type="number" id={inputProps.id} />
    </div>
  );
}

export default BrandedLabelledNumberInput;
