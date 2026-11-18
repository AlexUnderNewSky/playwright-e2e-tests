import { test, expect } from '@fixtures/api';
import { errorSchema, productListSchema, productSchema } from '@api/schemas';

test.describe('Products API', () => {
  test('returns a paginated product list', { tag: '@smoke' }, async ({ productsApi }) => {
    const response = await productsApi.list({ limit: 5, skip: 10 });

    expect(response.status()).toBe(200);
    const body = productListSchema.parse(await response.json());
    expect(body.products).toHaveLength(5);
    expect(body.skip).toBe(10);
    expect(body.limit).toBe(5);
    expect(body.products[0].id).toBe(11);
  });

  test('sorts products by price descending', async ({ productsApi }) => {
    const response = await productsApi.list({ limit: 20, sortBy: 'price', order: 'desc' });

    const { products } = productListSchema.parse(await response.json());
    const prices = products.map((product) => product.price);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('returns a single product by id', async ({ productsApi }) => {
    const response = await productsApi.getById(1);

    expect(response.status()).toBe(200);
    const product = productSchema.parse(await response.json());
    expect(product.id).toBe(1);
  });

  test('returns 404 for a non-existent product', async ({ productsApi }) => {
    const response = await productsApi.getById(999_999);

    expect(response.status()).toBe(404);
    const body = errorSchema.parse(await response.json());
    expect(body.message).toContain('not found');
  });

  test('searches products by keyword', async ({ productsApi }) => {
    const query = 'phone';
    const response = await productsApi.search(query);

    expect(response.status()).toBe(200);
    const { products, total } = productListSchema.parse(await response.json());
    expect(total).toBeGreaterThan(0);
    for (const product of products) {
      const text = `${product.title} ${product.description}`.toLowerCase();
      expect(text).toContain(query);
    }
  });

  test('filters products by category', async ({ productsApi }) => {
    const response = await productsApi.byCategory('smartphones');

    const { products } = productListSchema.parse(await response.json());
    expect(products.length).toBeGreaterThan(0);
    expect(products.every((product) => product.category === 'smartphones')).toBe(true);
  });

  test.describe('mutations', () => {
    test('creates a product', async ({ productsApi }) => {
      const payload = { title: 'Playwright Test Product', price: 99.99, category: 'testing' };

      const response = await productsApi.create(payload);

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body).toMatchObject(payload);
      expect(body.id).toEqual(expect.any(Number));
    });

    test('updates a product', async ({ productsApi }) => {
      const response = await productsApi.update(1, { title: 'Updated title' });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toMatchObject({ id: 1, title: 'Updated title' });
    });

    test('deletes a product', async ({ productsApi }) => {
      const response = await productsApi.remove(1);

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toMatchObject({ id: 1, isDeleted: true });
      expect(Date.parse(body.deletedOn)).not.toBeNaN();
    });
  });
});
