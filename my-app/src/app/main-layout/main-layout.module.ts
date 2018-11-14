import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddDocumentComponent } from './add-document/add-document.component';
import { MainLayoutComponent } from './main-layout.component';
import { FavouriteDocumentComponent } from './favourite-document/favourite-document.component';
import { MenuComponent } from './menu/menu.component';
import { NavComponent } from './nav/nav.component';
import { TableComponent } from './table/table.component';
import { MainLayoutRoutingModule } from './main-layout-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DocumentService } from './services/document.service';
import { FavouriteDocumentService } from './services/favourite-document.service';
import { HistoryService } from './services/history.service';
import { TransferService } from './services/transfer.service';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        MainLayoutRoutingModule
    ],
    declarations: [AddDocumentComponent,
        MainLayoutComponent,
        FavouriteDocumentComponent,
        MenuComponent,
        NavComponent,
        TableComponent
    ],
    providers: [
        DocumentService,
        FavouriteDocumentService,
        HistoryService,
        TransferService
    ],
    entryComponents: [
        AddDocumentComponent
    ]
})
export class MainLayoutModule { }