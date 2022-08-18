import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment'

@Injectable({
    providedIn: 'root',
})

export class WebsocketService {

    // Our socket connection
    private socket: Socket;
    type: string = '4'
  
    constructor() {}

    connect(token: string, orderId: string, companyId: string, brandId: string, consumerCode: string){
        this.socket = io(environment.websocket_url+companyId+'_'+brandId, { transports: ['polling'], auth: { type: this.type, order_id: orderId, consumer_code: consumerCode, access_token: token } })
        return new Observable((subscriber) => {
            this.socket.on('connect', () => {
                if(!this.socket.disconnected){
                    //subscriber.next(data)
                    subscriber.next(this.socket)
                }
            })
        })
    }

    leave(socket?){
        if(socket){
            this.socket = socket
            return new Observable((subscriber) => {
                this.socket.emit('leave', (data) => {
                    subscriber.next(data)
                })
            })
        } else {
            if(this.socket){
                return new Observable((subscriber) => {
                    this.socket.emit('leave', (data) => {
                        subscriber.next(data)
                    })
                })
            }
            else {
                console.log('You are already disconnected')
            }
        }
    }
  
    listen(eventName: string){
            return new Observable((subscriber) => {
                this.socket.on(eventName, (data) => {
                    subscriber.next(data)
                })
            })
    }

    emit(eventName: string, data: any){
        this.socket.emit(eventName, data)
    }
}