import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatServiceService } from '../chat-service.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  constructor(private sockService: ChatServiceService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(){
    const msg = {
      to: 1,
      msg: 'hello',
      from: 0
    };
    this.sockService.sendMessage(msg);
    this.sockService.getMessage().subscribe(res=>{
      console.log('received message ', res);
    });
    this.sockService.getPrivateMessage().subscribe(res=>{
      console.log('received message ', res);
    });
    const id = this.route.snapshot.paramMap.get('id');
    console.log('id: ', id);
    const token = this.route.snapshot.queryParamMap.get('token');
    console.log('token: ', token);
  }


  goToChat() {
    this.router.navigate(['/chat']);
  }

}
