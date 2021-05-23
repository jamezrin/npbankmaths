import BrandedLabelInput from '../components/BrandedLabelInput';
import styles from '../styles/Calculator.module.css';
import React, { createElement, useContext, useReducer } from 'react';
import { FaCentercode, FaDollarSign, FaUserTimes } from 'react-icons/fa';
import {
  CellPropGetter,
  Column,
  HeaderPropGetter,
  PropGetter,
  useFlexLayout,
  useTable,
} from 'react-table';
import { BrandedInput } from './BrandedInput';

const numberTargetValue = (
  consumer: (value: number) => void,
): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
  return (e) => consumer(parseInt(e.target.value));
};

type HeistCrewType = {
  id: number;
  alias: string;
  expenses: number;
};

type CalculatorState = {
  bankPayout: {
    cash: number;
    regularBagCount: number;
    regularBagValue: number;
    inkedBagCount: number;
    inkedBagValue: number;
    goldBarCount: number;
    goldBarValue: number;
  };
  heistCrewMembers: HeistCrewType[];
};

const makeHeistCrewMember = ({
  id,
  expenses,
}: Omit<HeistCrewType, 'alias'>): HeistCrewType => ({
  id,
  alias: `Part ${id}`,
  expenses,
});

const getHighestCrewMemberId = (heistCrewMembers: HeistCrewType[]) =>
  Math.max(...heistCrewMembers.map(({ id }) => id), 0);

const initialState: CalculatorState = {
  bankPayout: {
    cash: 9000,
    regularBagCount: 225,
    regularBagValue: 250,
    inkedBagCount: 1,
    inkedBagValue: 50000,
    goldBarCount: 5,
    goldBarValue: 5000,
  },
  heistCrewMembers: [
    makeHeistCrewMember({ id: 1, expenses: 12500 }),
    makeHeistCrewMember({ id: 2, expenses: 12500 }),
    makeHeistCrewMember({ id: 3, expenses: 0 }),
  ],
};

const CHANGED_PAYOUT_FIELD = 'CHANGED_PAYOUT_FIELD';
type PayoutField = keyof CalculatorState['bankPayout'];
type PayoutFieldUpdateAction = {
  type: typeof CHANGED_PAYOUT_FIELD;
  field: PayoutField;
  value: number;
};

const CHANGED_CREW_MEMBER_ALIAS = 'CHANGED_CREW_MEMBER_ALIAS';
type CrewMemberAliasChangeAction = {
  type: typeof CHANGED_CREW_MEMBER_ALIAS;
  crewMemberId: number;
  newAlias: string;
};

const CHANGED_CREW_MEMBER_EXPENSES = 'CHANGED_CREW_MEMBER_EXPENSES';
type CrewMemberExpensesChangeAction = {
  type: typeof CHANGED_CREW_MEMBER_EXPENSES;
  crewMemberId: number;
  newExpenses: number;
};

const REMOVED_CREW_MEMBER = 'REMOVED_CREW_MEMBER';
type CrewMemberRemoveAction = {
  type: typeof REMOVED_CREW_MEMBER;
  crewMemberId: number;
};

const ADDED_CREW_MEMBER = 'ADDED_CREW_MEMBER';
type CrewMemberAddAction = {
  type: typeof ADDED_CREW_MEMBER;
};

type CalculatorStateAction =
  | PayoutFieldUpdateAction
  | CrewMemberAliasChangeAction
  | CrewMemberExpensesChangeAction
  | CrewMemberRemoveAction
  | CrewMemberAddAction;

