import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { TrimPipe } from "../../pipes/trim.pipe";
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-list',
  imports: [CommonModule,NgxPaginationModule, FormsModule, TrimPipe],
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit{

  allUsers: any = [];
  tableHeaders: string[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;

  private userService = inject(UserService);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.userService.getUsers().length === 0) {
      this.userService.getAllUsers().subscribe();
    }
    this.userService.allUsers$.subscribe(users => {
      this.allUsers = users;
      if (users.length > 0) {
        this.tableHeaders = Object.keys(users[0]).filter(header => header !== "edit"  && header !== "index");
      }
    });
  }

  enableUserEdit(index: number, event: Event) {
    event.stopPropagation();
    this.allUsers = this.allUsers.map((user: any) =>
      user.index === index ? { ...user, edit: true } : { ...user, edit: false }
    );
  }

  updateUser(index: number) {
    const updatedUser = this.allUsers.find((user: any) => user.index === index);
    if (updatedUser) {
      this.userService.updateUserByIndex(index, updatedUser);
      this.allUsers = [...this.userService.getUsers()];
    }
  }

  cancelEdit() {
    this.allUsers = [...this.userService.getUsers()];
  }
  
  navigateToUserDetails(index: number) {
    this.router.navigate(['/user-details', index]);
  }

}
