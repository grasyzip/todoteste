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
  /*arrayDeTarefas: Tarefa[] = [];*/
  apiURL : string;

  constructor(private http: HttpClient) {
  // CORRIGIDO: Adicionar /api nas rotas específicas ou ajustar a URL base
  this.apiURL = 'https://passionate-simplicity-production-0313.up.railway.app';
  this.READ_tarefas();
}

READ_tarefas() {
  // A URL já está correta: /api/getAll
  this.http.get<Tarefa[]>(`${this.apiURL}/api/getAll`).subscribe({
    next: (resultado) => {
      console.log('Tarefas carregadas:', resultado);
      this.arrayDeTarefas.set(resultado);
    },
    error: (erro) => {
      console.error('Erro ao carregar tarefas:', erro);
      // Mostra erro no console para debug
    }
  });
}

DELETE_tarefa(tarefaAserRemovida: Tarefa) {
  // CORRIGIDO: Usar o _id diretamente, sem indexOf
  const id = tarefaAserRemovida._id;
  console.log('Deletando tarefa com ID:', id);
  
  this.http.delete(`${this.apiURL}/api/delete/${id}`).subscribe({
    next: (resultado) => {
      console.log('Deletado com sucesso:', resultado);
      this.READ_tarefas(); // Recarrega a lista
    },
    error: (erro) => {
      console.error('Erro ao deletar:', erro);
    }
  });
}

UPDATE_tarefa(tarefaAserModificada: Tarefa) {
  // CORRIGIDO: Usar o _id diretamente
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
