import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource , MatTable} from '@angular/material';
import {  Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

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
  subscription: Subscription;
  interval: Subscription;
  loading: boolean = true;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['Favourite', 'Name', 'Description', 'Author', 'CreateDate', 'ModifiedDate'];
  @ViewChild(MatTable) mytable: MatTable<any>;

  constructor(private favouriteDocumentService: FavouriteDocumentService,
    private transferService: TransferService
  ) { }

  deleteFromFavourite(idDocument: number, idRow: number, document) {
    let favouriteDoc = { UserId: 1, DocumentId: idDocument };
    this.favouriteDocumentService.deleteFromFavouriteDocuments(favouriteDoc as FavouriteDocument).subscribe(res => {
      //  this.loadFavourites();
    });
    this.transferService.removeDocumentFromFavourite(document);

  }

  loadFavourites(): void {
    this.favouriteDocumentService.getFavouriteDocuments().subscribe(res => {
      //this.documents = res;
      //this.dataSource.data = this.documents;

    });
  }

  ngOnInit() {

    
    this.transferService.getFavourite();
    this.transferService.documentInitializing
      .pipe(take(1))
      .subscribe(res => {
        debugger
        //this.documents = res;
        //this.dataSource.data = this.documents;
        //this.dataSource = new MatTableDataSource(res);
        console.log(res);
        this.dataSource = new MatTableDataSource(res);
      //  this.documents= res;
     //   this.dataSource.data=this.documents;
       //  = new MatTableDataSource();
       // this.dataSource.data = res;
      // console.log( this.dataSource.data + "data in data source");
       
        this.mytable.renderRows();
      })

    this.transferService.documentChanges.subscribe(res => {
      if (this.documents.indexOf(document)!=-1) {
        console.log("push");
        this.documents.push(res);
        console.log(this.documents);
       // this.dataSource.data = this.documents;
        
      }
      else {
        console.log("delete");
        this.documents.splice(this.documents.indexOf(document), 1);
      }
    })
  }



}