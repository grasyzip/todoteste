export class Tarefa {
    _id?: string;
    descricao: string;
    statusRealizada: boolean;
    completed: boolean;
    
    constructor(descricao: string, statusRealizada: boolean, id?: string, completed: boolean = false) {
        this.descricao = descricao;
        this.statusRealizada = statusRealizada;
        this._id = id;
        this.completed = completed;
    }
}