function reducer(
  state: CalculatorState,
  action: CalculatorStateAction,
): CalculatorState {
  switch (action.type) {
    case CHANGED_PAYOUT_FIELD:
      return {
        ...state,
        bankPayout: {
          ...state.bankPayout,
          [action.field]: action.value,
        },
      };

    case CHANGED_CREW_MEMBER_ALIAS:
      return {
        ...state,
        heistCrewMembers: state.heistCrewMembers.map(
          ({ alias, expenses, id }) => ({
            alias: id === action.crewMemberId ? action.newAlias : alias,
            expenses,
            id,
          }),
        ),
      };

    case CHANGED_CREW_MEMBER_EXPENSES:
      return {
        ...state,
        heistCrewMembers: state.heistCrewMembers.map(
          ({ alias, expenses, id }) => ({
            expenses:
              id === action.crewMemberId ? action.newExpenses : expenses,
            alias,
            id,
          }),
        ),
      };

    case REMOVED_CREW_MEMBER:
      return {
        ...state,
        heistCrewMembers: state.heistCrewMembers.filter((crewMember) => {
          return action.crewMemberId !== crewMember.id;
        }),
      };

    case ADDED_CREW_MEMBER:
      return {
        ...state,
        heistCrewMembers: [
          ...state.heistCrewMembers,
          makeHeistCrewMember({
            id: getHighestCrewMemberId(state.heistCrewMembers) + 1,
            expenses: 0,
          }),
        ],
      };

    default:
      return state;
  }
}

type CalculatorContextType = [
  CalculatorState,
  React.Dispatch<CalculatorStateAction>,
];
const initialCalculatorContext = null as unknown as CalculatorContextType;
const CalculatorContext = React.createContext<CalculatorContextType>(
  initialCalculatorContext,
);

function Calculator() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className={styles.calculatorContainer}>
      <section className={styles.calculator}>
        <h2>NoPixel Bank Heist Cut Calculator</h2>
        <CalculatorContext.Provider value={[state, dispatch]}>
          <CalculatorInputs />
          <CalculatorTable />
          <CalculatorActions />
        </CalculatorContext.Provider>
      </section>
    </div>
  );
}

type ComputedCrewMember = HeistCrewType & {
  payoutCut: number;
  payoutCutDistribution: any;
};

const calculateGrossPayout = ({
  bankPayout: {
    cash,
    goldBarCount,
    goldBarValue,
    inkedBagCount,
    inkedBagValue,
    regularBagCount,
    regularBagValue,
  },
}: CalculatorState): number =>
  cash +
  goldBarCount * goldBarValue +
  inkedBagCount * inkedBagValue +
  regularBagCount * regularBagValue;

function CalculatorActions() {
  const [state, dispatch] =
    useContext<CalculatorContextType>(CalculatorContext);

  return (
    <div className={styles.calculatorTable__actionContainer}>
      <button
        className={styles.calculatorTable__actionButton}
        onClick={() => {
          dispatch({ type: 'ADDED_CREW_MEMBER' });
        }}>
        Add crew member
      </button>
    </div>
  );
}

