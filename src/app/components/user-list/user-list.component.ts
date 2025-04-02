import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
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
  currentPage = 1;
  itemsPerPage = 10;

  private userService = inject(UserService);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.userService.getUsers().length === 0) {
      this.userService.getAllUsers().subscribe();
    }
    this.userService.allUsers$.subscribe(users => {
      this.allUsers = users;
      if (users.length > 0) {
        this.tableHeaders = Object.keys(users[0]).filter(header => header !== "edit");
      }
    });
  }

  enableUserEdit(userId: string, event: Event) {
    event.stopPropagation();
    this.allUsers = this.allUsers.map((user:any) =>
      user.id === userId ? { ...user, edit: true } : { ...user, edit: false }
    );
    
  }

  updateUser(userId: string) {
    const updatedUser = this.allUsers.find((user:any) => user.id === userId);
    if (updatedUser) {
      this.userService.updateUser(userId, updatedUser);
      this.allUsers = [...this.userService.getUsers()];
    }
  }

  cancelEdit() {
    this.allUsers = [...this.userService.getUsers()];
  }
  
  navigateToUserDetails(userId : string) {
    this.router.navigate(['/user-details',userId])
  }

}
