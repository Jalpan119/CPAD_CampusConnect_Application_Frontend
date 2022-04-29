import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatAppPageRoutingModule } from './chat-app-routing.module';

import { ChatAppPage } from './chat-app.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatAppPageRoutingModule
  ],
  declarations: [ChatAppPage]
})
export class ChatAppPageModule {}
