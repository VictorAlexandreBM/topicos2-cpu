import { Injectable } from '@angular/core';
import BaseCrudService from '@core/services/base-crud.service';
import { Socket, SocketFormRequest } from '../models/socket.model';

@Injectable({
  providedIn: 'root',
})
export default class SocketService extends BaseCrudService<Socket, SocketFormRequest> {
  protected readonly recurso = 'sockets';
}
