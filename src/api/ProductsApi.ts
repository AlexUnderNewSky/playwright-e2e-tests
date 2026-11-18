import { type APIRequestContext } from '@playwright/test';
import { type Product } from './schemas';

export interface ListParams {
  limit?: number;
  skip?: number;
  sortBy?: keyof Product;
  order?: 'asc' | 'desc';
}

export class ProductsApi {
  constructor(private readonly request: APIRequestContext) {}

  list(params: ListParams = {}) {
    return this.request.get('/products', { params: { ...params } });
  }

  getById(id: number) {
    return this.request.get(`/products/${id}`);
  }

  search(query: string) {
    return this.request.get('/products/search', { params: { q: query } });
  }

  byCategory(category: string) {
    return this.request.get(`/products/category/${category}`);
  }

  create(product: Partial<Product>) {
    return this.request.post('/products/add', { data: product });
  }

  update(id: number, changes: Partial<Product>) {
    return this.request.put(`/products/${id}`, { data: changes });
  }

  remove(id: number) {
    return this.request.delete(`/products/${id}`);
  }
}
