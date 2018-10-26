import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {FavouriteDocumentComponent} from '../app/favourite-document/favourite-document.component';

import { TableComponent } from './table/table.component';

const routes: Routes = [
  { path: 'main', component: TableComponent },
  { path: 'favDocument', component: FavouriteDocumentComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes) ,
    
  ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }
