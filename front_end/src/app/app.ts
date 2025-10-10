import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBar } from './side-bar/side-bar';
import { NavBarComponent } from './nav-bar/nav-bar';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SideBar, NavBarComponent, MatIconModule, MatDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('01Blog_front');
  isExpanded = false;

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }
  onScroll(event: any): void {
  const element = event.target;
  alert("ss")
  if (element.scrollHeight - element.scrollTop === element.clientHeight) {
  }
}

}

