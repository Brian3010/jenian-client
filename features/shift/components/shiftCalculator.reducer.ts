import { ShiftFormValues } from '../schemas';

export type ShiftStatus = 'saved' | 'edited' | 'new';

export type ShiftWithStatus = ShiftFormValues & { status: ShiftStatus };

export type State = {
  savedShifts: ShiftWithStatus[];
  draftShifts: ShiftWithStatus[];
  deletedShiftIds: string[];
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

export function reducer(state: State, action: Action): State {
  console.log('🚀 ~ reducer ~ action:', action);
  console.log('🚀 ~ reducer ~ state:', state);
  switch (action.type) {
    case 'LOAD_SHIFTS':
      return {
        savedShifts: action.shifts.map(s => ({ ...s, status: 'saved' })),
        draftShifts: action.shifts.map(s => ({ ...s, status: 'saved' })),
        deletedShiftIds: [],
      };

    case 'ADD_SHIFT':
      return {
        ...state,
        draftShifts: [...state.draftShifts, { ...action.shift, id: `draft-${crypto.randomUUID()}`, status: 'new' }],
      };

    case 'EDIT_SHIFT':
      return {
        ...state,
        draftShifts: state.draftShifts.map(s =>
          s.id === action.shift.id ? { ...action.shift, status: s.status === 'new' ? 'new' : 'edited' } : s,
        ),
      };

    // NOTE: only include shiftIds from backend, for unsaved new shifts, we filter it out only
    case 'DELETE_SHIFT':
      return {
        ...state,
        draftShifts: state.draftShifts.filter(s => s.id !== action.shiftId),
        deletedShiftIds: [...state.deletedShiftIds, action.shiftId.includes('draft-') ? '' : action.shiftId],
      };

    case 'DISCARD_CHANGES':
      return {
        ...state,
        draftShifts: state.savedShifts,
        deletedShiftIds: [],
      };

    default:
      return state;
  }
}

export const createInitialState = (shifts: ShiftFormValues[]): State => ({
  savedShifts: shifts.map(s => ({ ...s, status: 'saved' })),
  draftShifts: shifts.map(s => ({ ...s, status: 'saved' })),
  deletedShiftIds: [],
});
