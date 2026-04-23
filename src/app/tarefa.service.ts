import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarefa } from './tarefa';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private apiURL = 'https://passionate-simplicity-production-0313.up.railway.app'; // URL do seu backend

  constructor(private http: HttpClient) {}

  getTarefas(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(`${this.apiURL}/getAll`);
  }

  createTarefa(tarefa: Tarefa): Observable<Tarefa> {
    return this.http.post<Tarefa>(`${this.apiURL}/post`, tarefa);
  }

  deleteTarefa(id: string): Observable<Tarefa> {
    return this.http.delete<Tarefa>(`${this.apiURL}/delete/${id}`);
  }

  updateTarefa(id: string, tarefa: Tarefa): Observable<Tarefa> {
    return this.http.patch<Tarefa>(`${this.apiURL}/update/${id}`, tarefa);
  }
}