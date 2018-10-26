import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Document } from '../models/document';
import { environment } from '.././../environments/environment';
import { FavouriteDocument} from '../models/favouriteDocument';

@Injectable({
  providedIn: 'root'
})
export class FavouriteDocumentService {

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      observe: 'response'
    })
  };

  private url = `${environment.apiUrl}favouriteDocument/`;

  getFavouriteDocuments(idUser:number): Observable<Document[]> {
    return this.http.get<Document[]>(this.url).pipe( 
       catchError(val => of(val)));
  }

  addToFavouriteDocuments(document:FavouriteDocument): any { 
      return this.http.post<FavouriteDocument>(this.url, document, this.httpOptions).pipe(
        catchError(val => of(val)));
    }
  deleteFromFavouriteDocuments(document:FavouriteDocument): any{
    return this.http.request<FavouriteDocument>('delete', this.url, { body:document} ).pipe(
      catchError(this.handleError<FavouriteDocument>(`deleteFromFavouriteDocuments`)));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
