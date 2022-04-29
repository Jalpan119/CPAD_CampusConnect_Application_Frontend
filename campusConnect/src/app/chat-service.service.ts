import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  constructor(private socket: Socket) {}

  sendMessage(msg) {    
    this.socket.emit('chat message', msg);
  }
  getMessage() {
    return this.socket.fromEvent('chat message').pipe(map((data: any) => data));
  }
  getPrivateMessage() {
    return this.socket.fromEvent('private message').pipe(map((data: any) => data));
  }
}
