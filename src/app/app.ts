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
  filtroAtual: string = 'todas';

  constructor(private http: HttpClient) {
    this.apiURL = 'https://passionate-simplicity-production-0313.up.railway.app';
    this.READ_tarefas();
  }

  // Ordenar tarefas (importantes no topo)
  ordenarTarefas(tarefas: Tarefa[]): Tarefa[] {
    return [...tarefas].sort((a, b) => {
      // Importantes primeiro
      if (a.importante && !b.importante) return -1;
      if (!a.importante && b.importante) return 1;
      
      // Depois não realizadas
      if (a.statusRealizada !== b.statusRealizada) {
        return a.statusRealizada ? 1 : -1;
      }
      
      // Por fim, por ID (ordem de criação)
      return (a._id || '').localeCompare(b._id || '');
    });
  }

  // Filtrar tarefas
  tarefasFiltradas(): Tarefa[] {
    let tarefas = this.arrayDeTarefas();
    
    switch(this.filtroAtual) {
      case 'importantes':
        return tarefas.filter(t => t.importante === true);
      case 'normais':
        return tarefas.filter(t => t.importante !== true);
      default:
        return tarefas;
    }
  }

  // Mudar filtro
  mudarFiltro(filtro: string) {
    this.filtroAtual = filtro;
    console.log('Filtro alterado para:', filtro);
  }

  READ_tarefas() {
    this.http.get<Tarefa[]>(`${this.apiURL}/api/getAll`).subscribe({
      next: (resultado) => {
        console.log('Tarefas carregadas:', resultado);
        // Garantir que todas as tarefas tenham a propriedade 'importante'
        const tarefasComImportante = resultado.map(t => {
          if (t.importante === undefined) {
            t.importante = false;
          }
          return t;
        });
        const tarefasOrdenadas = this.ordenarTarefas(tarefasComImportante);
        this.arrayDeTarefas.set(tarefasOrdenadas);
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

    const novaTarefa = new Tarefa(descricao, false, undefined, false, false);
    
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
    console.log('Atualizando tarefa com ID:', id, 'Importante:', tarefaAserModificada.importante);
    
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
