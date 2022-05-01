import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatServiceService } from '../../chat-service.service';

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
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.sockService.getPrivateMessage().subscribe(msg=>{
      console.log('received ', msg);
      this.sockService.getMessagesBetween(this.myId, this.toId).subscribe((res: any)=>{
        this.messages = res;
        console.log(this.messages);
      });
    });
  }

  ionViewWillEnter() {
    this.myId = this.sockService.from;
    this.toId = this.sockService.to;
    this.sockService.getMessagesBetween(this.myId, this.toId).subscribe((res: any)=>{
      this.messages = res;
      console.log(this.messages);
    });
    if(!this.sockService.getUserId()) {
      this.router.navigate(['/tabs/tab1/']);
    }
  }

  sendMessage() {
    this.alternate = !this.alternate;

    let d = new Date().toLocaleTimeString().replace(/:\d+ /, ' ');   
    const msg = {
      to: this.toId,
      message: this.data.message,
      from: this.myId,
      time: d
    }
    this.sockService.sendMessage(msg);

    delete this.data.message;

    this.sockService.getMessagesBetween(this.myId, this.toId).subscribe((res: any)=>{
      this.messages = res;
      console.log(this.messages);
    });

  };

}
