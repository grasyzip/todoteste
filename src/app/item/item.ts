import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Tarefa } from "../tarefa";

@Component({
  selector: 'app-item',
  standalone: false,
  templateUrl: './item.html',
  styleUrl: './item.css',
})
export class Item {
  emEdicao = false;
  mostrarmodal = false;
  @Input() tarefa: Tarefa = new Tarefa ("", false);
  @Output() remover = new EventEmitter<Tarefa>();
  @Output() modificaTarefa = new EventEmitter();

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
    this.remover.emit(this.tarefa);
  }
}
