import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './auth/signin/signin.component';
import { TableComponent } from './table/table.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './auth/auth.guard';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import{FavouriteDocumentComponent} from '../app/favourite-document/favourite-document.component'
import { from } from 'rxjs';

const routes: Routes = [
  
  { path: '', component: SigninComponent},
  { path: 'signin', component: SigninComponent, canActivate: [AuthGuard]},

  { path: 'main', component: TableComponent, canActivate: [AuthGuard] },
  { path: 'favDocument', component: FavouriteDocumentComponent ,canActivate: [AuthGuard]},
  { path: 'not-auth', component: NotAuthorizedComponent},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
