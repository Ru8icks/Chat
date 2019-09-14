import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import User from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  _nicknameTaken$ = new BehaviorSubject<boolean>(false);
  _selectedChat$ = new BehaviorSubject<string>('Public');
  _user$ = new BehaviorSubject<User>(undefined);
  _messages$ = new BehaviorSubject<any[]>([]);
  _selectedMessages$ = new BehaviorSubject<any[]>([]);

  constructor() { }

  get nicknametaken$() {
    return this._nicknameTaken$;
  }
  get selectedChat$() {
    return this._selectedChat$;
  }
  get user$() {
    return this._user$;
  }
  get messages$() {
    return this._messages$;
  }
  get selectedMessages$() {
    return this._selectedMessages$;
  }
  setSelectedMessages(msgs) {
    this._selectedMessages$.next(msgs);
  }
  setMessages(msgs) {
    this._messages$.next(msgs);
  }
  setUser(user: User) {
    this._user$.next(user);
  }
  setSelectedChat(value: string) {
    this._selectedChat$.next(value);
  }


  setNicknameTaken(value: boolean) {
    console.log('change nickkname taken');
    this._nicknameTaken$.next(value);
  }

}
