import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource , MatTable} from '@angular/material';
import {  Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import {DataSource} from '@angular/cdk/collections';
import { BehaviorSubject } from "rxjs";


import { FavouriteDocumentService } from '../../main-layout/services/favourite-document.service';
import { FavouriteDocument } from '../../shared/models';
import { TransferService } from '../../main-layout/services/transfer.service';
import { Document } from '../../shared/models';
import {FavouriteDataSource} from './favouriteDataSource'


@Component({
  selector: 'app-favourite-document',
  templateUrl: './favourite-document.component.html',
  styleUrls: ['./favourite-document.component.css']
})
export class FavouriteDocumentComponent implements OnInit {
  documents:Document[];
  idDocument: number;
  idUser: number;
  document: Document;
  favouriteDoc: FavouriteDocument;
  subscription: Subscription;
  interval: Subscription;
  dataSource: FavouriteDataSource ;
  loading: boolean = true;

  displayedColumns: string[] = ['Favourite', 'Name', 'Description', 'Author', 'CreateDate', 'ModifiedDate'];
  dataSubject = new BehaviorSubject<Document[]>([]);

  constructor(private favouriteDocumentService: FavouriteDocumentService,
    private transferService: TransferService
  ) {
    // this.favouriteDocumentService.getFavouriteDocuments().subscribe(res=>{
    //   debugger
    //  this.dataSubject.next(res)
    // });
   }

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

    this.dataSource = new FavouriteDataSource(this.transferService);
   
    
  //   this.transferService.getFavourite();
  //   this.transferService.documentInitializing
  //     .pipe(take(1))
  //     .subscribe(res => {
  //       debugger
  //       //this.documents = res;
  //       //this.dataSource.data = this.documents;
  //       //this.dataSource = new MatTableDataSource(res);
  //       console.log(res);
  //       this.dataSource = new MatTableDataSource(res);
  //     //  this.documents= res;
  //    //   this.dataSource.data=this.documents;
  //      //  = new MatTableDataSource();
  //      // this.dataSource.data = res;
  //     // console.log( this.dataSource.data + "data in data source");
       
  //       this.mytable.renderRows();
  //     })

  //   this.transferService.documentChanges.subscribe(res => {
  //     if (this.documents.indexOf(document)!=-1) {
  //       console.log("push");
  //       this.documents.push(res);
  //       console.log(this.documents);
  //      // this.dataSource.data = this.documents;
        
  //     }
  //     else {
  //       console.log("delete");
  //       this.documents.splice(this.documents.indexOf(document), 1);
  //     }
  //   })
 }



}