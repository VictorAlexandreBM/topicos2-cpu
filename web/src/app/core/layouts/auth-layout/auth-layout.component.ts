import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      <div class="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-8">
        <div class="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
          </svg>
        </div>
        <h2 class="mt-4 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          ACME CPU
        </h2>
      </div>

      <div class="sm:mx-auto sm:w-full sm:max-w-3/5">
        <div class="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
          <router-outlet></router-outlet>
        </div>
      </div>

    </div>
  `
})
export class AuthLayoutComponent {}
