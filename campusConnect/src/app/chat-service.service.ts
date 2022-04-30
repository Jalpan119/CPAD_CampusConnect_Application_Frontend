import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  userId;
  constructor(private socket: Socket, private http: HttpClient) {}

  setUserId(userId) {
    this.userId = userId;
  }

  getUserId() {
    return this.userId;
  }

  sendMessage(msg) {    
    this.socket.emit('chat message', msg);
  }

  registerChat(userId) {
  this.socket.emit('registerChat', userId);
  }

  getMessage() {
    return this.socket.fromEvent('chat message').pipe(map((data: any) => data));
  }
  getPrivateMessage() {
    return this.socket.fromEvent('private message').pipe(map((data: any) => data));
  }

  nodeServerURL = 'http://localhost:8000';

  getMessagesBetween(from, to){
    const data = {
      from,
      to
    }
    return this.http.post(`${this.nodeServerURL}/allMessagesBetween`, data); 
  }

  getAllMessages(from){
    const data = {
      from
    }
    return this.http.post(`${this.nodeServerURL}/allMessages`, data); 
  }


  // web service calls
  webServiceUrl = 'http://localhost:8080/campusConnect';

  getStudentData(id) {
    return this.http.get(`${this.webServiceUrl}/getStudent?emailId=${id}`);
  }

  saveStudentData(data) {
    return this.http.post(`${this.webServiceUrl}/saveStudent`, data);
  }
  
  searchResults(search) {
    const service1 = this.http.get(`${this.webServiceUrl}/findStudentsByFirstName?name=${search}`);
    const service2 = this.http.get(`${this.webServiceUrl}/findStudentsByTag?tag=${search}`);
    return forkJoin([service1, service2]);
  }

}
