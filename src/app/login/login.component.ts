import { Component, OnInit } from '@angular/core';
import {ChatService} from '../services/chat.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private chatForm: FormGroup;
  private nicknameTaken: boolean;

  constructor(private fb: FormBuilder,
              private cs: ChatService,
              private ds: DataService) { }

  ngOnInit() {
    this.createForm();
    this.ds.nicknametaken$
      .subscribe((value) => {
        this.nicknameTaken = value;
      });
  }
  createForm() {
    this.chatForm = this.fb.group({
      nickname: ['', Validators.required],
    });

  }

  enterChat(value: string) {
    this.cs.addMember(value);
  }
}
