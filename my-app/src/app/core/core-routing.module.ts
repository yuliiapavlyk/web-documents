import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: '../main-layout/main-layout.module#MainLayoutModule'
    },
    {
        path: '',
        loadChildren: '../guestlayout/guestlayout.module#GuestLayoutModule'
    },
    { path: 'not-auth', component: NotAuthorizedComponent },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class CoreRoutingModule { }