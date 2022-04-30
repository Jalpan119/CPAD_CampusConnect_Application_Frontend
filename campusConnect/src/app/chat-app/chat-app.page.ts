import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  toId;
  messages = [];
  alternate = false;
  constructor(private sockService: ChatServiceService,
    private route: ActivatedRoute,) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.myId = params['from'];
      this.toId = params['to'];

      this.sockService.getMessagesBetween(this.myId, this.toId).subscribe((res: any)=>{
        this.messages = res;
      });

    });
  }

  sendMessage() {
    this.alternate = !this.alternate;

    let d = new Date().toLocaleTimeString().replace(/:\d+ /, ' ');   

    this.messages.push({
      to: this.toId,
      message: this.data.message,
      from: this.myId,
      time: d
    });

    const msg = {
      to: this.toId,
      message: this.data.message,
      from: this.myId,
      time: d
    }
    this.sockService.sendMessage(msg);

    delete this.data.message;
  };

}
