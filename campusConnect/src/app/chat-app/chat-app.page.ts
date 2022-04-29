import { Component, OnInit } from '@angular/core';
import { ChatServiceService } from '../chat-service.service';

@Component({
  selector: 'app-chat-app',
  templateUrl: './chat-app.page.html',
  styleUrls: ['./chat-app.page.scss'],
})
export class ChatAppPage implements OnInit {

  data = {
    message: ''
  };
  myId = '12345';
  messages = [];
  alternate = false;
  constructor(private sockService: ChatServiceService) { }

  ngOnInit() {
  }

  sendMessage() {
    this.alternate = !this.alternate;

    let d = new Date().toLocaleTimeString().replace(/:\d+ /, ' ');   

    this.messages.push({
      userId: this.alternate ? '12345' : '54321',
      text: this.data.message,
      time: d
    });

    const msg = {
      to: 1,
      message: this.data.message,
      from: 0
    }
    this.sockService.sendMessage(msg);

    delete this.data.message;
  };

}
