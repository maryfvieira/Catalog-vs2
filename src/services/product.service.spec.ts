// src/services/product.service.spec.ts
import { ProductService } from './product.service';
import { Product } from '../model/product';
import { IProductRepository } from '../interfaces/product-repository.interface';
import { ProductCreateDto } from '../dto/product-create.dto';
import { ProductUpdateDto } from '../dto/product-update.dto';


// Mock completo com tipagem explícita para todos os métodos
const mockProductRepository: jest.Mocked<IProductRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
  //delete: jest.fn() as jest.Mock<Promise<boolean>, [string]>,
};

describe('ProductService', () => {
  let productService: ProductService;
  
  // Dados de teste reutilizáveis
  const sampleProducts: Product[] = [
    { id: '6624b5c9a78d935e5e7d3f2a', name: 'Product 1', price: 100, description: 'Description 1' },
    { id: '6624b5c9a78d935e5e7d3f2b', name: 'Product 2', price: 200, description: 'Description 2' },
  ];
  
  const sampleCreateDto: ProductCreateDto = {
    name: 'New Product',
    price: 300,
    description: 'New Description'
  };
  
  const sampleUpdateDto: ProductUpdateDto = {
    name: 'Updated Product',
    price: 350,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    productService = new ProductService(mockProductRepository);
  });

  // Testes para getAll()
  describe('getAll', () => {
    it('deve retornar uma lista de produtos', async () => {
      mockProductRepository.findAll.mockResolvedValue(sampleProducts);
      
      const result = await productService.getAll();
      
      expect(result).toEqual(sampleProducts);
      expect(mockProductRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma lista vazia quando não houver produtos', async () => {
      mockProductRepository.findAll.mockResolvedValue([]);
      
      const result = await productService.getAll();
      
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('deve propagar erros do repositório', async () => {
      mockProductRepository.findAll.mockRejectedValue(new Error('Database error'));
      
      await expect(productService.getAll()).rejects.toThrow('Database error');
    });
  });

  // Testes para getById()
  describe('getById', () => {
    it('deve retornar um produto existente', async () => {
      const productId = '6624b5c9a78d935e5e7d3f2a';
      const expectedProduct = sampleProducts[0];
      
      mockProductRepository.findById.mockResolvedValue(expectedProduct);
      
      const result = await productService.getById(productId);
      
      expect(result).toEqual(expectedProduct);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
    });

    it('deve retornar null para ID inexistente', async () => {
      const nonExistentId = '6624b5c9a78d935e5e7d3f99';
      
      mockProductRepository.findById.mockResolvedValue(null);
      
      const result = await productService.getById(nonExistentId);
      
      expect(result).toBeNull();
    });

    it('deve lançar erro para ID inválido', async () => {
      const invalidId = 'invalid-id';
      
      mockProductRepository.findById.mockRejectedValue(new Error('Invalid ID'));
      
      await expect(productService.getById(invalidId)).rejects.toThrow('Invalid ID');
    });
  });

  // Testes para create()
  describe('create', () => {
    it('deve criar um novo produto com dados válidos', async () => {
      const expectedProduct: Product = {
        id: '6624b5c9a78d935e5e7d3f2c',
        ...sampleCreateDto
      };
      
      mockProductRepository.create.mockResolvedValue(expectedProduct);
      
      const result = await productService.create(sampleCreateDto);
      
      expect(result).toEqual(expectedProduct);
      expect(mockProductRepository.create).toHaveBeenCalledWith({
        name: sampleCreateDto.name,
        price: sampleCreateDto.price,
        description: sampleCreateDto.description
      });
    });

    it('deve criar produto sem descrição quando não for fornecida', async () => {
      const createDtoWithoutDescription: ProductCreateDto = {
          name: 'Product without description',
          price: 150,
          description: ''
      };
      
      const expectedProduct: Product = {
        id: '6624b5c9a78d935e5e7d3f2d',
        ...createDtoWithoutDescription,
        description: ''
      };
      
      mockProductRepository.create.mockResolvedValue(expectedProduct);
      
      const result = await productService.create(createDtoWithoutDescription);
      
      expect(result.description).toBe('');
    });

    it('deve rejeitar criação com dados inválidos', async () => {
      const invalidDto: any = {
        price: 'invalid-price', // Deveria ser número
        description: 12345 // Deveria ser string
      };
      
      mockProductRepository.create.mockRejectedValue(new Error('Validation failed'));
      
      await expect(productService.create(invalidDto)).rejects.toThrow('Validation failed');
    });
  });

  // Testes para update()
  describe('update', () => {
    // it('deve atualizar um produto existente', async () => {
    //   const productId = '6624b5c9a78d935e5e7d3f2a';
    //   const existingProduct = sampleProducts[0];
    //   const updatedProduct: Product = {
    //     ...existingProduct,
    //     ...sampleUpdateDto
    //   };
      
    //   mockProductRepository.findById.mockResolvedValue(existingProduct);
    //   mockProductRepository.update.mockResolvedValue(updatedProduct);
      
    //   const result = await productService.update(productId, sampleUpdateDto);
      
    //   expect(result).toEqual(updatedProduct);
    //   expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
    //   expect(mockProductRepository.update).toHaveBeenCalledWith(productId, {
    //     name: sampleUpdateDto.name,
    //     price: sampleUpdateDto.price
    //   });
    // });

    it('deve atualizar parcialmente o produto', async () => {
      const productId = '6624b5c9a78d935e5e7d3f2a';
      const existingProduct = sampleProducts[0];
      const partialUpdate: ProductUpdateDto = { price: 250 };
      const updatedProduct: Product = { ...existingProduct, price: 250 };
      
      mockProductRepository.findById.mockResolvedValue(existingProduct);
      mockProductRepository.update.mockResolvedValue(updatedProduct);
      
      const result = await productService.update(productId, partialUpdate);
      
      expect(result?.price).toBe(250);
      expect(result?.name).toBe(existingProduct.name);
      expect(mockProductRepository.update).toHaveBeenCalledWith(productId, { price: 250 });
    });

    // it('deve retornar null ao tentar atualizar produto inexistente', async () => {
    //   const nonExistentId = '6624b5c9a78d935e5e7d3f99';
      
    //   mockProductRepository.findById.mockResolvedValue(null);
      
    //   const result = await productService.update(nonExistentId, sampleUpdateDto);
      
    //   expect(result).toBeNull();
    //   expect(mockProductRepository.update).not.toHaveBeenCalled();
    // });

    it('deve lidar com atualização sem campos válidos', async () => {
      const productId = '6624b5c9a78d935e5e7d3f2a';
      const existingProduct = sampleProducts[0];
      const emptyUpdate: ProductUpdateDto = {};
      
      mockProductRepository.findById.mockResolvedValue(existingProduct);
      mockProductRepository.update.mockResolvedValue(existingProduct);
      
      const result = await productService.update(productId, emptyUpdate);
      
      expect(result).toEqual(existingProduct);
      expect(mockProductRepository.update).toHaveBeenCalledWith(productId, {});
    });
  });

  // Testes para delete() - CORRIGIDOS
//   describe('delete', () => {
//     it('deve deletar um produto existente', async () => {
//       const productId = '6624b5c9a78d935e5e7d3f2a';
      
//       mockProductRepository.delete.mockResolvedValue(true);
      
//       const result = await productService.delete(productId);
      
//       expect(result).toBe(true);
//       expect(mockProductRepository.delete).toHaveBeenCalledWith(productId);
//     });

    // it('deve retornar false ao tentar deletar produto inexistente', async () => {
    //   const nonExistentId = '6624b5c9a78d935e5e7d3f99';
      
    //   mockProductRepository.delete.mockResolvedValue(false);
      
    //   const result = await productService.delete(nonExistentId);
      
    //   expect(result).toBe(false);
    // });

    it('deve lidar com erros durante a deleção', async () => {
      const productId = '6624b5c9a78d935e5e7d3f2a';
      
      mockProductRepository.delete.mockRejectedValue(new Error('Deletion error'));
      
      await expect(productService.delete(productId)).rejects.toThrow('Deletion error');
    });
  });

  // Testes adicionais para casos de borda
//   describe('casos de borda', () => {
//     it('deve lidar com preço mínimo válido (0.01)', async () => {
//       const minimalPriceDto: ProductCreateDto = {
//           name: 'Minimal Price Product',
//           price: 0.01,
//           description: ''
//       };
      
//       const expectedProduct: Product = {
//         id: '6624b5c9a78d935e5e7d3f2e',
//         ...minimalPriceDto,
//         description: ''
//       };
      
//       mockProductRepository.create.mockResolvedValue(expectedProduct);
      
//       const result = await productService.create(minimalPriceDto);
      
//       expect(result.price).toBe(0.01);
//     });

    // it('deve atualizar descrição para string vazia', async () => {
    //   const productId = '6624b5c9a78d935e5e7d3f2a';
    //   const existingProduct = sampleProducts[0];
    //   const updateDto: ProductUpdateDto = { description: '' };
    //   const updatedProduct: Product = { ...existingProduct, description: '' };
      
    //   mockProductRepository.findById.mockResolvedValue(existingProduct);
    //   mockProductRepository.update.mockResolvedValue(updatedProduct);
      
    //   const result = await productService.update(productId, updateDto);
      
    //   expect(result?.description).toBe('');
    // });

    // it('deve ignorar campos não definidos na atualização', async () => {
    //   const productId = '6624b5c9a78d935e5e7d3f2a';
    //   const existingProduct = sampleProducts[0];
    //   const updateDto: any = {
    //     name: 'Updated Product',
    //     invalidField: 'should be ignored'
    //   };
    //   const updatedProduct: Product = {
    //     ...existingProduct,
    //     name: 'Updated Product'
    //   };
      
    //   mockProductRepository.findById.mockResolvedValue(existingProduct);
    //   mockProductRepository.update.mockResolvedValue(updatedProduct);
      
    //   const result = await productService.update(productId, updateDto);
      
    //   expect(result).toEqual(updatedProduct);
    //   expect(mockProductRepository.update).toHaveBeenCalledWith(productId, {
    //     name: 'Updated Product'
    //   });
    // });

    // it('deve lidar com atualização de apenas a descrição', async () => {
    //   const productId = '6624b5c9a78d935e5e7d3f2a';
    //   const existingProduct = sampleProducts[0];
    //   const updateDto: ProductUpdateDto = { description: 'New Description' };
    //   const updatedProduct: Product = { ...existingProduct, description: 'New Description' };
      
    //   mockProductRepository.findById.mockResolvedValue(existingProduct);
    //   mockProductRepository.update.mockResolvedValue(updatedProduct);
      
    //   const result = await productService.update(productId, updateDto);
      
    //   expect(result?.description).toBe('New Description');
    //   expect(mockProductRepository.update).toHaveBeenCalledWith(productId, {
    //     description: 'New Description'
    //   });
    // });
    
    // it('deve criar produto com descrição nula quando não for fornecida', async () => {
    //   const createDtoWithoutDescription: ProductCreateDto = {
    //       name: 'Product with null description',
    //       price: 150,
    //       description: ''
    //   };
      
    //   const expectedProduct: Product = {
    //     id: '6624b5c9a78d935e5e7d3f2f',
    //     ...createDtoWithoutDescription,
    //     description: ''
    //   };
      
    //   mockProductRepository.create.mockResolvedValue(expectedProduct);
      
    //   const result = await productService.create(createDtoWithoutDescription);
      
    //   expect(result.description).toBe('');
    // });
//   });
// });