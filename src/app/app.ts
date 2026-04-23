import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { Tarefa } from "./tarefa";
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    // Headers anti-cache
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
    
    // Adicionar timestamp para forçar refresh
    this.http.get<Tarefa[]>(`${this.apiURL}/api/getAll?_=${Date.now()}`, { headers })
      .subscribe({
        next: (resultado) => {
          console.log('✅ Tarefas carregadas:', resultado.length);
          this.arrayDeTarefas.set(resultado);
        },
        error: (erro) => {
          console.error('❌ Erro ao carregar:', erro);
          // Tentar novamente após 1 segundo
          setTimeout(() => this.READ_tarefas(), 1000);
        }
      });
  }

  CREATE_tarefa(descricaoNovaTarefa: string) {
    if (!descricaoNovaTarefa.trim()) return;
    
    var novaTarefa = new Tarefa(descricaoNovaTarefa, false);
    this.http.post<Tarefa>(`${this.apiURL}/api/post`, novaTarefa)
      .subscribe({
        next: (resultado) => { 
          console.log('✅ Tarefa criada:', resultado);
          this.READ_tarefas(); // Recarrega a lista
        },
        error: (erro) => console.error('❌ Erro ao criar:', erro)
      });
  }

  DELETE_tarefa(tarefaAserRemovida: Tarefa) {
    // CORREÇÃO IMPORTANTE: Usar o _id diretamente
    const id = tarefaAserRemovida._id;
    
    if (!id) {
      console.error('❌ ID não encontrado na tarefa:', tarefaAserRemovida);
      alert('Erro: ID da tarefa não encontrado');
      return;
    }
    
    console.log('🗑️ Deletando tarefa ID:', id);
    
    this.http.delete<Tarefa>(`${this.apiURL}/api/delete/${id}`)
      .subscribe({
        next: (resultado) => { 
          console.log('✅ Tarefa deletada:', resultado);
          
          // Atualizar a lista SEM esperar o backend
          const listaAtualizada = this.arrayDeTarefas().filter(t => t._id !== id);
          this.arrayDeTarefas.set(listaAtualizada);
          
          // Depois confirmar com o backend
          this.READ_tarefas();
        },
        error: (erro) => {
          console.error('❌ Erro ao deletar:', erro);
          alert('Erro ao deletar tarefa. Tente novamente.');
          this.READ_tarefas(); // Tenta recarregar
        }
      });
  }

  UPDATE_tarefa(tarefaAserModificada: Tarefa) {
    const id = tarefaAserModificada._id;
    
    if (!id) {
      console.error('❌ ID não encontrado para update:', tarefaAserModificada);
      return;
    }
    
    console.log('✏️ Atualizando tarefa ID:', id);
    
    this.http.patch<Tarefa>(`${this.apiURL}/api/update/${id}`, tarefaAserModificada)
      .subscribe({
        next: (resultado) => { 
          console.log('✅ Tarefa atualizada:', resultado);
          this.READ_tarefas();
        },
        error: (erro) => console.error('❌ Erro ao atualizar:', erro)
      });
  }
}
