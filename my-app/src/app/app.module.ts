import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from'@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import { NavComponent } from './nav/nav.component';
import { LocalizedDatePipe } from './pipes/localized-date.pipe';
import { AddDocumentComponent } from './add-document/add-document.component';



@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    NavComponent,
    LocalizedDatePipe,
    AddDocumentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule, MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatToolbarModule, MatSortModule,
    HttpModule,
    HttpClientModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
    MatSelectModule

  ],
  providers: [
  ],
  entryComponents: [
    AddDocumentComponent,
    TableComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
