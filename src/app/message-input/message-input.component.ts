import { Component, OnInit } from '@angular/core';
import {ChatService} from '../services/chat.service';
import User from '../models/user';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.css']
})
export class MessageInputComponent implements OnInit {
  private selectedChat: string;
  private user: User;
  private message: string;
  private selectedMessages;
  private messages;
  private lastUpdateTime: number;
  private isTyping =  false;
  private typingInterval;

  constructor(private cs: ChatService) { }


  ngOnInit() {
    console.log('inininint messageinput')
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
  }

  sendMessage(value: string) {
    const obj = {
      nickname: this.user.nickname,
      message: value,
      receiver: this.selectedChat,
      sender: this.user.myID,
    }
    this.message = '';
    if (this.selectedChat === 'Public') {
      this.cs.sendMessage(obj);
    } else {
      this.cs.sendPrivateMessage(obj);
      this.messages.push(obj);
      this.cs.setMessages(this.messages)
      if (this.isMyMessage(obj)) {
        this.selectedMessages.push(obj);
        this.cs.selectedMessages$.next(this.selectedMessages);
      }
    }

  }
  private isMyMessage(msg) {
    if (msg.receiver === this.selectedChat || (msg.sender === this.selectedChat && msg.receiver === this.user.myID)) {
      return true;
    }
    return false;
  }

  sendTyping(event: any) {
    console.log('sendtyping is go ', event);
    this.lastUpdateTime = Date.now();
    if (!this.isTyping) {
      console.log(this.isTyping);
      this.isTyping =  true;
      this.cs.sendTyping(true);
      this.startCheckingTyping();
    }
  }

  private startCheckingTyping() {
    console.log('startchekingtyping is go ');
    this.typingInterval = setInterval( () => {
      if (Date.now() - this.lastUpdateTime > 300) {
        console.log('long time since key')
        this.isTyping = false;
        this.stopCheckingTyping();
      }
    } , 300);
  }

  private stopCheckingTyping() {
    console.log('stopcheking is go ');
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
      this.cs.sendTyping(false);
    }
  }
}
