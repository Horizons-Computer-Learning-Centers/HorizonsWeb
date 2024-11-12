import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import {catchError, map, mergeMap, of, switchMap, tap} from 'rxjs';
import * as AuthActions from './auth.actions';
import { Router } from '@angular/router';
import { StorageEnums } from '../../shared/enums/storage-enums';
import {AuthService, TokenValidationDto} from "../../shared/api/auth-api";
import authActions from "./auth.actions";

@Injectable()
export class AuthEffects {
  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        tap((action) =>
          localStorage.setItem(StorageEnums.User, JSON.stringify(action.user))
        )
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap((action) => {
          localStorage.removeItem(StorageEnums.User);
          this.router.navigateByUrl('/auth/login');
        })
      ),
    { dispatch: false }
  );

  validateToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.validateToken),
      switchMap((action: any) => {
        const tokenValidationDto: TokenValidationDto = {
          token: action.user.token,
        };
        return this.authService.validateToken(tokenValidationDto).pipe(
          mergeMap((isValid) => {
            if (isValid) {
              return [
                authActions.isValidToken(),
                authActions.login({ user: action.user }),
              ];
            } else {
              return [
                authActions.isInvalidToken(),
                authActions.logout(),
              ];
            }
          }),
          catchError(() => of(authActions.isInvalidToken(), authActions.logout()))
        );
      })
    )
  );

  constructor(private actions$: Actions, private router: Router, private readonly authService: AuthService) {}
}
