import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

interface Address {
  street: string;
  city: string;
  postalCode: string;
}

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent {
  private readonly fb = inject(FormBuilder);
  private readonly platformId = inject(PLATFORM_ID);

  addressForm: FormGroup = this.fb.group({
    street: [null, [Validators.required]],
    city: [null, [Validators.required]],
    postalCode: [null, [Validators.required, Validators.pattern(/^\d{5}$/)]]
  });

  addresses: Address[] = [];
  maxAddresses = 5;
  errorMessage = '';

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedAddresses = localStorage.getItem('addresses');
      this.addresses = storedAddresses ? JSON.parse(storedAddresses) : [];
    }
  }

  addAddress(): void {
    if (this.addressForm.valid && this.addresses.length < this.maxAddresses) {
      const newAddress = this.addressForm.value as Address;
      this.addresses.push(newAddress);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('addresses', JSON.stringify(this.addresses));
      }
      this.addressForm.reset();
    } else if (this.addresses.length >= this.maxAddresses) {
      this.errorMessage = 'Maximum of 5 addresses reached.';
    } else {
      this.addressForm.markAllAsTouched();
    }
  }
}