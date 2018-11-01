import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './auth/signin/signin.component';
import { TableComponent } from './table/table.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './auth/auth.guard';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import{FavouriteDocumentComponent} from '../app/favourite-document/favourite-document.component'
import { from } from 'rxjs';
import { GuestlayoutComponent } from './guestlayout/guestlayout.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';

const routes: Routes = [
  
  { path: '', component: MainLayoutComponent, canActivate:[AuthGuard],
  children: [
    {
      path: '',
      component: TableComponent
    },
    {
      path: 'docs',
      component: TableComponent
    },
    {
      path: 'favDocument',
      component: FavouriteDocumentComponent
    }
 
  ]
  },

  {
    path: '', component: GuestlayoutComponent,
    children: [
      {
        path: 'login',
        component: SigninComponent
      },
      {
        path:'**', 
        component: PageNotFoundComponent
      }
    ]
  },

  
  { path: 'not-auth', component: NotAuthorizedComponent},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
