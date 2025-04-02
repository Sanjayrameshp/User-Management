import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
    {path: '', redirectTo: 'user-list', pathMatch: 'full'},
    {path: 'user-list', component: UserListComponent},
    {path: 'user-details/:userid', component: UserDetailsComponent},
    {path: '**', component: NotFoundComponent}
];
