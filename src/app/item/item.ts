import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Tarefa } from "../tarefa";
import * as confetti from 'canvas-confetti';

@Component({
  selector: 'app-item',
  standalone: false,
  templateUrl: './item.html',
  styleUrl: './item.css',
})
export class Item {
  emEdicao = false;
  mostrarmodal = false;
  @Input() tarefa: Tarefa = new Tarefa("", false);
  @Output() remover = new EventEmitter<Tarefa>();
  @Output() modificaTarefa = new EventEmitter();
  @ViewChild('checkboxElement') checkboxElement!: ElementRef<HTMLInputElement>; // Referência ao checkbox

  abrirModalExclusao() {
    this.mostrarmodal = true;
  }

  cancelarExclusao() {
    this.mostrarmodal = false;
  }

  confirmarExclusao() {
    this.mostrarmodal = false;
    this.remover.emit(this.tarefa);
  }

  onRemover() {
    this.abrirModalExclusao();
  }

  // MÉTODO PRINCIPAL: Alterna o status e lança confetes
  onToggleComplete() {
    const estavaCompleta = this.tarefa.statusRealizada;
    
    // Alterna o status
    this.tarefa.statusRealizada = !this.tarefa.statusRealizada;
    
    // Se a tarefa foi COMPLETADA (marcada como true), solta confetes
    if (!estavaCompleta && this.tarefa.statusRealizada) {
      this.lancarConfeteSimples();
    }
    
    // Emite o evento para o componente pai
    this.modificaTarefa.emit();
  }

  // FUNÇÃO SIMPLES: Uma única explosão no local do checkbox
  lancarConfeteSimples() {
    // Pega a posição do checkbox na tela
    const checkboxPos = this.checkboxElement?.nativeElement.getBoundingClientRect();
    
    if (checkboxPos) {
      // Calcula o centro do checkbox
      const x = (checkboxPos.left + checkboxPos.width / 2) / window.innerWidth;
      const y = (checkboxPos.top + checkboxPos.height / 2) / window.innerHeight;
      
      // Única explosão de confetes
      confetti({
        particleCount: 80,
        spread: 45,
        origin: { x: x, y: y },
        startVelocity: 15,
        colors: ['#764ba2', '#9b6bc7', '#4a2c6b', '#27ae60', '#f39c12'],
        decay: 0.9
      });
    } else {
      // Fallback caso não consiga a posição
      confetti({
        particleCount: 80,
        spread: 45,
        origin: { y: 0.6 },
        startVelocity: 15,
        colors: ['#764ba2', '#9b6bc7', '#4a2c6b', '#27ae60', '#f39c12']
      });
    }
  }
}
