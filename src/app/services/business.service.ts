import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {BehaviorSubject, Subject} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  uri = 'http://localhost:4000/business';
  private _refresh$ = new Subject<void>();
  get refresh$() {
    return this._refresh$;
  }


  constructor(private http: HttpClient) { }


  getBusinesses() {
    console.log('getbus')
    return this
      .http
      .get(`${this.uri}`);
  }

  deleteBusiness(id) {
    return this
      .http
      .get(`${this.uri}/delete/${id}`)
      .pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }
}
