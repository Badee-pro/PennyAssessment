import { createAction, props } from '@ngrx/store';

// SignUp Actions
export const signUp = createAction(
  '[Auth] SignUp',
  props<{ signUpData: { fullName: string; email: string; password: string } }>()
);
export const signUpSuccess = createAction(
  '[Auth] SignUp Success',
  props<{ message: string }>()
);
export const signUpFailure = createAction(
  '[Auth] SignUp Failure',
  props<{ error: string }>()
);

// SignIn Actions
export const signIn = createAction(
  '[Auth] SignIn',
  props<{ signInData: { email: string; password: string } }>()
);
export const signInSuccess = createAction(
  '[Auth] SignIn Success',
  props<{ message: string; token: string; user: { fullName: string; email: string } }>()
);
export const signInFailure = createAction(
  '[Auth] SignIn Failure',
  props<{ error: string }>()
);
