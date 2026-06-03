import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../../core/services/auth.service';
import { TaskService } from '../../../../core/services/task.service';
import { TaskItemComponent } from '../components/task-item/task-item';
import { Task } from '../../../../core/models/task.model';
import { LoadingService } from '../../../../core/services/loading.service';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { TaskDialogComponent, TaskDialogData } from '../components/task-dialog/task-dialog';
import { SearchFilterComponent, SortOption } from '../../../shared/components/search-filter/search-filter';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule,
    MatCardModule,
    TaskItemComponent,
    Navbar,
    SearchFilterComponent
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss'
})
export class TaskListComponent implements OnInit {
  private authService = inject(AuthService);
  private taskService = inject(TaskService);
  private dialog = inject(MatDialog);
  private loadingService = inject(LoadingService);

  // Raw tasks from service
  private tasksSignal = this.taskService.tasks;

  // Local state for filter/sort
  searchTerm = signal('');
  currentSort = signal<SortOption>('date-desc');

  // Computed filtered and sorted tasks
  filteredTasks = computed(() => {
    const tasks = this.tasksSignal();
    const term = this.searchTerm().toLowerCase();
    const sort = this.currentSort();

    // 1. Filter
    let result = tasks.filter(t =>
      t.title.toLowerCase().includes(term) ||
      (t.description && t.description.toLowerCase().includes(term))
    );

    // 2. Sort
    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'status':
          return a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1;
        default:
          return 0;
      }
    });

    return result;
  });

  currentUser = this.authService.currentUser;

  ngOnInit() {
    this.loadingService.show();
    this.taskService.loadTasks();
    setTimeout(() => this.loadingService.hide(), 1000);
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
  }

  onSortChange(sort: SortOption) {
    this.currentSort.set(sort);
  }

  onToggle(task: Task) {
    this.taskService.toggleTaskCompletion(task).subscribe();
  }

  onDelete(task: Task) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.show();
        this.taskService.deleteTask(task.id).subscribe(() => {
          this.loadingService.hide();
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });

        });

      }
    });
  }

  onEdit(task: Task) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      panelClass: 'glass-dialog-panel',
      data: { task } as TaskDialogData
    });

    dialogRef.afterClosed().subscribe((result: Task | undefined) => {
      if (result) {
        this.loadingService.show();
        this.taskService.updateTask(result).subscribe(() => this.loadingService.hide());
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      panelClass: 'glass-dialog-panel'
    });

    dialogRef.afterClosed().subscribe((result: { title: string; description: string } | undefined) => {
      if (result) {
        this.loadingService.show();
        this.taskService.addTask(result).subscribe(() => this.loadingService.hide());
      }
    });
  }
}
