export class Tarefa {
  _id?: string;  // ← Importante: campo do MongoDB
  descricao: string;
  statusRealizada: boolean;
  
  constructor(descricao: string, statusRealizada: boolean) {
    this.descricao = descricao;
    this.statusRealizada = statusRealizada;
  }
}
