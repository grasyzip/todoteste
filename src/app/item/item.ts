import { Component, OnInit } from '@angular/core';
import { Tarefa } from './tarefa';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  tarefas: Tarefa[] = [];
  
  async ngOnInit() {
    await this.carregarTarefas();
  }
  
  // Carregar tarefas sem cache
  async carregarTarefas() {
    try {
      const url = 'https://passionate-simplicity-production-0313.up.railway.app/api/getAll';
      const response = await fetch(`${url}?_=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        this.tarefas = await response.json();
        console.log('Tarefas carregadas:', this.tarefas.length);
      }
    } catch (error) {
      console.error('Erro ao carregar:', error);
    }
  }
  
  // Método chamado quando confirma exclusão no modal
  async removerTarefa(tarefa: Tarefa) {
    try {
      const response = await fetch(`https://passionate-simplicity-production-0313.up.railway.app/api/delete/${tarefa.id}`, {
        method: 'DELETE',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (response.ok) {
        // Recarregar a lista após excluir
        await this.carregarTarefas();
        console.log('Tarefa excluída com sucesso');
      } else {
        console.error('Erro ao excluir:', await response.text());
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  }
}
