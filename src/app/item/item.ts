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
  @Input() tarefa: Tarefa = new Tarefa("", false);
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
    this.abrirModalExclusao();
  }

  // Método principal
  onToggleComplete(event: any) {
    const estavaCompleta = this.tarefa.statusRealizada;
    
    // Alterna o status
    this.tarefa.statusRealizada = !this.tarefa.statusRealizada;
    
    // Se a tarefa foi COMPLETADA, solta confetes
    if (!estavaCompleta && this.tarefa.statusRealizada) {
      this.lancarConfetesDoCheckbox(event);
    }
    
    // Emite o evento para o componente pai
    this.modificaTarefa.emit();
  }

  // Função de confetes que recebe o evento do clique
  lancarConfetesDoCheckbox(event: any) {
    // Pega a posição do checkbox a partir do evento
    const checkbox = event.target;
    const rect = checkbox.getBoundingClientRect();
    
    // Centro do checkbox
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Cores dos confetes
    const cores = ['#764ba2', '#9b6bc7', '#4a2c6b', '#27ae60', '#f39c12', '#e74c3c', '#3498db'];
    
    // Criar 50 partículas
    for (let i = 0; i < 50; i++) {
      this.criarParticula(centerX, centerY, cores);
    }
  }

  // Função para criar uma partícula individual
  criarParticula(x: number, y: number, cores: string[]) {
    const particula = document.createElement('div');
    
    // Estilo da partícula
    particula.style.position = 'fixed';
    particula.style.width = Math.random() * 8 + 4 + 'px';
    particula.style.height = particula.style.width;
    particula.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
    particula.style.borderRadius = '50%';
    particula.style.pointerEvents = 'none';
    particula.style.zIndex = '9999';
    particula.style.left = x + 'px';
    particula.style.top = y + 'px';
    
    document.body.appendChild(particula);
    
    // Direção aleatória
    const angulo = Math.random() * Math.PI * 2;
    const velocidade = Math.random() * 150 + 50;
    const vx = Math.cos(angulo) * velocidade;
    const vy = Math.sin(angulo) * velocidade - 80;
    
    let posX = x;
    let posY = y;
    let opacidade = 1;
    let gravidade = 0.5;
    
    // Animação
    const animar = () => {
      posX += vx * 0.02;
      posY += vy * 0.02;
      opacidade -= 0.02;
      gravidade += 0.02;
      
      particula.style.left = posX + 'px';
      particula.style.top = posY + 'px';
      particula.style.opacity = opacidade.toString();
      particula.style.transform = `scale(${opacidade})`;
      
      if (opacidade > 0) {
        requestAnimationFrame(animar);
      } else {
        particula.remove();
      }
    };
    
    requestAnimationFrame(animar);
  }
}
