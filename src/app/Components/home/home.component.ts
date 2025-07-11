import { Component } from '@angular/core';
import { Product } from '../../core/interfaces/product';
import { ProductService } from '../../core/Services/product.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  products: Product[] = [];
  categories: string[] = [];
  selectedCategory: string | null = null;
  error: string | null = null;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.error = null;
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again later.';
        console.error(err);
      }
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.error = null;
      },
      error: (err) => {
        this.error = 'Failed to load categories. Please try again later.';
        console.error(err);
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = this.selectedCategory
          ? products.filter(p => p.category === category)
          : products;
        this.error = null;
      },
      error: (err) => {
        this.error = 'Failed to filter products. Please try again later.';
        console.error(err);
      }
    });
  }

  clearFilter(): void {
    this.selectedCategory = null;
    this.loadProducts();
  }

  addToCart(product: Product): void {
    this.productService.addToCart(product);
    alert(`${product.title} added to cart!`);
  }
}