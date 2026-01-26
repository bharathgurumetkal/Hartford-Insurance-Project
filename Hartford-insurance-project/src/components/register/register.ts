import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../auth/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  fullName = '';
  email = '';
  password = '';
  role = '';
  showPassword = false;

  constructor(private auth: Auth, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  register() {

    if (!this.fullName || !this.email || !this.password || !this.role) {
      alert("Please fill all fields");
      return;
    }

    // Check duplicate email
    this.auth.checkEmailExists(this.email, (exists) => {

      if (exists) {
        alert("Email already registered. Please login.");
        return;
      }

      // Register new user
      this.auth.register(this.fullName, this.email, this.password, this.role, (success) => {

        if (success) {
          alert("Registration Successful! Please Login.");
          this.router.navigate(['/login']);
        } else {
          alert("Registration Failed!");
        }

      });
    });
  }
}
