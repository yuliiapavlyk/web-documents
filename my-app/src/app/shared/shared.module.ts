import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocalizedDatePipe } from './pipes/localized-date.pipe';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule
    ],
    declarations: [
        LocalizedDatePipe,
        ConfirmDialogComponent,

    ],
    exports: [
        LocalizedDatePipe,
        ConfirmDialogComponent,
        MaterialModule
    ],
    entryComponents: [
          ConfirmDialogComponent
    ],
})
export class SharedModule { }