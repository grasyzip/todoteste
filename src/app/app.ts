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
    this.apiURL = 'https://passionate-simplicity-production-0313.up.railway.app';
    this.READ_tarefas();
  }

  READ_tarefas() {
    // Adicionar timestamp para evitar cache
    this.http.get<Tarefa[]>(`${this.apiURL}/api/getAll?_=${Date.now()}`).subscribe({
      next: (resultado) => {
        this.arrayDeTarefas.set(resultado);
        console.log('Tarefas carregadas:', resultado);
      },
      error: (erro) => {
        console.error('Erro ao carregar tarefas:', erro);
      }
    });
  }

  CREATE_tarefa(descricaoNovaTarefa: string) {
    var novaTarefa = new Tarefa(descricaoNovaTarefa, false);
    this.http.post<Tarefa>(`${this.apiURL}/api/post`, novaTarefa).subscribe({
      next: (resultado) => { 
        console.log('Tarefa criada:', resultado); 
        this.READ_tarefas(); 
      },
      error: (erro) => console.error('Erro ao criar:', erro)
    });
  }

  DELETE_tarefa(tarefaAserRemovida: Tarefa) {
    // CORREÇÃO: Usar o ID diretamente da tarefa
    const id = tarefaAserRemovida._id || tarefaAserRemovida.id;
    
    if (!id) {
      console.error('ID da tarefa não encontrado:', tarefaAserRemovida);
      return;
    }
    
    console.log('Deletando tarefa com ID:', id);
    
    this.http.delete<Tarefa>(`${this.apiURL}/api/delete/${id}`).subscribe({
      next: (resultado) => { 
        console.log('Tarefa deletada:', resultado); 
        this.READ_tarefas(); // Recarrega a lista
      },
      error: (erro) => {
        console.error('Erro ao deletar:', erro);
        // Mostrar erro para o usuário
        alert('Erro ao deletar tarefa. Verifique o console.');
      }
    });
  }

  UPDATE_tarefa(tarefaAserModificada: Tarefa) {
    const id = tarefaAserModificada._id || tarefaAserModificada.id;
    
    if (!id) {
      console.error('ID da tarefa não encontrado:', tarefaAserModificada);
      return;
    }
    
    this.http.patch<Tarefa>(`${this.apiURL}/api/update/${id}`, tarefaAserModificada).subscribe({
      next: (resultado) => { 
        console.log('Tarefa atualizada:', resultado); 
        this.READ_tarefas(); 
      },
      error: (erro) => console.error('Erro ao atualizar:', erro)
    });
  }
}
