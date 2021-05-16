import BrandedLabelInput from '../components/BrandedLabelInput';
import styles from '../styles/Calculator.module.css';
import React, { createElement, useContext, useReducer } from 'react';
import { FaDollarSign, FaUserTimes } from 'react-icons/fa';
import { Column, useFlexLayout, useTable } from 'react-table';

const numberTargetValue = (consumer: (value: number) => void): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
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

const makeHeistCrewMember = ({ id, expenses }: Omit<HeistCrewType, 'alias'>): HeistCrewType => ({
  id,
  alias: `Part ${id}`,
  expenses,
});

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

function reducer(state: CalculatorState, action: CalculatorStateAction): CalculatorState {
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
        heistCrewMembers: state.heistCrewMembers.map(({ alias, expenses, id }) => ({
          alias: id === action.crewMemberId ? action.newAlias : alias,
          expenses,
          id,
        })),
      };

    case CHANGED_CREW_MEMBER_EXPENSES:
      return {
        ...state,
        heistCrewMembers: state.heistCrewMembers.map(({ alias, expenses, id }) => ({
          expenses: id === action.crewMemberId ? action.newExpenses : expenses,
          alias,
          id,
        })),
      };

    case REMOVED_CREW_MEMBER:
      return {
        ...state,
        heistCrewMembers: state.heistCrewMembers.filter((crewMember) => {
          return action.crewMemberId === crewMember.id;
        }),
      };

    case ADDED_CREW_MEMBER:
      return {
        ...state,
        heistCrewMembers: [
          ...state.heistCrewMembers,
          makeHeistCrewMember({
            id: Math.max(...state.heistCrewMembers.map(({ id }) => id)) + 1,
            expenses: 0,
          }),
        ],
      };

    default:
      return state;
  }
}

type CalculatorContextType = [CalculatorState, React.Dispatch<CalculatorStateAction>];
const initialCalculatorContext = null as unknown as CalculatorContextType;
const CalculatorContext = React.createContext<CalculatorContextType>(initialCalculatorContext);

function Calculator() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className={styles.calculatorContainer}>
      <section className={styles.calculator}>
        <h2>NoPixel Bank Heist Take Calculator</h2>
        <CalculatorContext.Provider value={[state, dispatch]}>
          <CalculatorInputs />
          <CalculatorTable />
        </CalculatorContext.Provider>
      </section>
    </div>
  );
}

type ComputedCrewMember = HeistCrewType & {
  take: number;
};

const calculateTotalPayout = ({
  bankPayout: { cash, goldBarCount, goldBarValue, inkedBagCount, inkedBagValue, regularBagCount, regularBagValue },
}: CalculatorState): number =>
  cash + goldBarCount * goldBarValue + inkedBagCount * inkedBagValue + regularBagCount * regularBagValue;

function CalculatorTable() {
  const [state, dispatch] = useContext<CalculatorContextType>(CalculatorContext);

  const data = React.useMemo<Array<ComputedCrewMember>>(() => {
    const summedExpenses = state.heistCrewMembers.reduce((acc, cur) => acc + cur.expenses, 0);
    const heistCrewMemberCount = state.heistCrewMembers.length;
    const totalPayout = calculateTotalPayout(state);
    const theoreticalPayout = totalPayout / heistCrewMemberCount;
    const theoreticalExpense = summedExpenses / heistCrewMemberCount;

    return state.heistCrewMembers.map((crewMember) => {
      const calculatedTake = Math.round(crewMember.expenses - theoreticalExpense + theoreticalPayout);
      return {
        ...crewMember,
        take: calculatedTake,
      };
    });
  }, [state]);

  // https://react-table.tanstack.com/docs/examples/full-width-table
  // https://github.com/tannerlinsley/react-table/tree/master/examples/full-width-resizable-table
  const columns = React.useMemo<Column<ComputedCrewMember>[]>(
    () => [
      {
        Header: 'Alias',
        accessor: 'alias',
        Cell: ({ cell }) => (
          <>
            {cell.value} <FaUserTimes />
          </>
        ),
      },
      {
        Header: 'Expenses',
        accessor: 'expenses',
      },
      {
        Header: 'Take',
        accessor: 'take',
      },
    ],
    [],
  );

  const tableInstance = useTable({
    columns: columns,
    data: data,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <div className={styles.calculatorTable}>
      <table {...getTableProps()}>
        <thead>
          {
            // Loop over the header rows
            headerGroups.map((headerGroup) => (
              // Apply the header row props
              <tr {...headerGroup.getHeaderGroupProps()}>
                {
                  // Loop over the headers in each row
                  headerGroup.headers.map((column) => (
                    // Apply the header cell props
                    <th {...column.getHeaderProps()}>
                      {
                        // Render the header
                        column.render('Header')
                      }
                    </th>
                  ))
                }
              </tr>
            ))
          }
        </thead>
        {/* Apply the table body props */}
        <tbody {...getTableBodyProps()}>
          {
            // Loop over the table rows
            rows.map((row) => {
              // Prepare the row for display
              prepareRow(row);
              return (
                // Apply the row props
                <tr {...row.getRowProps()}>
                  {
                    // Loop over the rows cells
                    row.cells.map((cell) => {
                      // Apply the cell props
                      return (
                        <td {...cell.getCellProps()}>
                          {
                            // Render the cell contents
                            cell.render('Cell')
                          }
                        </td>
                      );
                    })
                  }
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
}

function CalculatorInputs() {
  const [state, dispatch] = useContext<CalculatorContextType>(CalculatorContext);

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
          )}
        >
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
            )}
          >
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
            )}
          >
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
            )}
          >
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
            )}
          >
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
            )}
          >
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
            )}
          >
            &times;
          </BrandedLabelInput>
        </div>
      </div>
      <div className={styles.payoutBar__summary}>
        {calculateTotalPayout(state)}
        <FaDollarSign />
      </div>
    </div>
  );
}

export default Calculator;
