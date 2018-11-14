import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Subject, Subscription } from 'rxjs';

import { FavouriteDocumentService } from '../../main-layout/services/favourite-document.service';
import { FavouriteDocument } from '../../shared/models';
import { TransferService } from '../../main-layout/services/transfer.service';
import { Document } from '../../shared/models';

@Component({
  selector: 'app-favourite-document',
  templateUrl: './favourite-document.component.html',
  styleUrls: ['./favourite-document.component.css']
})
export class FavouriteDocumentComponent implements OnInit {
  documents;
  idDocument: number;
  idUser: number;
  document: Document;
  favouriteDoc: FavouriteDocument;
  //data:boolean=false;
  interval: Subscription;
  dataSource = new MatTableDataSource<Document[]>(this.documents);
  displayedColumns: string[] = ['Favourite', 'Name', 'Description', 'Author', 'CreateDate', 'ModifiedDate'];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private favouriteDocumentService: FavouriteDocumentService,
    private transferService: TransferService
  ) { }

  deleteFromFavourite(idDocument: number, idRow: number, row) {
    let favouriteDoc = { UserId: 1, DocumentId: idDocument };
    this.favouriteDocumentService.deleteFromFavouriteDocuments(favouriteDoc as FavouriteDocument).subscribe(res => {
      //  this.loadFavourites();
    });
  }

  loadFavourites(): void {
    this.favouriteDocumentService.getFavouriteDocuments().subscribe(res => {
      this.documents = res;
      this.dataSource.data = this.documents;
    });
  }

  ngOnInit() {
    this.documents = this.transferService.getFavourite();
    this.dataSource.data = this.documents;

  }

}

