import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, CircularProgress, Button } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { WORKOUT_PROGRAM } from '../data/workoutProgram';
import { secureStorage } from '../utils/secureStorage';

interface ExerciseSet {
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
}

interface WorkoutExercise {
  id: string;
  name: string;
  workingSets: number;
  targetReps: string;
  targetRPE: string;
  rest: string;
  notes?: string;
  sets: ExerciseSet[];
  completed: boolean;
}

interface WorkoutProgression {
  currentWeek: number;
  completedDays: number[]; // Array of day indices (0-4) completed in current week
}

interface WorkoutSession {
  week: number;
  day: number;
  dayName: string;
  exercises: WorkoutExercise[];
  startTime: Date | null;
  isActive: boolean;
}

const GymTracker: React.FC = () => {
  const { user } = useAuth();
  const [progression, setProgression] = useState<WorkoutProgression>({
    currentWeek: 1,
    completedDays: [],
  });
  const [workoutSession, setWorkoutSession] = useState<WorkoutSession>({
    week: 1,
    day: 0,
    dayName: '',
    exercises: [],
    startTime: null,
    isActive: false,
  });

  // Load progression from secure storage
  useEffect(() => {
    if (!user) return;
    const key = `progression_${user.id}`;
    const saved = secureStorage.getItem<WorkoutProgression>(key);
    if (saved) {
      setProgression(saved);
    }
  }, [user]);

  // Save progression to secure storage
  const saveProgression = (newProgression: WorkoutProgression) => {
    if (!user) return;
    const key = `progression_${user.id}`;
    secureStorage.setItem(key, newProgression);
    setProgression(newProgression);
  };

  // Get next workout day
  const getNextWorkoutDay = (): { week: number; day: number } => {
    const { currentWeek, completedDays } = progression;

    // Find next uncompleted day in current week (days 0-4)
    for (let day = 0; day < 5; day++) {
      if (!completedDays.includes(day)) {
        return { week: currentWeek, day };
      }
    }

    // If all days completed, move to next week
    return { week: currentWeek + 1, day: 0 };
  };

  // Start workout with auto-populated exercises
  const startWorkout = () => {
    const { week, day } = getNextWorkoutDay();

    // Check if week exists in program
    const weekData = WORKOUT_PROGRAM.find(w => w.week === week);
    if (!weekData || !weekData.days[day]) {
      alert('No more workouts available in the program!');
      return;
    }

    const dayData = weekData.days[day];

    // Convert program exercises to workout exercises
    const exercises: WorkoutExercise[] = dayData.exercises.map((ex, idx) => ({
      id: `${Date.now()}_${idx}`,
      name: ex.name,
      workingSets: ex.workingSets,
      targetReps: ex.reps,
      targetRPE: ex.lastSetRPE,
      rest: ex.rest,
      notes: ex.notes,
      sets: Array.from({ length: ex.workingSets }, (_, i) => ({
        setNumber: i + 1,
        reps: 0,
        weight: 0,
        completed: false,
      })),
      completed: false,
    }));

    setWorkoutSession({
      week,
      day,
      dayName: dayData.name,
      exercises,
      startTime: new Date(),
      isActive: true,
    });
  };

  // End workout and update progression
  const endWorkout = () => {
    if (!user) return;

    const { week, day, exercises } = workoutSession;
    const completedExercises = exercises.filter(ex => ex.completed);

    // Only save and update progression if exercises were completed
    if (completedExercises.length > 0) {
      // Save workout to history using secure storage
      const historyKey = `workoutHistory_${user.id}`;
      const existingHistory = secureStorage.getItem<any[]>(historyKey) || [];

      const newWorkout = {
        date: new Date().toISOString(),
        week,
        day,
        dayName: workoutSession.dayName,
        exercises: completedExercises.map(ex => ({
          name: ex.name,
          sets: ex.sets.filter(s => s.completed).map(s => ({
            reps: s.reps,
            weight: s.weight,
          })),
        })),
      };

      const updatedHistory = [...existingHistory, newWorkout];
      secureStorage.setItem(historyKey, updatedHistory);

      // Update progression
      let newProgression = { ...progression };

      // Add current day to completed days if not already there
      if (!newProgression.completedDays.includes(day)) {
        newProgression.completedDays = [...newProgression.completedDays, day].sort();
      }

      // If all 5 days completed, move to next week
      if (newProgression.completedDays.length === 5) {
        newProgression.currentWeek += 1;
        newProgression.completedDays = [];
      }

      saveProgression(newProgression);
    }

    // Reset workout session
    setWorkoutSession({
      week: 1,
      day: 0,
      dayName: '',
      exercises: [],
      startTime: null,
      isActive: false,
    });
  };

  const toggleSetComplete = (exerciseId: string, setNumber: number) => {
    setWorkoutSession({
      ...workoutSession,
      exercises: workoutSession.exercises.map(ex => {
        if (ex.id === exerciseId) {
          const updatedSets = ex.sets.map(set =>
            set.setNumber === setNumber ? { ...set, completed: !set.completed } : set
          );
          const allSetsCompleted = updatedSets.every(s => s.completed);
          return { ...ex, sets: updatedSets, completed: allSetsCompleted };
        }
        return ex;
      }),
    });
  };

  const updateSet = (exerciseId: string, setNumber: number, field: 'reps' | 'weight', value: number) => {
    setWorkoutSession({
      ...workoutSession,
      exercises: workoutSession.exercises.map(ex => {
        if (ex.id === exerciseId) {
          const updatedSets = ex.sets.map(set =>
            set.setNumber === setNumber ? { ...set, [field]: value } : set
          );
          return { ...ex, sets: updatedSets };
        }
        return ex;
      }),
    });
  };

  // Calculate weekly progress percentage
  const weeklyProgress = (progression.completedDays.length / 5) * 100;
  const completedExercises = workoutSession.exercises.filter(ex => ex.completed).length;
  const totalExercises = workoutSession.exercises.length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom right, #4a5568 0%, #2d3748 30%, #1a202c 70%, #000000 100%)',
      }}
    >
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, rgba(251, 146, 60, 0) 70%)',
          }}
        />
        <div
          className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, rgba(251, 146, 60, 0) 70%)',
          }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-6 py-8 md:py-12"
      >
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Current Week */}
          <motion.div variants={cardVariants}>
            <GlassCard className="h-full">
              <div className="text-center space-y-2">
                <h3 className="text-white/60 text-sm">Current Week</h3>
                <p className="text-white text-3xl font-bold">Week {progression.currentWeek}</p>
                <p className="text-white/50 text-xs">
                  {WORKOUT_PROGRAM.find(w => w.week === progression.currentWeek)?.block || 'Loading...'}
                </p>
              </div>
            </GlassCard>
          </motion.div>

          {/* Weekly Progress */}
          <motion.div variants={cardVariants}>
            <GlassCard className="h-full">
              <div className="text-center space-y-2">
                <h3 className="text-white/60 text-sm">Weekly Progress</h3>
                <div className="flex items-center justify-center">
                  <CircularProgress
                    percentage={weeklyProgress}
                    size="sm"
                    color="green"
                    showPercentage={true}
                  />
                </div>
                <p className="text-white/50 text-xs">
                  {progression.completedDays.length}/5 days completed
                </p>
              </div>
            </GlassCard>
          </motion.div>

          {/* Current Session */}
          <motion.div variants={cardVariants}>
            <GlassCard className="h-full">
              <div className="text-center space-y-2">
                <h3 className="text-white/60 text-sm">Current Session</h3>
                <div className="py-4">
                  {workoutSession.isActive ? (
                    <div className="space-y-2">
                      <p className="text-orange-400 text-2xl font-bold">
                        {completedExercises}/{totalExercises}
                      </p>
                      <p className="text-white/50 text-xs">Exercises done</p>
                    </div>
                  ) : (
                    <p className="text-white/40 text-sm">Not started</p>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Day Progress Tracker */}
        {!workoutSession.isActive && (
          <motion.div variants={cardVariants} className="mb-6">
            <GlassCard>
              <h3 className="text-white text-lg font-bold mb-4">This Week's Progress</h3>
              <div className="grid grid-cols-5 gap-3">
                {['Upper', 'Lower', 'Pull', 'Push', 'Legs'].map((dayName, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      progression.completedDays.includes(idx)
                        ? 'bg-green-500/20 border-green-400 text-green-300'
                        : 'bg-white/5 border-white/20 text-white/60'
                    }`}
                  >
                    <p className="text-sm font-semibold">{dayName}</p>
                    <p className="text-xs mt-1">Day {idx + 1}</p>
                    {progression.completedDays.includes(idx) && (
                      <p className="text-2xl mt-2">✓</p>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Main Workout Area */}
        <motion.div variants={cardVariants}>
          <GlassCard>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white text-2xl font-bold">
                    {workoutSession.isActive ? workoutSession.dayName : 'Start Your Workout'}
                  </h2>
                  {workoutSession.isActive && (
                    <p className="text-white/60 text-sm mt-1">
                      Week {workoutSession.week} - Day {workoutSession.day + 1}
                    </p>
                  )}
                </div>
                {workoutSession.isActive ? (
                  <Button variant="secondary" onClick={endWorkout}>
                    End Workout
                  </Button>
                ) : (
                  <Button variant="primary" onClick={startWorkout}>
                    Start Workout
                  </Button>
                )}
              </div>

              {workoutSession.isActive && (
                <div className="space-y-4">
                  {workoutSession.exercises.map((exercise) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`rounded-2xl p-4 border-2 transition-all ${
                        exercise.completed
                          ? 'bg-green-500/10 border-green-400/50'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-white text-lg font-semibold">{exercise.name}</h3>
                            <div className="flex flex-wrap gap-3 mt-2 text-sm">
                              <span className="text-white/60">
                                {exercise.workingSets} sets × {exercise.targetReps} reps
                              </span>
                              <span className="text-orange-400">RPE {exercise.targetRPE}</span>
                              <span className="text-white/50">Rest: {exercise.rest}</span>
                            </div>
                            {exercise.notes && (
                              <p className="text-white/50 text-xs mt-2 italic">{exercise.notes}</p>
                            )}
                          </div>
                          {exercise.completed && (
                            <span className="text-green-400 text-2xl">✓</span>
                          )}
                        </div>

                        {/* Sets */}
                        <div className="space-y-2">
                          {exercise.sets.map((set) => (
                            <div
                              key={set.setNumber}
                              className={`grid grid-cols-4 gap-3 items-center p-3 rounded-xl ${
                                set.completed
                                  ? 'bg-green-500/20 border border-green-400/50'
                                  : 'bg-white/5 border border-white/10'
                              }`}
                            >
                              <div className="text-white/60 text-sm font-semibold">
                                Set {set.setNumber}
                              </div>
                              <div>
                                <input
                                  type="number"
                                  placeholder="Reps"
                                  value={set.reps || ''}
                                  onChange={(e) =>
                                    updateSet(exercise.id, set.setNumber, 'reps', parseInt(e.target.value) || 0)
                                  }
                                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-orange-400"
                                />
                              </div>
                              <div>
                                <input
                                  type="number"
                                  placeholder="Weight"
                                  value={set.weight || ''}
                                  onChange={(e) =>
                                    updateSet(exercise.id, set.setNumber, 'weight', parseInt(e.target.value) || 0)
                                  }
                                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-orange-400"
                                />
                              </div>
                              <button
                                onClick={() => toggleSetComplete(exercise.id, set.setNumber)}
                                className={`py-2 rounded-lg font-semibold text-sm transition-all ${
                                  set.completed
                                    ? 'bg-green-500/30 text-green-300'
                                    : 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30'
                                }`}
                              >
                                {set.completed ? '✓' : 'Done'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {!workoutSession.isActive && (
                <div className="text-center py-12 space-y-4">
                  <div className="text-6xl">💪</div>
                  <p className="text-white text-xl font-semibold">
                    {progression.completedDays.length === 5
                      ? `Ready for Week ${progression.currentWeek + 1}?`
                      : `Next: ${
                          WORKOUT_PROGRAM.find(w => w.week === progression.currentWeek)?.days[
                            getNextWorkoutDay().day
                          ]?.name || 'Loading...'
                        }`}
                  </p>
                  <p className="text-white/60">Click "Start Workout" to begin</p>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GymTracker;
