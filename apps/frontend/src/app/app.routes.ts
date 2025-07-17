import { Route } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';

export const appRoutes: Route[] = [
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
];
