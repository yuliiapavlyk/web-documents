import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Document } from '../models/document';
import { DocumentParams } from '../models/documentsParams';
import { PagedListDocument } from '../models/pagedListDocument';
import { PagedListDocumentWithMessage } from '../models/pagedListDocumentWithMessage';
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
  getDocumentsByPage( docParams: DocumentParams): Observable<PagedListDocument> {
    return this.http.post<PagedListDocument>(`${this.url}getDocuments/`, docParams, this.httpOptions).pipe(
      catchError(this.handleError<PagedListDocument>(`getDocumentsByPage`)));
  }
  getDocumentsByPageWithSearch( docParams: DocumentParams): Observable<PagedListDocumentWithMessage> {
    return this.http.post<PagedListDocumentWithMessage>(`${this.url}search/`, docParams, this.httpOptions).pipe(
      catchError(this.handleError<PagedListDocumentWithMessage>(`getDocumentsByPage`)));
  }


  getDocumentById(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.url}/${id}`).pipe(
      catchError(this.handleError<Document>(`getDocumentById`))
    );
  }

  uploadDocument(file: FormData ): Observable<any> {
    return this.http.post<any>(`${this.url}upload`, file , { observe: 'response' }).pipe(
      catchError(val => of(val)));
  }

  createDocument(document: Document): Observable<any> {
    return this.http.post<Document>(this.url, document, { observe: 'response' }).pipe(
      catchError(val => of(val)));
  }

  updateDocument( document: Document): Observable<HttpResponse<any>> {
    return this.http.put(`${this.url}${document.Id}`,document, this.httpOptions).pipe(
      catchError(r => of(r))
    );
  }

  deleteDocumentById(id: number): Observable<any> {
    return this.http.delete<Document>(`${this.url}/${id}`).pipe(
      catchError(this.handleError<Document>('deleteDocument'))
    );
  }
  deleteDocuments(ids: number[]): Observable<any> {
    return this.http.request<number[]>('delete', this.url, { body:ids} ).pipe(
      catchError(this.handleError<any>('deleteDocuments'))
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
