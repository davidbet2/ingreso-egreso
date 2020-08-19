import { createReducer, on } from '@ngrx/store';
import { isLoading, stopLoading } from './us.actions';

export interface State {
    isLoading: Boolean; 
}

export const initialState: State = {
   isLoading: false,
}

const _uiReducer = createReducer(initialState,

    on(isLoading, state => ({ ...state, isLoading: true})),
    on(stopLoading, state => ({ ...state, stopLoading: false})),

);

export function uiReducer(state, action) {
    return _uiReducer(state, action);
}