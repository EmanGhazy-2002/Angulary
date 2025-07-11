import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<{ products: Product[] }>(this.apiUrl).pipe(
      map(response => response.products), // Extract the 'products' array
      catchError(err => {
        console.error('Error fetching products:', err);
        return throwError(() => new Error('Failed to fetch products'));
      })
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        console.error(`Error fetching product with ID ${id}:`, err);
        return throwError(() => new Error(`Failed to fetch product ${id}`));
      })
    );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`).pipe(
      catchError(err => {
        console.error('Error fetching categories:', err);
        return throwError(() => new Error('Failed to fetch categories'));
      })
    );
  }

  addToCart(product: Product): void {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: Product & { quantity: number }) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  getCartItems(): (Product & { quantity: number })[] {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }

  getCartItemCount(): number {
    const cart = this.getCartItems();
    return cart.reduce((count, item) => count + (item.quantity || 1), 0);
  }

  removeFromCart(productId: number): void {
    let cart = this.getCartItems();
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}