import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatToolbar, MatIconModule,MatBadge,CommonModule],
  templateUrl: './nav-bar.html',
  styleUrls: ['./nav-bar.css']
})
export class NavBarComponent {
  @Input() expanded = false;
  @Output() menuToggle = new EventEmitter<void>();
  constructor(public UserService: UserService){
    UserService.fetchUser();

  }
}
