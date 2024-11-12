import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/interfaces/user';

export const login = createAction(
  '[Login Page] User Login',
  props<{ user: User }>()
);

export const logout = createAction('[Top Menu] Logout');

export const validateToken = createAction('[Token] Validate Token', props<{ user: User }>());

export const isValidToken = createAction('[Auth] Is Valid Token');

export const isInvalidToken = createAction('[Auth] Is Invalid Token');

const authActions = {
  login,
  logout,
  validateToken,
  isValidToken,
  isInvalidToken
};

export default authActions;
