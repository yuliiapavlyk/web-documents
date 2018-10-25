import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './auth/signin/signin.component';
import { TableComponent } from './table/table.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './auth/auth.guard';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';

const routes: Routes = [
  
  //{ path: '', component: SigninComponent, outlet:'guest'},
  { path: 'signin', component: SigninComponent, canActivate: [AuthGuard],outlet: 'guest' },
  { path: 'docs', component: TableComponent, canActivate: [AuthGuard] },
  { path: 'not-auth', component: NotAuthorizedComponent, outlet:'guest'},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
