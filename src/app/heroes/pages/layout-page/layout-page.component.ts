import { Router } from '@angular/router';
import { User } from '../../../auth/interfaces/user.interface';
import { AuthService } from './../../../auth/services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-page',
  standalone: false,
  templateUrl: './layout-page.component.html',
  styles: ``,
})
export class LayoutPageComponent {
  public sidebarItems = [
    {
      label: 'Listado',
      icon: 'label',
      url: './list',
    },
    {
      label: 'Añadir',
      icon: 'add',
      url: './new-hero',
    },
    { label: 'Buscar', icon: 'search', url: './search' },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  get user(): User | undefined {
    return this.authService.currentUser;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
