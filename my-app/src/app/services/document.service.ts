import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Document } from '../models/document';
import { PagedListDocument } from '../models/pagedListDocument';
import { environment } from '.././../environments/environment';

@Injectable({
  providedIn: 'root'

})
export class DocumentService {

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      observe: 'response'
    })
  };

  private url = `${environment.apiUrl}document/`;

  getDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.url).pipe(
      catchError(this.handleError<Document[]>(`getAllDocuments`)));
  }
  getDocumentsByPage(pageNumber: number, pageSize: number): Observable<PagedListDocument> {
    return this.http.get<PagedListDocument>(`${environment.apiUrl}document/${pageNumber}/${pageSize}`).pipe(
      catchError(this.handleError<PagedListDocument>(`getDocumentsByPage`)));
  }

  getDocumentById(id: number): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.url}/${id}`).pipe(
      catchError(this.handleError<Document[]>(`getDocumentById`))
    );
  }

  createDocument(document: Document): Observable<any> {
    return this.http.post<Document>(this.url, document, { observe: 'response' }).pipe(
      catchError(val => of(val)));
  }

  updateUser(document: Document): Observable<HttpResponse<any>> {
    return this.http.put(`${this.url}/${document.Id}`, document, this.httpOptions).pipe(
      catchError(r => of(r))
    );
  }

  deleteDocumentById(id: number): Observable<any> {
    return this.http.delete<Document>(`${this.url}/${id}`).pipe(
      catchError(this.handleError<Document>('deleteDocument'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
