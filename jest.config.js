module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Padrão corrigido para encontrar seus testes
  testMatch: ['**/src/**/*.spec.ts'],
  
  // Raiz do projeto - importante para resolver módulos
  roots: ['<rootDir>/src'],
  
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  
  // Configurações do ts-jest
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        isolatedModules: true,  // Melhora performance
      }
    ]
  },
  
  // Caminhos para arquivos de setup
  setupFiles: ['dotenv/config'],
  
  // Opcional: Configurações de cobertura
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/index.ts',
    '!src/inversify/**',
  ],
  
  // Opcional: Mapeamento de módulos (se usar paths no tsconfig)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  }
};