import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
// import { AuthService } from '../services/auth.service';
import * as AuthActions from './auth.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signUp),
      switchMap(({ signUpData }) =>
        this.authService.signUp(signUpData).pipe(
          map((response) =>
            AuthActions.signUpSuccess({ message: response.message })
          ),
          catchError((error) =>
            of(AuthActions.signUpFailure({ error: error.message }))
          )
        )
      )
    )
  );

  signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signIn),
      switchMap(({ signInData }) =>
        this.authService.signIn(signInData).pipe(
          map((response) =>
            AuthActions.signInSuccess({
              message: response.message,
              token: response.data.accessToken,
              user: response.data.user,
            })
          ),
          catchError((error) =>
            of(AuthActions.signInFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
