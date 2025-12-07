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

// Weight tracking interfaces
export interface WeightCheckIn {
  week: number;
  weight: number;
  date: string;
}

export interface WeightTracking {
  initialWeight: number | null;
  goalWeight: number | null;
  checkIns: WeightCheckIn[];
}

class WorkoutService {
  /**
   * Get user's workout progression
   */
  async getProgression(userId: string): Promise<WorkoutProgression> {
    console.log('Loading progression for user:', userId);

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
          console.error('❌ Error fetching progression from Supabase:', error);
        }

        if (data) {
          const progression = {
            currentWeek: data.current_week,
            completedDays: data.completed_days || [],
          };

          console.log('✅ Progression loaded from Supabase:', progression);

          // Sync to localStorage as backup
          secureStorage.setItem(`progression_${userId}`, progression);

          return progression;
        } else {
          console.log('⚠️ No progression found in Supabase, checking localStorage');
        }
      } catch (error) {
        console.error('❌ Exception fetching progression from backend:', error);
      }
    }

    // Fallback to localStorage
    const localProgression = secureStorage.getItem<WorkoutProgression>(`progression_${userId}`);
    if (localProgression) {
      console.log('✅ Progression loaded from localStorage:', localProgression);
    } else {
      console.log('ℹ️ No progression found, using default');
    }
    return localProgression || { currentWeek: 1, completedDays: [] };
  }

  /**
   * Update user's workout progression
   */
  async updateProgression(userId: string, progression: WorkoutProgression): Promise<void> {
    console.log('Updating progression for user:', userId, progression);

    // Save to localStorage first (immediate)
    secureStorage.setItem(`progression_${userId}`, progression);
    console.log('Progression saved to localStorage');

    // Sync to backend
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('user_progression')
          .upsert({
            user_id: userId,
            current_week: progression.currentWeek,
            completed_days: progression.completedDays,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id'
          })
          .select();

        if (error) {
          console.error('❌ Error updating progression in Supabase:', error);
          alert(`Failed to save progress to cloud: ${error.message}. Data saved locally only.`);
        } else {
          console.log('✅ Progression saved to Supabase successfully:', data);
        }
      } catch (error) {
        console.error('❌ Exception syncing progression to backend:', error);
        alert('Failed to save progress to cloud. Data saved locally only.');
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

  /**
   * Get user's weight tracking data
   */
  async getWeightTracking(userId: string): Promise<WeightTracking> {
    console.log('Loading weight tracking for user:', userId);

    // Try localStorage first (faster)
    const localWeight = secureStorage.getItem<WeightTracking>(`weightTracking_${userId}`);
    if (localWeight) {
      console.log('✅ Weight tracking loaded from localStorage:', localWeight);
      return localWeight;
    }

    // Default empty weight tracking
    const defaultTracking: WeightTracking = {
      initialWeight: null,
      goalWeight: null,
      checkIns: [],
    };

    console.log('ℹ️ No weight tracking found, using default');
    return defaultTracking;
  }

  /**
   * Update user's weight tracking data
   */
  async updateWeightTracking(userId: string, weightTracking: WeightTracking): Promise<void> {
    console.log('Updating weight tracking for user:', userId, weightTracking);

    // Save to localStorage
    secureStorage.setItem(`weightTracking_${userId}`, weightTracking);
    console.log('✅ Weight tracking saved to localStorage');
  }

  /**
   * Set initial weight and goal weight (called on first workout)
   */
  async setInitialWeightGoal(userId: string, initialWeight: number, goalWeight: number): Promise<void> {
    const tracking = await this.getWeightTracking(userId);
    tracking.initialWeight = initialWeight;
    tracking.goalWeight = goalWeight;
    tracking.checkIns = [{
      week: 1,
      weight: initialWeight,
      date: new Date().toISOString(),
    }];

    await this.updateWeightTracking(userId, tracking);
    console.log('✅ Initial weight and goal set:', { initialWeight, goalWeight });
  }

  /**
   * Add a weight check-in for a specific week
   */
  async addWeightCheckIn(userId: string, week: number, weight: number): Promise<void> {
    const tracking = await this.getWeightTracking(userId);

    // Remove existing check-in for this week if it exists
    tracking.checkIns = tracking.checkIns.filter(c => c.week !== week);

    // Add new check-in
    tracking.checkIns.push({
      week,
      weight,
      date: new Date().toISOString(),
    });

    // Sort by week
    tracking.checkIns.sort((a, b) => a.week - b.week);

    await this.updateWeightTracking(userId, tracking);
    console.log('✅ Weight check-in added for week', week, ':', weight);
  }

  /**
   * Check if user needs to do a weight check-in for current week
   */
  needsWeightCheckIn(weightTracking: WeightTracking, currentWeek: number): boolean {
    // Need check-in every 4 weeks (week 4, 8, 12, etc.)
    if (currentWeek % 4 !== 0) return false;

    // Check if already have a check-in for this week
    const hasCheckIn = weightTracking.checkIns.some(c => c.week === currentWeek);
    return !hasCheckIn;
  }
}

export const workoutService = new WorkoutService();
