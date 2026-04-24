import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { Tarefa } from "./tarefa";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('TODOapp');
  @ViewChild('campoNovoItem') campoNovoItem!: ElementRef<HTMLInputElement>;

  arrayDeTarefas = signal<Tarefa[]>([]);
  apiURL: string;

  constructor(private http: HttpClient) {
    this.apiURL = 'https://apitarefasgrasielly255041.up.railway.app';
    this.READ_tarefas();
  }

  READ_tarefas() {
    this.http.get<Tarefa[]>(`${this.apiURL}/api/getAll`).subscribe({
      next: (resultado) => {
        console.log('Tarefas carregadas:', resultado);
        this.arrayDeTarefas.set(resultado);
      },
      error: (erro) => {
        console.error('Erro ao carregar tarefas:', erro);
      }
    });
  }

  CREATE_tarefa(descricao: string) {
    if (!descricao || descricao.trim() === '') {
      console.warn('Descrição vazia');
      return;
    }

    const novaTarefa = new Tarefa(descricao, false);
    
    this.http.post<Tarefa>(`${this.apiURL}/api/post`, novaTarefa).subscribe({
      next: (resultado) => {
        console.log('Tarefa criada:', resultado);
        this.READ_tarefas();
        if (this.campoNovoItem) {
          this.campoNovoItem.nativeElement.value = '';
        }
      },
      error: (erro) => {
        console.error('Erro ao criar tarefa:', erro);
      }
    });
  }

  DELETE_tarefa(tarefaAserRemovida: Tarefa) {
    const id = tarefaAserRemovida._id;
    console.log('Deletando tarefa com ID:', id);
    
    this.http.delete(`${this.apiURL}/api/delete/${id}`).subscribe({
      next: (resultado) => {
        console.log('Deletado com sucesso:', resultado);
        this.READ_tarefas();
      },
      error: (erro) => {
        console.error('Erro ao deletar:', erro);
      }
    });
  }

  UPDATE_tarefa(tarefaAserModificada: Tarefa) {
    const id = tarefaAserModificada._id;
    console.log('Atualizando tarefa com ID:', id);
    
    this.http.patch(`${this.apiURL}/api/update/${id}`, tarefaAserModificada).subscribe({
      next: (resultado) => {
        console.log('Atualizado com sucesso:', resultado);
        this.READ_tarefas();
      },
      error: (erro) => {
        console.error('Erro ao atualizar:', erro);
      }
    });
  }
}
