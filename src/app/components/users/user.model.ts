import { Workout } from '../add-user/add-user.model';

export interface User {
  name: string;
  workouts: Workout[];
  totalWorkouts: number;
  totalMinutes: number;
} 