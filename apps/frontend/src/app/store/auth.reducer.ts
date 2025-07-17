import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  token: string | null;
  user: { fullName: string; email: string } | null;
  successMessage: string | null;
  errorMessage: string | null;
}

export const initialState: AuthState = {
  token: null,
  user: null,
  successMessage: null,
  errorMessage: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.signUpSuccess, (state, { message }) => ({
    ...state,
    successMessage: message,
    errorMessage: null,
  })),
  on(AuthActions.signUpFailure, (state, { error }) => ({
    ...state,
    errorMessage: error,
    successMessage: null,
  })),
  on(AuthActions.signInSuccess, (state, { message, token, user }) => ({
    ...state,
    token,
    user,
    successMessage: message,
    errorMessage: null,
  })),
  on(AuthActions.signInFailure, (state, { error }) => ({
    ...state,
    errorMessage: error,
    successMessage: null,
  }))
);
