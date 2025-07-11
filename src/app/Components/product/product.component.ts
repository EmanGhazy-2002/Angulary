import { Component } from '@angular/core';
import { ProductService } from '../../core/Services/product.service';
import { Product } from '../../core/interfaces/product';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product',
  imports: [CommonModule, RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  products: Product[] = [];
  error: string | null = null;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products; // Assign the products array directly
        this.error = null;
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again later.';
        console.error('ProductCard error:', err);
      }
    });
  }

  addToCart(product: Product): void {
    this.productService.addToCart(product);
    alert(`${product.title} added to cart!`);
  }
}