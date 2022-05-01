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
  from;
  to;
  userIdentifier;
  pictureUrl;
  constructor(private socket: Socket, private http: HttpClient) { }

  setUserId(userId) {
    this.userId = userId;
  }

  setPictureUrl(pictureUrl) {
    this.pictureUrl = pictureUrl;
  }

  getUserId() {
    return this.userId;
  }

  setUserIdentifier(id) {
    this.userIdentifier = id;
  }

  getUserIdentifier() {
    return this.userIdentifier;
  }

  setUpChat(from, to) {
    this.from = from;
    this.to = to;
  }

  resetChat() {
    this.from = undefined;
    this.to = undefined;
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

  getMessagesBetween(from, to) {
    const data = {
      from,
      to
    }
    return this.http.post(`${this.nodeServerURL}/allMessagesBetween`, data);
  }

  getAllMessages(from) {
    const data = {
      from
    }
    return this.http.post(`${this.nodeServerURL}/allMessages`, data);
  }


  // web service calls
  webServiceUrl = 'http://localhost:8080/campusConnect';

  getFullStudentData(userid, id) {
    const service1 = this.http.get(`${this.webServiceUrl}/getStudent?emailId=${userid}`, {withCredentials: true});
    const service2 = this.http.get(`${this.webServiceUrl}/getTagsOfStudent/${id}`, {withCredentials: true});
    return forkJoin([service1, service2]);
  }

  getTags(id) {
    return this.http.get(`${this.webServiceUrl}/getTagsOfStudent/${id}`, {withCredentials: true});
  }

  getStudentData(id) {
    return this.http.get(`${this.webServiceUrl}/getStudent?emailId=${id}`, {withCredentials: true});
  }


  saveStudentData(data) {
    const service1 = this.http.post(`${this.webServiceUrl}/saveStudent`, data, {withCredentials: true})
    const service2 = [];
    const tags = data.tags.split(','); 
    for(let i=0;i< tags.length;i++){
      const tag = tags[i];
     const tagData = {
        "tag": tag.trim(),
        "student":{
            "userId": this.userIdentifier
        }
      }
      const s = this.http.post(`${this.webServiceUrl}/saveTag`, tagData, {withCredentials: true});
      service2.push(s);
    }
    return forkJoin([service1, ...service2]);
  }

  searchResults(search) {
    const service1 = this.http.get(`${this.webServiceUrl}/findStudentsByFirstName?name=${search}`, {withCredentials: true});
    const service2 = this.http.get(`${this.webServiceUrl}/findStudentsByTag?tag=${search}`, {withCredentials: true});
    return forkJoin([service1, service2]);
  }

  getInitialUserData() {
    return this.http.get(`${this.webServiceUrl}/getCurrentUser`, {withCredentials: true});
  }

}
