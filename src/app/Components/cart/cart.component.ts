import { Component } from '@angular/core';
import { ProductService } from '../../core/Services/product.service';
import { Product } from '../../core/interfaces/product';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartItems: (Product & { quantity: number })[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.cartItems = this.productService.getCartItems();
  }

  removeFromCart(productId: number): void {
    this.productService.removeFromCart(productId);
    this.cartItems = this.productService.getCartItems();
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  }
}