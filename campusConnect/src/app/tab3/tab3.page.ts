import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatServiceService } from '../chat-service.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  messages;
  messageHeaders;
  constructor(private sockService: ChatServiceService,
    private route: ActivatedRoute,
    private router: Router) {}
  
  ngOnInit(){
  }

  ionViewWillEnter() {
    this.getAllMessages();
  }

  getAllMessages() {
    this.sockService.getAllMessages(this.sockService.getUserId()).subscribe(res=>{
      this.messages = res;
      this.messageHeaders = Object.keys(res);
      console.log(this.messages);
    });
  }

  goToChat(id) {
    this.sockService.setUpChat(this.sockService.getUserId(), id);
    this.router.navigate(['tabs/tab3/chat']);
  }

}
