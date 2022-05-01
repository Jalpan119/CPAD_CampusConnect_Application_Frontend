import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatAppPage } from './chat-app.page';

const routes: Routes = [
  {
    path: '',
    component: ChatAppPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatAppPageRoutingModule {}
