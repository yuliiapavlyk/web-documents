import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { FavouriteDocumentService } from '../services/favourite-document.service';
import { FavouriteDocument } from '../models/favouriteDocument';

@Component({
  selector: 'app-favourite-document',
  templateUrl: './favourite-document.component.html',
  styleUrls: ['./favourite-document.component.css']
})
export class FavouriteDocumentComponent implements OnInit {
  documents;
  elements;
  idDocument: number;
  idUser: number;
  favouriteDoc: FavouriteDocument;
  dataSource = new MatTableDataSource<Document[]>(this.documents);
  displayedColumns: string[] = ['Favourite', 'Name', 'Description', 'Author', 'CreateDate', 'ModifiedDate'];

  constructor(private favouriteDocumentService: FavouriteDocumentService,
  ) { }

  deleteFromFavourite(idDocument: number, idRow: number, row) {
    let favouriteDoc = { UserId: 1, DocumentId: idDocument };
    this.favouriteDocumentService.deleteFromFavouriteDocuments(favouriteDoc as FavouriteDocument).subscribe(res => {
      this.loadFavourites();
    });
  }

  loadFavourites(): void {
    this.favouriteDocumentService.getFavouriteDocuments(1).subscribe(res => {
      this.documents = res;
      this.dataSource.data = this.documents;
    });
  }

  ngOnInit() {
    this.loadFavourites();
  }
}

