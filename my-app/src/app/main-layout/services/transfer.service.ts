import { Injectable } from '@angular/core';
import { Subject,Observable, of,BehaviorSubject} from 'rxjs';


import { FavouriteDocumentService } from './favourite-document.service'

import { Document } from '../../shared/models/document';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  constructor(
    private favouriteDocumentService: FavouriteDocumentService
  ) {
    this.favouriteDocumentService.getFavouriteDocuments().subscribe(result => {
      // this.loading$.next(result);
       this.documents = result;
     })        
     console.log("server-call");   
    
   }
  documents: Document[] ;
 // loading: boolean = true;
  //data:Document[]=[];

  // public loading$ = new BehaviorSubject<Document[]>(this.data);
  // documentInitializing = this.loading$.asObservable();

  // public documentStream$ = new Subject<Document>();
  // documentChanges = this.documentStream$.asObservable();

  // addToStream(document: Document): void {
  //   this.documentStream$.next(document);
  // }



  addDocumentFromFavourite(document: Document): void {
    this.documents.push(document);
  }

  removeDocumentFromFavourite(document: Document): void {
    console.log(document);
    this.documents.splice(this.documents.indexOf(document), 1);
  }

  getFavourite(): Observable<Document[]> {   
    
    if (!this.documents) {
       
      this.favouriteDocumentService.getFavouriteDocuments().subscribe(result => {
       // this.loading$.next(result);
        this.documents = result;
        console.log("server-call");
      })
    }
    console.log("get data without server-call");    
     // this.loading$.next(this.documents);
      return of(this.documents);
    
  }
}


