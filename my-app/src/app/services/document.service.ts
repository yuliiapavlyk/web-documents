import { Injectable } from '@angular/core';

import { environment } from '.././../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Document} from '../models/document';

@Injectable({
  providedIn: 'root'

})
export class DocumentService {

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private url = `${environment.apiUrl}`;

  getDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.url).pipe(
      catchError(this.handleError<Document[]>(`allDocuments`))
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
