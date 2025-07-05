import 'reflect-metadata';
import { ProductService } from '../src/services/product.service';
import { Product } from '../src/model/product';
import { ProductCreateDto } from '../src/dto/product-create.dto';
import { ProductUpdateDto } from '../src/dto/product-update.dto';
import { container } from '../src/inversify/inversify.config';
import { TYPES } from '../src/inversify/types';
import { PrismaClient } from '@prisma/client';
import { Mapper } from '../src/utils/mapper';

describe('ProductService Integration Tests', () => {
  let productService: ProductService;
  let prisma: PrismaClient;
  let testProduct: Product;

  // Configuração inicial
  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();
    
    // Configurar o container de injeção de dependência
    container.rebind(TYPES.ProductRepository).toConstantValue({
      findAll: () => prisma.product.findMany(),
      findById: (id: string) => prisma.product.findUnique({ where: { id } }),
      create: (product: Product) => prisma.product.create({ data: product }),
      update: (id: string, product: Partial<Product>) => 
        prisma.product.update({ where: { id }, data: product }),
      delete: (id: string) => 
        prisma.product.delete({ where: { id } }).then(() => {})
    });
    
    productService = container.get<ProductService>(TYPES.ProductService);
  });

  // Limpeza e preparação antes de cada teste
  beforeEach(async () => {
    // Limpar todos os produtos
    await prisma.product.deleteMany();
    
    // Criar um produto de teste
    testProduct = await prisma.product.create({
      data: {
        name: 'Test Product',
        price: 100,
        description: 'Test Description'
      }
    });
  });

  // Fechar conexão após todos os testes
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('getAll', () => {
    it('deve retornar todos os produtos', async () => {
      // Criar um segundo produto
      await prisma.product.create({
        data: {
          name: 'Second Product',
          price: 200,
          description: 'Second Description'
        }
      });

      const products = await productService.getAll();
      
      expect(products.length).toBe(2);
      expect(products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Test Product' }),
          expect.objectContaining({ name: 'Second Product' })
        ])
      );
    });

    it('deve retornar array vazio quando não houver produtos', async () => {
      await prisma.product.deleteMany();
      const products = await productService.getAll();
      
      expect(products).toEqual([]);
      expect(products.length).toBe(0);
    });
  });

  describe('getById', () => {
    it('deve retornar um produto pelo ID', async () => {
      const product = await productService.getById(testProduct.id);
      
      expect(product).not.toBeNull();
      expect(product?.id).toBe(testProduct.id);
      expect(product?.name).toBe('Test Product');
    });

    it('deve retornar null para ID inexistente', async () => {
      const nonExistentId = '000000000000000000000000';
      const product = await productService.getById(nonExistentId);
      
      expect(product).toBeNull();
    });
  });

  describe('create', () => {
    it('deve criar um novo produto com dados válidos', async () => {
      const createDto: ProductCreateDto = {
        name: 'New Product',
        price: 300,
        description: 'New Description'
      };

      const product = await productService.create(createDto);
      
      // Verificar retorno do serviço
      expect(product).toHaveProperty('id');
      expect(product.name).toBe(createDto.name);
      expect(product.price).toBe(createDto.price);
      expect(product.description).toBe(createDto.description);
      
      // Verificar se realmente foi persistido
      const dbProduct = await prisma.product.findUnique({
        where: { id: product.id }
      });
      
      expect(dbProduct).not.toBeNull();
      expect(dbProduct?.name).toBe(createDto.name);
    });

    it('deve criar produto sem descrição', async () => {
      const createDto: ProductCreateDto = {
        name: 'Product without description',
        price: 150,
        description: ''
      };

      const product = await productService.create(createDto);
      
      expect(product.description).toBe('');
      
      const dbProduct = await prisma.product.findUnique({
        where: { id: product.id }
      });
      
      expect(dbProduct?.description).toBe('');
    });

    // it('deve rejeitar criação com preço negativo', async () => {
    //   const createDto: ProductCreateDto = {
    //     name: 'Invalid Product',
    //     price: -10,
    //     description: 'Should fail'
    //   };

    //   await expect(productService.create(createDto)).rejects.toThrow();
      
    //   // Verificar que não foi criado
    //   const count = await prisma.product.count();
    //   expect(count).toBe(1); // Apenas o produto inicial
    // });
  });

  describe('update', () => {
    it('deve atualizar um produto existente', async () => {
      const updateDto: ProductUpdateDto = {
        name: 'Updated Product',
        price: 150
      };

      const updatedProduct = await productService.update(testProduct.id, updateDto);
      
      expect(updatedProduct).not.toBeNull();
      expect(updatedProduct?.name).toBe('Updated Product');
      expect(updatedProduct?.price).toBe(150);
      expect(updatedProduct?.description).toBe('Test Description');
      
      // Verificar no banco
      const dbProduct = await prisma.product.findUnique({
        where: { id: testProduct.id }
      });
      
      expect(dbProduct?.name).toBe('Updated Product');
    });

    it('deve atualizar apenas o preço', async () => {
      const updateDto: ProductUpdateDto = {
        price: 250
      };

      const updatedProduct = await productService.update(testProduct.id, updateDto);
      
      expect(updatedProduct?.price).toBe(250);
      expect(updatedProduct?.name).toBe('Test Product');
      
      const dbProduct = await prisma.product.findUnique({
        where: { id: testProduct.id }
      });
      
      expect(dbProduct?.price).toBe(250);
    });

    // it('deve retornar null ao tentar atualizar produto inexistente', async () => {
    //   const nonExistentId = '000000000000000000000000';
    //   const updateDto: ProductUpdateDto = {
    //     name: 'Updated Product'
    //   };
      
    //   const result = await productService.update(nonExistentId, updateDto);
      
    //   expect(result).toBeNull();
    // });

    // it('deve rejeitar atualização com preço negativo', async () => {
    //   const updateDto: ProductUpdateDto = {
    //     price: -100
    //   };

    //   await expect(productService.update(testProduct.id, updateDto)).rejects.toThrow();
      
    //   // Verificar que não foi atualizado
    //   const dbProduct = await prisma.product.findUnique({
    //     where: { id: testProduct.id }
    //   });
      
    //   expect(dbProduct?.price).toBe(100);
    // });
  });

  describe('delete', () => {
    it('deve deletar um produto existente', async () => {
      await productService.delete(testProduct.id);
      
      // Verificar se foi removido
      const dbProduct = await prisma.product.findUnique({
        where: { id: testProduct.id }
      });
      
      expect(dbProduct).toBeNull();
    });

    it('deve lançar erro ao tentar deletar produto inexistente', async () => {
      const nonExistentId = '000000000000000000000000';
      
      await expect(productService.delete(nonExistentId)).rejects.toThrow();
    });
  });

  describe('Mapper', () => {
    it('deve converter DTO para entidade corretamente', () => {
      const createDto: ProductCreateDto = {
        name: 'Mapped Product',
        price: 500,
        description: 'Mapper Test'
      };

      const product = Mapper.toEntity(createDto, Product);
      
      expect(product).toBeInstanceOf(Product);
      expect(product.name).toBe('Mapped Product');
      expect(product.price).toBe(500);
      expect(product.description).toBe('Mapper Test');
    });

    it('deve converter string numérica para número', () => {
      const createDto: any = {
        name: 'String Price Product',
        price: '150.75',
        description: 'String to number'
      };

      const product = Mapper.toEntity(createDto, Product);
      
      expect(typeof product.price).toBe('number');
      expect(product.price).toBe(150.75);
    });
  });
});