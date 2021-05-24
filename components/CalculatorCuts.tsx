import cx from 'clsx';
import React, { useMemo } from 'react';
import { FaDollarSign, FaTimesCircle } from 'react-icons/fa';

import {
  calculateGrossPayout,
  HeistCrewType,
  PayoutRewardType,
  useCalculatorStore,
} from './CalculatorApp';
import CalculatorSection from './CalculatorSection';

type PayoutFieldProps = {
  label: string;
  field: PayoutRewardType;
};

const PayoutField = ({ label, field }: PayoutFieldProps) => {
  const [state, dispatch] = useCalculatorStore();
  const wrapperId = `payoutRewards_${field}_fieldWrapper`;
  const inputId = `payoutRewards_${field}_fieldInput`;
  return (
    <div className={cx('grid mx-2 my-0.5 grid-cols-2')} id={wrapperId}>
      <label
        className={cx('text-white text-lg flex items-center')}
        htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className={cx(
          'focus:outline-none',
          'w-full',
          'text-white',
          'text-xl',
          'px-2',
          'py-1',
          'bg-brand-primary',
          'number-appearance-none',
        )}
        min={0}
        type="number"
        value={state.payoutRewards[field]}
        onChange={(e) => {
          dispatch({
            type: 'CHANGED_NUMBER_FIELD',
            value: parseInt(e.target.value, 10) || 0,
            section: 'payoutRewards',
            field: field,
          });
        }}
      />
    </div>
  );
};

export type ComputedCrewMember = HeistCrewType & {
  payoutCut: number;
  payoutCutDistribution?: any;
};

const CrewCutsTable = () => {
  const [state, dispatch] = useCalculatorStore();

  const data = React.useMemo<Array<ComputedCrewMember>>(() => {
    const sumOfExpenses = state.heistCrewMembers.reduce(
      (acc, cur) => acc + (cur.expenses || 0),
      0,
    );
    const heistCrewMemberCount = state.heistCrewMembers.length;
    const grossPayout = calculateGrossPayout(state);
    const netPayout = grossPayout - sumOfExpenses;
    const crewMemberCut = netPayout / heistCrewMemberCount;

    return state.heistCrewMembers.map((crewMember) => {
      const payoutCut = Math.floor(crewMemberCut + (crewMember.expenses || 0));
      return {
        ...crewMember,
        payoutCut,
      };
    });
  }, [state]);

  return (
    <div className={cx('overflow-auto lg:max-h-96')}>
      <table className={cx('table-fixed w-full ')}>
        <thead>
          <tr className={cx('bg-brand-primary text-lg text-white')}>
            <th className="py-1 w-2/12">Member</th>
            <th className="py-1 w-2/12">Expenses</th>
            <th className="py-1 w-2/12">Personal Cut</th>
            <th className="py-1 w-auto">&nbsp;</th>
            <th className="py-1 w-2/12 lg:1/12">Actions</th>
          </tr>
        </thead>
        <tbody className={cx('bg-gray-100 text-lg')}>
          {data.map((crewMember) => (
            <tr key={crewMember.id}>
              <td>
                <input
                  className={cx(
                    'w-full',
                    'text-xl',
                    'px-2',
                    'py-1',
                    'bg-transparent',
                    'focus:bg-white',
                    'focus:outline-none',
                  )}
                  value={crewMember.alias}
                  onChange={(e) => {
                    dispatch({
                      type: 'CHANGED_CREW_MEMBER_ALIAS',
                      crewMemberId: crewMember.id,
                      newAlias: e.target.value,
                    });
                  }}
                />
              </td>
              <td>
                <input
                  className={cx(
                    'w-full',
                    'text-xl',
                    'px-2',
                    'py-1',
                    'bg-transparent',
                    'focus:bg-white',
                    'focus:outline-none',
                    'number-appearance-none',
                  )}
                  min={0}
                  type="number"
                  value={crewMember.expenses}
                  onChange={(e) => {
                    dispatch({
                      type: 'CHANGED_CREW_MEMBER_EXPENSES',
                      crewMemberId: crewMember.id,
                      newExpenses: parseInt(e.target.value, 10) || 0,
                    });
                  }}
                />
              </td>
              <td>
                <div
                  className={cx(
                    'text-green-600',
                    'flex',
                    'w-100',
                    'items-center',
                    'justify-center',
                    'text-xl',
                    'font-bold',
                  )}>
                  {crewMember.payoutCut}
                  <FaDollarSign />
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div
                  className={cx(
                    'flex',
                    'w-full',
                    'items-center',
                    'justify-center',
                  )}>
                  <button
                    className={cx(
                      'border-none',
                      'rounded-full',
                      'bg-transparent',
                      'text-2xl',
                      'text-brand-primary',
                      'hover:text-gray-600',
                    )}
                    onClick={(e) => {
                      dispatch({
                        type: 'REMOVED_CREW_MEMBER',
                        crewMemberId: crewMember.id,
                      });
                    }}>
                    <FaTimesCircle />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CrewReadySection = () => {
  const [state, dispatch] = useCalculatorStore();
  return (
    <div className={cx('mt-6')}>
      <CrewCutsTable />
      <button
        className={cx(
          'mt-3',
          'p-2',
          'text-white',
          'bg-brand-primary',
          'hover:bg-gray-600',
        )}
        onClick={(e) => {
          dispatch({
            type: 'ADDED_CREW_MEMBER',
          });
        }}>
        Add crew member
      </button>
    </div>
  );
};

const AddCrewMemberCta = () => {
  const [state, dispatch] = useCalculatorStore();
  return (
    <div
      className={cx('flex w-full mt-8 md:mt-12 lg:mt-16 mb-8 justify-center')}>
      <div className={cx('bg-gray-100 p-4 max-w-sm flex flex-col shadow-md')}>
        <p>
          There is no heist without a crew! Start by adding crew members and
          changing their expenses and their personal cut will update
          accordingly.
        </p>
        <button
          className={cx(
            'mt-3',
            'p-2',
            'text-white',
            'bg-brand-primary',
            'hover:bg-gray-600',
          )}
          onClick={(e) => {
            dispatch({
              type: 'ADDED_CREW_MEMBER',
            });
          }}>
          Add first crew member
        </button>
      </div>
    </div>
  );
};

function CalculatorCuts() {
  const [state, dispatch] = useCalculatorStore();
  return (
    <CalculatorSection title="Payout Calculator">
      <div className={cx('flex flex-col lg:flex-row')}>
        <div className={cx('grid grid-cols-2 lg:grid-cols-4 gap-4')}>
          <PayoutField label="Cash" field="cash" />
          <PayoutField label="Regular Bags" field="regularBags" />
          <PayoutField label="Inked Bags" field="inkedBags" />
          <PayoutField label="Gold Bars" field="goldBars" />
        </div>
        <div
          className={cx(
            'mt-6',
            'lg:mt-0',
            'lg:ml-8',
            'flex',
            'items-center',
            'justify-center',
            'text-2xl',
            'font-bold',
            'text-green-600',
          )}>
          {calculateGrossPayout(state)}
          <FaDollarSign />
        </div>
      </div>
      {state.heistCrewMembers.length > 0 ? (
        <CrewReadySection />
      ) : (
        <AddCrewMemberCta />
      )}
    </CalculatorSection>
  );
}

export default CalculatorCuts;
