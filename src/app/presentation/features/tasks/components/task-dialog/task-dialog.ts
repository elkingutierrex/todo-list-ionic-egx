import { Component, inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../../../../core/models/task.model';

export interface TaskDialogData {
  task?: Task;
}

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './task-dialog.html',
  styleUrl: './task-dialog.scss',
})
export class TaskDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TaskDialogComponent>);
  private data: TaskDialogData = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

  isEditMode = false;
  dialogTitle = 'Create New Task';
  submitButtonText = 'Add Task';
  submitButtonIcon = 'add_circle';

  taskForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['']
  });

  ngOnInit(): void {
    if (this.data?.task) {
      this.isEditMode = true;
      this.dialogTitle = 'Edit Task';
      this.submitButtonText = 'Save Changes';
      this.submitButtonIcon = 'save';
      this.taskForm.patchValue({
        title: this.data.task.title,
        description: this.data.task.description
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    const { title, description } = this.taskForm.value;

    if (this.isEditMode && this.data.task) {
      // Return updated task object
      this.dialogRef.close({ ...this.data.task, title, description });
    } else {
      // Return new task data (without ID, caller will handle creation)
      this.dialogRef.close({ title, description });
    }
  }
}
