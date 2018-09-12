import { BrowserModule } from '@angular/platform-browser';
import { NgModule , LOCALE_ID } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSortModule } from '@angular/material/sort';

import { MatPaginatorModule } from '@angular/material/paginator';
import { NavComponent } from './nav/nav.component';
import {LocalizedDatePipe} from '../app/pipes/datePipe';


@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    NavComponent,
    LocalizedDatePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule, MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule, MatSortModule,
    HttpModule,
    HttpClientModule

  ],
  providers: [
    { provide: LOCALE_ID, useValue: window.navigator.language }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
