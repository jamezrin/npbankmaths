import cx from 'clsx';
import App from 'next/app';
import React, { useContext, useReducer } from 'react';

import Background from '../components/Background';
import SocialLinks from '../components/SocialLinks';
import CalculatorCuts from './CalculatorCuts';
import CalculatorPrices from './CalculatorPrices';

export type HeistCrewType = {
  id: number;
  alias: string;
  expenses: number;
};

export type PayoutRewardType =
  | 'cash'
  | 'regularBags'
  | 'inkedBags'
  | 'goldBars';

export type RewardPriceType = Exclude<PayoutRewardType, 'cash'>;

export type AppState = {
  payoutRewards: Record<PayoutRewardType, number>;
  rewardPrices: Record<RewardPriceType, number>;
  heistCrewMembers: HeistCrewType[];
};

export const makeHeistCrewMember = ({
  id,
  expenses,
}: Omit<HeistCrewType, 'alias'>): HeistCrewType => ({
  id,
  alias: `Player ${id}`,
  expenses,
});

const getHighestCrewMemberId = (heistCrewMembers: HeistCrewType[]) =>
  Math.max(...heistCrewMembers.map(({ id }) => id), 0);

const initialState: AppState = {
  payoutRewards: {
    cash: 9000,
    regularBags: 225,
    inkedBags: 1,
    goldBars: 5,
  },
  rewardPrices: {
    regularBags: 250,
    inkedBags: 50000,
    goldBars: 5000,
  },
  heistCrewMembers: [
    makeHeistCrewMember({ id: 1, expenses: 12500 }),
    makeHeistCrewMember({ id: 2, expenses: 12500 }),
    makeHeistCrewMember({ id: 3, expenses: 0 }),
  ],
};

const CHANGED_NUMBER_FIELD = 'CHANGED_NUMBER_FIELD';
type NumberFieldUpdateAction = {
  type: typeof CHANGED_NUMBER_FIELD;
  value: number;
} & NumberFieldSectionUnionType;

export type NumberFieldSectionUnionType =
  | {
      section: Extract<keyof AppState, 'payoutRewards'>;
      field: keyof AppState['payoutRewards'];
    }
  | {
      section: Extract<keyof AppState, 'rewardPrices'>;
      field: keyof AppState['rewardPrices'];
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

type AppStateAction =
  | NumberFieldUpdateAction
  | CrewMemberAliasChangeAction
  | CrewMemberExpensesChangeAction
  | CrewMemberRemoveAction
  | CrewMemberAddAction;

function reducer(state: AppState, action: AppStateAction): AppState {
  switch (action.type) {
    case CHANGED_NUMBER_FIELD:
      return {
        ...state,
        [action.section]: {
          ...state[action.section],
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

type CalculatorContextType = [AppState, React.Dispatch<AppStateAction>];
const initialCalculatorContext = null as unknown as CalculatorContextType;
const CalculatorContext = React.createContext<CalculatorContextType>(
  initialCalculatorContext,
);

export const useCalculatorStore = () =>
  useContext<CalculatorContextType>(CalculatorContext);

export const calculateGrossPayout = ({
  payoutRewards,
  rewardPrices,
}: AppState): number =>
  payoutRewards.cash +
  payoutRewards.regularBags * rewardPrices.regularBags +
  payoutRewards.inkedBags * rewardPrices.inkedBags +
  payoutRewards.goldBars * rewardPrices.goldBars;

function CalculatorMain() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className={cx('min-h-screen flex')}>
      <div className={cx('p-3 md:p-6 lg:p-10 xl:p-16 flex flex-col')}>
        <div className={cx('text-3xl text-white flex items-center')}>
          <h1 className={cx('px-3 py-2 inline-block bg-brand-secondary')}>
            NoPixel Bank Heist Calculator
          </h1>
          <div className={cx('pl-2 ml-auto text-2xl')}>
            <SocialLinks />
          </div>
        </div>

        <CalculatorContext.Provider value={[state, dispatch]}>
          <div className={cx('mt-4 flex-grow grid grid-cols-12 gap-4')}>
            <div
              className={cx(
                'bg-brand-secondary',
                'shadow-lg',
                'col-span-full',
                'lg:col-span-9',
              )}>
              <CalculatorCuts />
            </div>
            <div
              className={cx(
                'bg-brand-secondary',
                'shadow-lg',
                'col-span-full',
                'lg:col-span-3',
              )}>
              <CalculatorPrices />
            </div>
          </div>
        </CalculatorContext.Provider>
      </div>
    </div>
  );
}

function CalculatorApp() {
  return (
    <>
      <Background />
      <CalculatorMain />
    </>
  );
}

export default CalculatorApp;
