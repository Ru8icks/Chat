import { Component, OnInit } from '@angular/core';

import { BusinessService } from '../services/business.service';

@Component({
  selector: 'app-gst-get',
  templateUrl: './gst-get.component.html',
  styleUrls: ['./gst-get.component.css']
})
export class GstGetComponent implements OnInit {

  users;

  constructor(private bs: BusinessService) { }

  ngOnInit() {
    this.bs.refresh$
      .subscribe(() => {
        this.getUsers();
      });

    this.getUsers();
  }
  private getUsers() {
    console.log('fire')
    this.bs
      .getBusinesses()
      .subscribe((data) => {
        console.log(data, 'kokoko')
        this.users = data;
      });
  }

  delete(id) {
    this.bs.deleteBusiness(id).subscribe(res => {
      console.log('Deleted');
    });
  }
}
