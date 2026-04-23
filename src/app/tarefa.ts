export class Tarefa {
    _id?: string;
    descricao: string;
    statusRealizada: boolean;
    constructor(_descricao: string, _statusRealizada: boolean, _id?: string) {
        this.descricao = descricao;
    this.statusRealizada = statusRealizada;
    this._id = id;
    }
}
