import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {FavouriteDocumentService} from './favourite-document.service'

import{Document} from '../models/document';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  
  constructor(  
    private favouriteDocumentService:FavouriteDocumentService
  ) { }
  documents:Document[]; 

  public addDocs = new Subject<Document>(); 
  
  addDocumentFromFavourite(document:Document):void{    
    this.documents.push(document);    
  }

  removeDocumentFromFavourite(document:Document):void{ 
    this.documents.splice(this.documents.indexOf(document),1);
   }

  getFavourite():Document[]{
    if (!this.documents) { 
      this.favouriteDocumentService.getFavouriteDocuments().subscribe(res => {
        this.documents = res; 
      });      
       return  this.documents;
    }
  } 
}
