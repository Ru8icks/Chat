import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GstGetComponent } from './gst-get/gst-get.component';
import { ChatComponent} from './chat/chat.component';

const routes: Routes = [
  {
    path: 'business',
    component: GstGetComponent
  },
  {
    path: 'chat',
    component: ChatComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
