import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule, MatSnackBarModule, MatTooltipModule, MatAutocompleteModule, } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    imports: [
        MatButtonModule,
        MatCheckboxModule,
        MatTableModule,
        MatAutocompleteModule,
        MatPaginatorModule,
        MatCardModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatToolbarModule, MatSortModule,
        MatInputModule,
        MatDialogModule,
        FormsModule,
        MatSelectModule,
        MatSnackBarModule,
        MatTooltipModule,
        ReactiveFormsModule,
        MatSnackBarModule,
    ],

    exports: [
        MatButtonModule,
        MatCheckboxModule,
        MatTableModule,
        MatAutocompleteModule,
        MatPaginatorModule,
        MatCardModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatToolbarModule, MatSortModule,
        MatInputModule,
        MatDialogModule,
        FormsModule,
        MatSelectModule,
        MatSnackBarModule,
        MatTooltipModule,
        ReactiveFormsModule,
        MatSnackBarModule

    ]

})
export class MaterialModule { }