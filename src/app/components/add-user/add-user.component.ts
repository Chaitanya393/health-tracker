import {ChangeDetectionStrategy,Component, EventEmitter,Inject,Output,TemplateRef,ViewChild} from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MatTooltipDefaultOptions,
  MatTooltipModule,
} from '@angular/material/tooltip';
import {
  MatDialog,
} from '@angular/material/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  Workout,
  workoutOptions,
} from '@/app/components/add-user/add-user.model';
import { AddUserService } from '@/app/services/add-user/add-user.service';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 200,
  hideDelay: 500,
  touchendHideDelay: 800,
};

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
   
  ],
  templateUrl: './add-user.component.html',
  providers: [
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults },
  ],
  styleUrl: './add-user.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUserComponent {
  @Output() userAdded = new EventEmitter<void>();
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  constructor(
    private addUserService: AddUserService,
    public dialog: MatDialog
  ) {}

  name: string | null = null;
  workoutMinutes: number | null = null;
  workoutType: string | null = null;
  workoutOptions = workoutOptions;
  loading = false;
  error: string | null = null;

  /**
   * Handles form submission for adding a new user
   * @param form The NgForm instance
   * @returns void
   */
  async onSubmit(form: NgForm): Promise<void> {
    if (!form.valid || !this.name || !this.workoutType || !this.workoutMinutes) {
      this.error = 'Please fill in all required fields';
      return;
    }

    try {
      this.loading = true;
      this.error = null;
      
      const success = await this.addUserService.addUser(
        this.name.trim(),
        this.workoutType,
        Math.max(0, this.workoutMinutes)
      );

      if (success) {
        form.resetForm();
        this.resetForm();
        this.userAdded.emit();
        this.dialog.closeAll();
      } else {
        this.error = 'Failed to add user. Please try again.';
      }
    } catch (e) {
      this.error = 'An unexpected error occurred. Please try again.';
      console.error('Error adding user:', e);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Resets the form to its initial state
   */
  private resetForm(): void {
    this.name = null;
    this.workoutMinutes = null;
    this.workoutType = null;
    this.error = null;
  }

  /**
   * Handles dialog cancellation
   */
  onCancel(): void {
    this.resetForm();
    this.dialog.closeAll();
  }

  /**
   * Opens the add user dialog
   * @returns void
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '500px',
      disableClose: true 
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.userAdded.emit();
      }
    });
  }
}

export { Workout, workoutOptions };