function CalculatorTable() {
  const [state, dispatch] =
    useContext<CalculatorContextType>(CalculatorContext);

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
        payoutCutDistribution: 'WIP',
      };
    });
  }, [state]);

  // https://github.com/tannerlinsley/react-table/tree/master/examples/full-width-resizable-table
  const columns = React.useMemo<Column<ComputedCrewMember>[]>(
    () => [
      {
        Header: 'Alias',
        accessor: 'alias',
        width: 20,
        Cell: ({ cell }) => (
          <BrandedInput
            value={cell.value}
            onChange={(e) => {
              dispatch({
                type: 'CHANGED_CREW_MEMBER_ALIAS',
                crewMemberId: cell.row.original.id,
                newAlias: e.target.value,
              });
            }}
          />
        ),
      },
      {
        Header: 'Expenses',
        accessor: 'expenses',
        width: 20,
        Cell: ({ cell }) => (
          <BrandedInput
            value={cell.value || ''}
            onChange={numberTargetValue((value) => {
              dispatch({
                type: 'CHANGED_CREW_MEMBER_EXPENSES',
                crewMemberId: cell.row.original.id,
                newExpenses: value,
              });
            })}
          />
        ),
      },
      {
        Header: 'Personal Cut',
        accessor: 'payoutCut',
        width: 20,
        Cell: ({ cell }) => (
          <div className={styles.calculatorTable__personalCut}>
            {cell.value}
            <FaDollarSign />
          </div>
        ),
      },
      {
        Header: '',
        accessor: 'payoutCutDistribution',
        width: 200,
        Cell: ({ cell }) => <div></div>,
      },
      {
        Header: 'Actions',
        accessor: 'id',
        width: 15,
        Cell: ({ cell }) => (
          <button
            className={styles.calculatorTable__removeMember}
            onClick={() => {
              dispatch({
                type: 'REMOVED_CREW_MEMBER',
                crewMemberId: cell.value,
              });
            }}>
            <FaUserTimes />
          </button>
        ),
      },
    ],
    [],
  );

  const tableInstance = useTable(
    {
      columns: columns,
      data: data,
    },
    useFlexLayout,
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className={styles.calculatorTable}>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CalculatorInputs() {
  const [state, dispatch] =
    useContext<CalculatorContextType>(CalculatorContext);

  return (
    <div className={styles.payoutBar}>
      <div className={styles.payoutBar__inputs}>
        <BrandedLabelInput
          min={0}
          type="number"
          placeholder="100000"
          id="calculator__cash"
          value={state.bankPayout.cash}
          onChange={numberTargetValue((value) =>
            dispatch({
              type: CHANGED_PAYOUT_FIELD,
              field: 'cash',
              value,
            }),
          )}>
          Cash
        </BrandedLabelInput>

        <div className={styles.payoutBar__combinedInputWrapper}>
          <BrandedLabelInput
            min={0}
            type="number"
            placeholder="100000"
            id="calculator__regularBagCount"
            value={state.bankPayout.regularBagCount}
            onChange={numberTargetValue((value) =>
              dispatch({
                type: CHANGED_PAYOUT_FIELD,
                field: 'regularBagCount',
                value,
              }),
            )}>
            Regular Bags
          </BrandedLabelInput>
          <BrandedLabelInput
            min={0}
            type="number"
            placeholder="100000"
            id="calculator__regularBagValue"
            value={state.bankPayout.regularBagValue}
            onChange={numberTargetValue((value) =>
              dispatch({
                type: CHANGED_PAYOUT_FIELD,
                field: 'regularBagValue',
                value,
              }),
            )}>
            &times;
          </BrandedLabelInput>
        </div>

        <div className={styles.payoutBar__combinedInputWrapper}>
          <BrandedLabelInput
            min={0}
            type="number"
            placeholder="100000"
            id="calculator__inkedBagCount"
            value={state.bankPayout.inkedBagCount}
            onChange={numberTargetValue((value) =>
              dispatch({
                type: CHANGED_PAYOUT_FIELD,
                field: 'inkedBagCount',
                value,
              }),
            )}>
            Inked Bags
          </BrandedLabelInput>
          <BrandedLabelInput
            min={0}
            type="number"
            placeholder="100000"
            id="calculator__inkedBagValue"
            value={state.bankPayout.inkedBagValue}
            onChange={numberTargetValue((value) =>
              dispatch({
                type: CHANGED_PAYOUT_FIELD,
                field: 'inkedBagValue',
                value,
              }),
            )}>
            &times;
          </BrandedLabelInput>
        </div>

        <div className={styles.payoutBar__combinedInputWrapper}>
          <BrandedLabelInput
            min={0}
            type="number"
            placeholder="100000"
            id="calculator__goldBarCount"
            value={state.bankPayout.goldBarCount}
            onChange={numberTargetValue((value) =>
              dispatch({
                type: CHANGED_PAYOUT_FIELD,
                field: 'goldBarCount',
                value,
              }),
            )}>
            Gold Bars
          </BrandedLabelInput>
          <BrandedLabelInput
            min={0}
            type="number"
            placeholder="100000"
            id="calculator__goldBarValue"
            value={state.bankPayout.goldBarValue}
            onChange={numberTargetValue((value) =>
              dispatch({
                type: CHANGED_PAYOUT_FIELD,
                field: 'goldBarValue',
                value,
              }),
            )}>
            &times;
          </BrandedLabelInput>
        </div>
      </div>
      <div className={styles.payoutBar__summary}>
        {calculateGrossPayout(state)}
        <FaDollarSign />
      </div>
    </div>
  );
}

export default Calculator;
