import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import {catchError, map, concatMap, switchMap, tap, of} from 'rxjs';
import * as AuthActions from './auth.actions';
import { Router } from '@angular/router';
import { StorageEnums } from '../../shared/enums/storage-enums';
import { AuthService, TokenValidationDto } from "../../shared/api/auth-api";

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      tap((action) => localStorage.setItem(StorageEnums.User, JSON.stringify(action.user))),
      map(() => AuthActions.isValidToken())
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        localStorage.removeItem(StorageEnums.User);
        this.router.navigateByUrl('/auth/login');
      }),
      map(() => AuthActions.isInvalidToken())
    )
  );

  validateToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.validateToken),
      switchMap((action) => {
        const tokenValidationDto: TokenValidationDto = { token: action.user.token };
        return this.authService.validateToken(tokenValidationDto).pipe(
          concatMap((isValid) => isValid
            ? [AuthActions.isValidToken(), AuthActions.login({ user: action.user })]
            : [AuthActions.isInvalidToken(), AuthActions.logout()]
          ),
          catchError((error) => {
            console.error('Token validation error:', error);
            return of(AuthActions.isInvalidToken(), AuthActions.logout());
          })
        );
      })
    )
  );

  constructor(private actions$: Actions, private router: Router, private readonly authService: AuthService) {}
}
