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
  payload;
  picture;
  tags;
  constructor(private sockService: ChatServiceService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(){    
    this.sockService.getInitialUserData().subscribe((res: any) => {
      this.payload = res;
      this.sockService.setUserId(this.payload.email);
      this.sockService.getStudentData(this.payload.email).subscribe((res1: any)=>{
        this.sockService.setUserIdentifier(res1.userId);
        this.sockService.registerChat(this.payload.email);
        this.sockService.setPictureUrl(this.payload.pictureUrl);
        this.picture = this.payload.pictureUrl;
        this.payload = res1;        
      });
    }, (err)=>{
      this.router.navigate(['/login']);
     });  
  }

  ionViewWillEnter() {
    this.picture = this.sockService.pictureUrl;
    this.sockService.getInitialUserData().subscribe((res: any) => {
      this.payload = res;
      this.sockService.setUserId(this.payload.email);
      this.sockService.getStudentData(this.payload.email).subscribe((res1: any)=>{
        this.sockService.setUserIdentifier(res1.userId);
        this.sockService.registerChat(this.payload.email);
        this.sockService.setPictureUrl(this.payload.pictureUrl);
        this.picture = this.payload.pictureUrl;
        this.payload = res1;
      });
    }, (err)=>{
      this.router.navigate(['/login']);
     }); 
  }

  selectPerson() {

  }

  goToProfile() {
    this.router.navigate(['/tabs/tab2']);
  }

  search() {
    this.sockService.searchResults(this.searchField).subscribe((res: any)=>{
      this.searchResults = [...res[0], ...res[1]];
    });
  }

  startChat(id) {
    this.sockService.setUpChat(this.sockService.getUserId(), id);
    this.router.navigate(['tabs/tab3/chat']);
  }

}
