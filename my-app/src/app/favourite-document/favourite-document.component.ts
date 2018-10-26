import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, ViewChild, ElementRef, Renderer2,AfterViewChecked } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { FavouriteDocumentService } from '../services/favourite-document.service';
import { FavouriteDocument } from '../models/favouriteDocument';




@Component({
  selector: 'app-favourite-document',
  templateUrl: './favourite-document.component.html',
  styleUrls: ['./favourite-document.component.css']
})
export class FavouriteDocumentComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChildren("mytable") mytable : QueryList<ElementRef>;

  @ViewChildren("document") document : QueryList<ElementRef>;
  
  documents;
  elements;
  idDocument: number;
  idUser: number;
  favouriteDoc: FavouriteDocument;
  dataSource = new MatTableDataSource<Document[]>(this.documents);
  displayedColumns: string[] = ['Favourite', 'Name', 'Description', 'Author', 'CreateDate', 'ModifiedDate'];

  constructor(private favouriteDocumentService: FavouriteDocumentService,
    private renderer: Renderer2) { }



  deleteFromFavourite(idDocument: number, idRow: number, row) {

    let favouriteDoc = { UserId: 1, DocumentId: idDocument };

    this.favouriteDocumentService.deleteFromFavouriteDocuments(favouriteDoc as FavouriteDocument).subscribe(res => {
      this.loadFavourites();

    });


  }
  set(ev) {
    console.log(ev.target);

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
  ngAfterViewInit() {

    
  }
  ngAfterViewChecked(){
        debugger
    console.log(this.document.toArray()[0].nativeElement);
  }

}
