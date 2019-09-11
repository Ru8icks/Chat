import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ChatService } from '../services/chat.service';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/filter';
import User from '../models/user';
import Typing from '../models/typing';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  private messages = [];
  private selectedMessages = [];
  private nicks: Observable<any>[];

  private selectedChat = 'Public';
  private newMessages = [];
  private activeChat = 'Public';
  private user: User;
  private typing = new Typing();

  constructor(private fb: FormBuilder,
              private cs: ChatService) {
  }

  ngOnInit() {
    this.setUser();

    this.getNicks();
    this.getPublicMessages();
    this.getPrivateMessages();

    this.cs.selectedChat$
      .subscribe((value) => {
        this.selectedChat = value;
      });
    this.cs.user$
      .subscribe((value) => {
        this.user = value;
      });
    this.cs.selectedMessages$
      .subscribe((value) => {
        this.selectedMessages = value;
      });
    this.cs.messages$
      .subscribe((value) => {
        this.messages = value;
      });
    this.cs.getTyping()
      .subscribe((typing) => {
        this.typing = typing;
      });
  }
  setUser() {
    this.cs.refresh$
      .subscribe((nick) => {
        console.log('fire fire setuser')
        if (nick !== null) {
          console.log(nick, nick[0].nickname)
          this.cs.changeNicknameTaken(false);
          const user: User = {
            nickname: nick[0].nickname,
            myID: nick[0].socketID,
          };
          this.cs.setUser(user);
        } else {
          this.cs.changeNicknameTaken(true);
        }
      });
  }
  getNicks() {
    this.cs.getNicks()
      .subscribe((nick) => {
        this.nicks = nick;
      });
  }
  getPublicMessages() {
    this.cs.getMessages()
      .subscribe((message: string) => {
        this.messages.push(message);
        if (this.selectedChat === 'Public') {
          this.selectedMessages.push(message);
          this.cs.setSelectedMessages(this.selectedMessages);
        }
      });
  }
  getPrivateMessages() {
    this.cs.getPrivateMessages()
      .subscribe((message) => {
        this.messages.push(message);
        this.cs.setMessages(this.messages);
        const newMessage = {
          message: message,
          count: 1,
        };
        if (this.isMyMessage(message)) {
          this.selectedMessages.push(message);
          this.cs.setSelectedMessages(this.selectedMessages);
          if (this.newMessages.filter(msg => msg.message.sender === newMessage.message.sender).length === 0) {
            this.newMessages.push(newMessage);
          }
        } else {
          if (this.newMessages.filter(msg => msg.message.sender === newMessage.message.sender).length > 0) {
            const test = this.newMessages.filter(msg => msg.message.sender === newMessage.message.sender);
            test[0].count += 1;
          } else {
            this.newMessages.push(newMessage);
          }
        }
      });
  }

  ngOnDestroy() {
    console.log('im outa here');
    if (this.user) {
      this.cs.removeMember(this.user.nickname);
    }
  }
  setActiveChat(user) {
    console.log('active user ', user)
    this.activeChat = user;
  }

  selectChat(user) {
    console.log('select chat ', user)
    this.cs.setSelectedChat(user);
    this.cs.setSelectedMessages( this.messages.filter((msg) => this.isMyMessage(msg)));
  }

  private isMyMessage(msg) {
    if (msg.receiver === this.selectedChat || (msg.sender === this.selectedChat && msg.receiver === this.user.myID)) {
      return true;
    }
    return false;
  }

  reduceCount(msg) {
    msg.count = 0;
  }

}
