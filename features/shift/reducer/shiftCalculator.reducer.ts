import { ShiftFormValues } from '../schemas';

export type ShiftStatus = 'saved' | 'edited' | 'new';

export type ShiftWithStatus = ShiftFormValues & { status: ShiftStatus };

export type State = {
  savedShifts: ShiftWithStatus[];
  draftShifts: ShiftWithStatus[];
  deletedShiftIds: string[];
  changeCounter: number;
};

type Action =
  | { type: 'LOAD_SHIFTS'; shifts: ShiftFormValues[] }
  | { type: 'ADD_SHIFT'; shift: ShiftFormValues }
  | { type: 'EDIT_SHIFT'; shift: ShiftFormValues }
  | { type: 'DELETE_SHIFT'; shiftId: string } // shift id
  //NOTE: This "SAVE_CHANGES" can be added if we don't want to wait for backend response to update the savedShifts,
  // and instead optimistically update it when user clicks save
  // | { type: 'SAVE_CHANGES' }
  | { type: 'DISCARD_CHANGES' };

/**
 * Manage the state of the shift calculator, including saved shifts, draft shifts, and deleted shift IDs.
 * @param state The current state of the shift calculator
 * @param action The action to be performed on the state
 * @returns The new state after applying the action
 */
export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_SHIFTS':
      return {
        savedShifts: action.shifts.map(s => ({ ...s, status: 'saved' })),
        draftShifts: action.shifts.map(s => ({ ...s, status: 'saved' })),
        deletedShiftIds: [],
        changeCounter: 0,
      };

    // NOTE: when adding a new shift, draft-{id} is used as a temporary id for the new shift,
    // and will be replaced with the real id from backend when saved
    // purpose is to make it easy to handle displaying new shifts using mapping with key={shift.id}
    case 'ADD_SHIFT':
      return {
        ...state,
        draftShifts: [...state.draftShifts, { ...action.shift, id: `draft-${crypto.randomUUID()}`, status: 'new' }],
        changeCounter: state.changeCounter + 1,
      };

    case 'EDIT_SHIFT':
      return {
        ...state,
        draftShifts: state.draftShifts.map(s =>
          s.id === action.shift.id ? { ...action.shift, status: s.status === 'new' ? 'new' : 'edited' } : s,
        ),
        changeCounter: state.changeCounter + 1,
      };

    // NOTE: only include shiftIds from backend, for unsaved new shifts, we filter it out only
    case 'DELETE_SHIFT':
      return {
        ...state,
        draftShifts: state.draftShifts.filter(s => s.id !== action.shiftId),
        deletedShiftIds: [...state.deletedShiftIds, ...(action.shiftId.includes('draft-') ? [] : [action.shiftId])],
        changeCounter: state.changeCounter + 1,
      };

    case 'DISCARD_CHANGES':
      return {
        ...state,
        draftShifts: state.savedShifts,
        deletedShiftIds: [],
        changeCounter: 0,
      };

    default:
      return state;
  }
}

// create initial state from the shifts fetched from backend, and set the status of each shift to 'saved'
export const createInitialState = (shifts: ShiftFormValues[]): State => {
  if (shifts.length === 0) {
    return {
      savedShifts: [],
      draftShifts: [],
      deletedShiftIds: [],
      changeCounter: 0,
    };
  }
  return {
    savedShifts: shifts.map(s => ({ ...s, status: 'saved' })),
    draftShifts: shifts.map(s => ({ ...s, status: 'saved' })),
    deletedShiftIds: [],
    changeCounter: 0,
  };
};
