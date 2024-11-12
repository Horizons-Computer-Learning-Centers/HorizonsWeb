import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { User } from '../../shared/interfaces/user';
import authActions from "./auth.actions";

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  user: User | undefined;
  isValidToken: boolean;
}

export const initialAuthState: AuthState = {
  user: undefined,
  isValidToken: false
};

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.login, (state, action) => ({
    ...state,
    user: action.user,
  })),

  on(AuthActions.logout, (state, action) => ({
    ...state,
    user: undefined,
  })),
  on(authActions.isValidToken, (state, action) => ({
    ...state,
    isValidToken: true,
  })),
  on(authActions.isInvalidToken, (state, action) => ({
    ...state,
    isValidToken: false,
  }))
);
