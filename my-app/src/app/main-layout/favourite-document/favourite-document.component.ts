import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material';
import { Subscription } from 'rxjs';
import { BehaviorSubject } from "rxjs";


import { FavouriteDocumentService } from '../../main-layout/services/favourite-document.service';
import { FavouriteDocument } from '../../shared/models';
import { TransferService } from '../../main-layout/services/transfer.service';
import { Document } from '../../shared/models';
import { FavouriteDataSource } from './favouriteDataSource'


@Component({
  selector: 'app-favourite-document',
  templateUrl: './favourite-document.component.html',
  styleUrls: ['./favourite-document.component.css']
})
export class FavouriteDocumentComponent implements OnInit {
  documents: Document[];
  idDocument: number;
  idUser: number;
  document: Document;
  favouriteDoc: FavouriteDocument;
  subscription: Subscription;
  interval: Subscription;
  dataSource: FavouriteDataSource;
  loading: boolean = true;

  displayedColumns: string[] = ['Favourite', 'Name', 'Description', 'Author', 'CreateDate', 'ModifiedDate'];
  dataSubject = new BehaviorSubject<Document[]>([]);
  @ViewChild(MatTable) mytable: MatTable<any>;

  constructor(private favouriteDocumentService: FavouriteDocumentService,
    private transferService: TransferService
  ) {
  }

  deleteFromFavourite(idDocument: number, idRow: number, document) {
    let favouriteDoc = { UserId: 1, DocumentId: idDocument };
    this.favouriteDocumentService.deleteFromFavouriteDocuments(favouriteDoc as FavouriteDocument).subscribe();
    this.transferService.removeDocumentFromFavourite(document);
    this.mytable.renderRows();
  }

  ngOnInit() {
    this.dataSource = new FavouriteDataSource(this.transferService);
  
  }

}