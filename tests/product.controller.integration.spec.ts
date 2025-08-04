// tests/product.controller.integration.spec.ts
import { test, expect, request } from '@playwright/test';

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'http://localhost'

//const baseURL = `http://127.0.0.1:${port}` 
const baseURL = `${host}:${port}`;

// Dados mock para criar e atualizar produtos
const newProduct = {
  name: 'Produto Teste',
  price: 99.99,
  description: 'Descrição do produto teste'
};

const updatedProduct = {
  name: 'Produto Atualizado',
  price: 149.99,
  description: 'Nova descrição atualizada'
};

let createdProductId: string;

test.beforeAll(async () => {
  // Configuração antes de todos os testes
  console.log(`Preparando ambiente de testes para a API de produtos em ${baseURL}`);  
});

test.describe('ProductController REST API', () => {

//   test('Forçar falha de teste para gerar relatório', async () => {
//   expect(1).toBe(2);
// });

  test('GET /products - deve retornar lista de produtos (possivelmente vazia)', async ({ request }) => {
    
    const url = `${baseURL}/product/all`
    console.log(`Testando endpoint GET em: ${url}`);
    const response = await request.get(url);
    console.log(`Status da resposta: ${response}`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('POST /products - deve criar um produto', async ({ request }) => {
    console.log(`Testando endpoint GET ${baseURL}/product`);

    const response = await request.post(`${baseURL}/product`, {
      data: newProduct
    });

    expect(response.status()).toBe(200);
    const created = await response.json();
    expect(created).toHaveProperty('id');
    expect(created.name).toBe(newProduct.name);
    createdProductId = created.id;
  });

  // test('GET /product/:id - deve buscar produto por id', async ({ request }) => {
  //   const response = await request.get(`${baseURL}/product/${createdProductId}`);
  //   expect(response.status()).toBe(200);
  //   const product = await response.json();
  //   expect(product.id).toBe(createdProductId);
  // });

  // test('PUT /product/:id - deve atualizar um produto', async ({ request }) => {
  //   const response = await request.put(`${baseURL}/product/${createdProductId}`, {
  //     data: updatedProduct
  //   });
  //   expect(response.status()).toBe(200);
  //   const updated = await response.json();
  //   expect(updated.name).toBe(updatedProduct.name);
  //   expect(updated.description).toBe(updatedProduct.description);
  // });

  // test('DELETE /product/:id - deve deletar um produto', async ({ request }) => {
  //   const response = await request.delete(`${baseURL}/product/${createdProductId}`);
  //   expect(response.status()).toBe(200);
  // });

  // test('GET /products/:id - produto deletado deve retornar 404 ou null', async ({ request }) => {
  //   const response = await request.get(`${baseURL}/product/111111`);
  //   expect([200, 404]).toContain(response.status());
  //   if (response.status() === 200) {
  //     const data = await response.json();
  //     expect(data).toBeNull();
  //   }
  // });
});
