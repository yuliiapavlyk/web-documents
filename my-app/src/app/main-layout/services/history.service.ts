import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { History } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable()
export class HistoryService {

  constructor(private http: HttpClient) { }
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      observe: 'response'
    })
  };

  private url = `${environment.apiUrl}history/`;

  getSearcHistory(): Observable<History[]> {
    return this.http.get<History[]>(this.url).pipe(
      catchError(this.handleError<History[]>(`getSearchHistory`)));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
