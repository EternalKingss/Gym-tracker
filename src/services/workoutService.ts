import { supabase, DbWorkoutSession, DbProgression, DbExercise } from '../lib/supabase';
import { secureStorage } from '../utils/secureStorage';

// Workout progression interface
export interface WorkoutProgression {
  currentWeek: number;
  completedDays: number[];
}

// Workout history interface
export interface WorkoutHistory {
  date: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight: number;
  }[];
}

class WorkoutService {
  /**
   * Get user's workout progression
   */
  async getProgression(userId: string): Promise<WorkoutProgression> {
    // Try to get from backend first
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('user_progression')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 = no rows returned
          console.error('Error fetching progression:', error);
        }

        if (data) {
          const progression = {
            currentWeek: data.current_week,
            completedDays: data.completed_days || [],
          };

          // Sync to localStorage as backup
          secureStorage.setItem(`progression_${userId}`, progression);

          return progression;
        }
      } catch (error) {
        console.error('Error fetching progression from backend:', error);
      }
    }

    // Fallback to localStorage
    const localProgression = secureStorage.getItem<WorkoutProgression>(`progression_${userId}`);
    return localProgression || { currentWeek: 1, completedDays: [] };
  }

  /**
   * Update user's workout progression
   */
  async updateProgression(userId: string, progression: WorkoutProgression): Promise<void> {
    // Save to localStorage first (immediate)
    secureStorage.setItem(`progression_${userId}`, progression);

    // Sync to backend
    if (supabase) {
      try {
        const { error } = await supabase
          .from('user_progression')
          .upsert({
            user_id: userId,
            current_week: progression.currentWeek,
            completed_days: progression.completedDays,
            updated_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Error updating progression in backend:', error);
        }
      } catch (error) {
        console.error('Error syncing progression to backend:', error);
      }
    }
  }

  /**
   * Save a completed workout session
   */
  async saveWorkoutSession(
    userId: string,
    week: number,
    day: number,
    dayName: string,
    exercises: DbExercise[],
    startTime: Date,
    endTime: Date
  ): Promise<void> {
    const sessionData = {
      date: endTime.toISOString(),
      exercises: exercises.map((ex) => ({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
      })),
    };

    // Save to localStorage
    const key = `workoutHistory_${userId}`;
    const history = secureStorage.getItem<WorkoutHistory[]>(key) || [];
    history.push(sessionData);
    secureStorage.setItem(key, history);

    // Sync to backend
    if (supabase) {
      try {
        const { error } = await supabase.from('workout_sessions').insert({
          user_id: userId,
          week,
          day,
          day_name: dayName,
          exercises: exercises,
          started_at: startTime.toISOString(),
          completed_at: endTime.toISOString(),
        });

        if (error) {
          console.error('Error saving workout session to backend:', error);
        }
      } catch (error) {
        console.error('Error syncing workout session to backend:', error);
      }
    }
  }

  /**
   * Get workout history for a user
   */
  async getWorkoutHistory(userId: string): Promise<WorkoutHistory[]> {
    // Try to get from backend first
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('completed_at', { ascending: true });

        if (error) {
          console.error('Error fetching workout history:', error);
        }

        if (data && data.length > 0) {
          const history: WorkoutHistory[] = data.map((session: DbWorkoutSession) => ({
            date: session.completed_at,
            exercises: session.exercises.map((ex: DbExercise) => ({
              name: ex.name,
              sets: ex.sets,
              reps: ex.reps,
              weight: ex.weight,
            })),
          }));

          // Sync to localStorage as backup
          secureStorage.setItem(`workoutHistory_${userId}`, history);

          return history;
        }
      } catch (error) {
        console.error('Error fetching workout history from backend:', error);
      }
    }

    // Fallback to localStorage
    const localHistory = secureStorage.getItem<WorkoutHistory[]>(`workoutHistory_${userId}`);
    return localHistory || [];
  }

  /**
   * Sync all local data to backend
   */
  async syncAllData(userId: string): Promise<void> {
    if (!supabase) return;

    try {
      // Sync progression
      const progression = secureStorage.getItem<WorkoutProgression>(`progression_${userId}`);
      if (progression) {
        await this.updateProgression(userId, progression);
      }

      // Note: workout history is already synced when saved
      console.log('All data synced to backend');
    } catch (error) {
      console.error('Error syncing all data:', error);
    }
  }

  /**
   * Import data from backend to localStorage
   */
  async importFromBackend(userId: string): Promise<void> {
    if (!supabase) return;

    try {
      // Import progression
      await this.getProgression(userId);

      // Import workout history
      await this.getWorkoutHistory(userId);

      console.log('Data imported from backend');
    } catch (error) {
      console.error('Error importing data from backend:', error);
    }
  }
}

export const workoutService = new WorkoutService();
