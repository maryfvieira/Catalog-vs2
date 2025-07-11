export class DatabaseError extends Error {
  statusCode: number;

  constructor(message: string = 'Erro ao acessar o banco de dados') {
    super(message);
    this.name = 'DatabaseError';
    this.statusCode = 500;
  }
}
