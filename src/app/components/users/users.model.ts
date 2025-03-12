import { Workout } from '@/app/components/add-user/add-user.model';

export interface User {
  id: number;
  name: string;
  email?: string;
  role?: string;
  workouts: Array<{
    type: string;
    minutes: number;
  }>;
  totalWorkouts: number;
  totalMinutes: number;
}
