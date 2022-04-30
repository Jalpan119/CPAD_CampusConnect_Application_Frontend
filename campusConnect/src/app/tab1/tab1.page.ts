import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatServiceService } from '../chat-service.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  searchField = '';
  searchResults = [];
  constructor(private sockService: ChatServiceService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(){
    const id = this.route.snapshot.paramMap.get('id');
    console.log('id: ', id);
    if(id && !this.sockService.getUserId()) {
      this.sockService.setUserId(id);
      this.sockService.registerChat(id);
    }    
  }

  selectPerson() {

  }

  search() {
    this.sockService.searchResults(this.searchField).subscribe((res: any)=>{
      this.searchResults = [...res[0], ...res[1]];
    });
  }

  startChat(id) {
    this.router.navigate(['/chat', {from: this.sockService.getUserId(), to: id}]);
  }

}
