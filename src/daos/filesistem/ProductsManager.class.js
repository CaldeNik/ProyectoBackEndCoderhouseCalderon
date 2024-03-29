import fs from 'fs';
import { v4 as uuidV4 } from 'uuid';

const path = 'src/classes/files/products.json';

export default class ProductManager {
  async findProduct(limit) {
    if (fs.existsSync(path)) {
      const data = await fs.promises.readFile(path, 'utf-8');
      const products = JSON.parse(data);

      if (limit) {
        return products.slice(0, limit);
      }

      return products;
    } else {
      return [];
    }
  }

  async createProduct(info) {
    const products = await this.findProduct();
    info.id = uuidV4();
    products.push(info);
    await fs.promises.writeFile(path, JSON.stringify(products, null, '\t'));
    return info;
  }

  async deleteProduct(id) {
    const products = await this.findProduct();
    const filteredProducts = products.filter((product) => {
      return product.id != id;
    });
    await fs.promises.writeFile(path, JSON.stringify(filteredProducts, null, '\t'));
  }

  async findProductById(id) {
    const products = await this.findProduct();
    const searchProduct = products.find((product) => {
      return product.id == id;
    });
    return searchProduct ? searchProduct : 'Product not found';
  }

  async updateProduct(id, updatedData) {
    const products = await this.findProduct();
    const index = products.findIndex((product) => product.id === id);

    if (index !== -1) {
      products[index] = { ...products[index], ...updatedData };
      await fs.promises.writeFile(path, JSON.stringify(products, null, '\t'));
      return products[index];
    } else {
      return null;
    }
  }
}
