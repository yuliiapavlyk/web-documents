import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {FavouriteDocumentService} from './favourite-document.service'

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  
  constructor(  
    private favouriteDocumentService:FavouriteDocumentService
  ) { }
  private data:Document;
  documents;

  public addDocs = new Subject<Document>();

  
  public docFavourite = new Subject<Document>();
  
  //currentData = this.addDocs.asObservable();

  setData(document:Document):void{
   // console.log(document);    
    this.addDocs.next(document); 
  }





  // setData(data):void{
  //   this.addDocs.next(data);
  // }

  // getData(){  
  //   this.clearData();
  //   //return this.addDocs;
  // }

  // clearData():void{
  //   this.data = null;
  // }
}
