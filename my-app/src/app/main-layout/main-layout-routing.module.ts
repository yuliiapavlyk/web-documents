import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TableComponent } from './table/table.component';
import { FavouriteDocumentComponent } from './favourite-document/favourite-document.component';
import { MainLayoutComponent } from '../main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '', component: MainLayoutComponent,
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainLayoutRoutingModule { }