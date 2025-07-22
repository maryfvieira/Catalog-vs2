const TYPES = {
    ProductService: Symbol.for('ProductService'),
    ProductRepository: Symbol.for('ProductRepository'),
    Logger: Symbol.for('Logger'),
    PrismaClient: Symbol.for('PrismaClient'), // Novo binding
  };
  
  export { TYPES };