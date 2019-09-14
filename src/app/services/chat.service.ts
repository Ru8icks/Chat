import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {tap} from 'rxjs/operators';
import * as io from 'socket.io-client';
import User from '../models/user';
import Typing from '../models/typing';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  uri = 'http://localhost:4000/business';
  private socket = io('http://localhost:4000');
  private _refresh$ = new Subject<any>();



  constructor(private http: HttpClient) {  }
  get refresh$() {
    return this._refresh$;
  }

  addMember(nickname) {
    const obj = {
      nickname: nickname,
      socketID: this.socket.id
    };
    console.log(obj);
    console.log('obj.nickname', obj);
    this.http.post(`${this.uri}/addMember`, obj)
      .subscribe(res => {
        console.log('post', res)

        this.socket.emit('new-nick', obj.nickname);
        console.log('Done');
        this._refresh$.next(Object.values(res));
      },
      (err) => {
        console.log('errererereer', err);
        this._refresh$.next(null);
        }
      );
  }

  public getNicks = () => {
    console.log("get nmicks");
    return Observable.create((observer) => {
      this.socket.on('new-nick', (nick) => {
        observer.next(this.http.get(`${this.uri}/getMembers`));
        console.log(nick, 'here');
      });
    });
  }

  public sendMessage(messageObj) {
    console.log(messageObj);
    console.log(' .nickname', messageObj.nickname);
    this.socket.emit('new-message', messageObj);
    console.log('Done');
  }
  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('new-message', (message) => {
        observer.next(message);
      });
    });
  }
  sendPrivateMessage(message) {
    console.log('emitting priv msg')
    this.socket.emit('private-message', (message));
  }
  public getPrivateMessages = () => {
    console.log('priv msg ' )
    return Observable.create((observer) => {
      this.socket.on('private-message', (message) => {
        console.log('priv msg ', message)
        observer.next(message);
      });
    });
  }

  public removeMember(id) {
    console.log('remove @ service')
    return this
      .http
      .get(`${this.uri}/deleteMember/${id}`).subscribe( res =>  {
        console.log(res , 'Done');
        this.socket.emit('new-nick');
      });
  }

  sendTyping(bol: boolean, selectedChat: string, sender: string) {
    console.log('are we here yet sendtype')
    const typing: Typing = {
      isTyping: bol,
      receiver: selectedChat,
      sender: sender,
    };
    console.log('are we here yet sendtype', typing)
    this.socket.emit('is-typing', (  typing));
  }
  public getTyping = () => {
    return Observable.create((observer) => {
      this.socket.on('is-typing', (typing) => {
        observer.next(typing);
      });
    });
  }
}
