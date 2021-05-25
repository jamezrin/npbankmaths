import cx from 'clsx';
import React from 'react';
import { FaDollarSign } from 'react-icons/fa';

import { RewardPriceType, useCalculatorStore } from './CalculatorApp';
import CalculatorSection from './CalculatorSection';

type PriceFieldProps = {
  label: string;
  field: RewardPriceType;
};

const PriceField = ({ label, field }: PriceFieldProps) => {
  const [state, dispatch] = useCalculatorStore();
  const wrapperId = `rewardPrices_${field}_fieldWrapper`;
  const inputId = `rewardPrices_${field}_fieldInput`;
  return (
    <div className={cx('grid mx-2 my-0.5 grid-cols-2')} id={wrapperId}>
      <label
        className={cx('text-white text-lg flex items-center')}
        htmlFor={inputId}>
        {label}
      </label>
      <div className={cx('relative')}>
        <input
          id={inputId}
          className={cx(
            'w-full',
            'text-white',
            'text-xl',
            'px-2',
            'py-1',
            'pr-6',
            'bg-brand-primary',
            'focus:outline-none',
            'number-appearance-none',
          )}
          min={0}
          type="number"
          value={state.rewardPrices[field]}
          onChange={(e) => {
            dispatch({
              type: 'CHANGED_NUMBER_FIELD',
              value: parseInt(e.target.value) || 0,
              section: 'rewardPrices',
              field: field,
            });
          }}
        />
        <div
          className={cx(
            'absolute',
            'right-1',
            'top-0',
            'bottom-0',
            'text-white',
            'text-lg',
            'flex',
            'items-center',
          )}>
          <FaDollarSign />
        </div>
      </div>
    </div>
  );
};

function CalculatorPrices() {
  return (
    <CalculatorSection title="Item Prices">
      <PriceField label="Regular Bag" field="regularBags" />
      <PriceField label="Inked Bag" field="inkedBags" />
      <PriceField label="Gold Bar" field="goldBars" />
    </CalculatorSection>
  );
}

export default CalculatorPrices;
