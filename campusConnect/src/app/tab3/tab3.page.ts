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
  constructor(private sockService: ChatServiceService,
    private route: ActivatedRoute,
    private router: Router) {}
  
  ngOnInit(){
    // const msg = {
    //   to: 1,
    //   msg: 'hello',
    //   from: 0
    // };
    // this.sockService.sendMessage(msg);
    // this.sockService.getMessage().subscribe(res=>{
    //   console.log('received message ', res);
    // });
    // this.sockService.getPrivateMessage().subscribe(res=>{
    //   console.log('received message ', res);
    // });
    this.getAllMessages();
  }

  getAllMessages() {
    this.sockService.getAllMessages(this.sockService.getUserId()).subscribe(res=>{
      this.messages = res;
      console.log(this.messages);
    });
  }

  goToChat(id) {
    this.router.navigate(['/chat', {from: this.sockService.getUserId(), to: id}]);
  }

}
