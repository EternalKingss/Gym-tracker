import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, CircularProgress, Button } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { WORKOUT_PROGRAM } from '../data/workoutProgram';
import { workoutService, WeightTracking } from '../services/workoutService';

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

  const [weightTracking, setWeightTracking] = useState<WeightTracking>({
    initialWeight: null,
    goalWeight: null,
    checkIns: [],
  });

  const [showInitialWeightModal, setShowInitialWeightModal] = useState(false);
  const [showWeightCheckInModal, setShowWeightCheckInModal] = useState(false);
  const [tempInitialWeight, setTempInitialWeight] = useState('');
  const [tempGoalWeight, setTempGoalWeight] = useState('');
  const [tempCurrentWeight, setTempCurrentWeight] = useState('');

  // Load progression and weight tracking from backend/storage
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      const saved = await workoutService.getProgression(user.id);
      if (saved) {
        setProgression(saved);
      }

      const weight = await workoutService.getWeightTracking(user.id);
      setWeightTracking(weight);

      // Restore active workout session from sessionStorage if exists
      const sessionKey = `workout_session_${user.id}`;
      const savedSession = sessionStorage.getItem(sessionKey);
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          // Convert startTime back to Date object
          if (parsed.startTime) {
            parsed.startTime = new Date(parsed.startTime);
          }
          setWorkoutSession(parsed);
        } catch (error) {
          console.error('Failed to restore workout session:', error);
          sessionStorage.removeItem(sessionKey);
        }
      }
    };

    loadData();
  }, [user]);

  // Save active workout session to sessionStorage whenever it changes
  useEffect(() => {
    if (!user) return;

    const sessionKey = `workout_session_${user.id}`;

    if (workoutSession.isActive) {
      // Save active session
      try {
        sessionStorage.setItem(sessionKey, JSON.stringify(workoutSession));
      } catch (error) {
        console.error('Failed to save workout session:', error);
      }
    } else if (!workoutSession.isActive && workoutSession.exercises.length === 0) {
      // Clear session when workout is not active
      sessionStorage.removeItem(sessionKey);
    }
  }, [workoutSession, user]);

  // Save progression to backend/storage
  const saveProgression = async (newProgression: WorkoutProgression) => {
    if (!user) return;
    await workoutService.updateProgression(user.id, newProgression);
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
  const startWorkout = (skipWeightChecks = false) => {
    const { week, day } = getNextWorkoutDay();

    // Check if we need initial weight/goal (ask on ANY workout if not set)
    if (!skipWeightChecks && weightTracking.initialWeight === null) {
      setShowInitialWeightModal(true);
      return;
    }

    // Check if we need a weight check-in (every 4 weeks)
    if (!skipWeightChecks && workoutService.needsWeightCheckIn(weightTracking, week)) {
      setShowWeightCheckInModal(true);
      return;
    }

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

  // Handle initial weight and goal submission
  const handleInitialWeightSubmit = async () => {
    if (!user) return;

    const initial = parseFloat(tempInitialWeight);
    const goal = parseFloat(tempGoalWeight);

    if (isNaN(initial) || isNaN(goal) || initial <= 0 || goal <= 0) {
      alert('Please enter valid weight values');
      return;
    }

    await workoutService.setInitialWeightGoal(user.id, initial, goal);
    const updated = await workoutService.getWeightTracking(user.id);
    setWeightTracking(updated);

    setShowInitialWeightModal(false);
    setTempInitialWeight('');
    setTempGoalWeight('');

    // Now actually start the workout (skip weight checks since we just completed them)
    startWorkout(true);
  };

  // Handle weight check-in submission
  const handleWeightCheckInSubmit = async () => {
    if (!user) return;

    const current = parseFloat(tempCurrentWeight);

    if (isNaN(current) || current <= 0) {
      alert('Please enter a valid weight value');
      return;
    }

    const { week } = getNextWorkoutDay();
    await workoutService.addWeightCheckIn(user.id, week, current);
    const updated = await workoutService.getWeightTracking(user.id);
    setWeightTracking(updated);

    setShowWeightCheckInModal(false);
    setTempCurrentWeight('');

    // Now actually start the workout (skip weight checks since we just completed them)
    startWorkout(true);
  };

  // End workout and update progression
  const endWorkout = async () => {
    if (!user) return;

    const { week, day, exercises, startTime } = workoutSession;
    const completedExercises = exercises.filter(ex => ex.completed);
    const allExercisesCompleted = exercises.length > 0 && exercises.every(ex => ex.completed);

    // Only save and update progression if ALL exercises were completed
    if (allExercisesCompleted && startTime) {
      // Save workout session to backend/storage
      const exercisesData = completedExercises.map(ex => {
        const completedSets = ex.sets.filter(s => s.completed);
        // Calculate average weight and reps
        const avgWeight = completedSets.reduce((sum, s) => sum + s.weight, 0) / completedSets.length;
        const avgReps = Math.round(completedSets.reduce((sum, s) => sum + s.reps, 0) / completedSets.length);

        return {
          name: ex.name,
          sets: completedSets.length,
          reps: avgReps,
          weight: Math.round(avgWeight),
        };
      });

      await workoutService.saveWorkoutSession(
        user.id,
        week,
        day,
        workoutSession.dayName,
        exercisesData,
        startTime,
        new Date()
      );

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

      await saveProgression(newProgression);
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
        background: 'linear-gradient(135deg, #1a1410 0%, #2d1f0d 25%, #1f1610 50%, #0f0a05 100%)',
      }}
    >
      {/* Background glows - Golden/Amber theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(255, 200, 87, 0.25) 0%, rgba(255, 179, 71, 0.1) 40%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[800px] h-[800px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, rgba(249, 115, 22, 0.15) 40%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(217, 119, 6, 0.2) 0%, transparent 70%)',
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
              <div className="text-center space-y-3">
                <h3 className="text-white/60 text-sm">Current Session</h3>
                <div className="py-2">
                  {workoutSession.isActive ? (
                    <div className="space-y-2">
                      <p className="text-amber-400 text-2xl font-bold">
                        {completedExercises}/{totalExercises}
                      </p>
                      <p className="text-white/50 text-xs">Exercises done</p>
                    </div>
                  ) : (
                    <p className="text-white/40 text-sm">Not started</p>
                  )}
                </div>

                {/* Weight Tracking Info */}
                {weightTracking.initialWeight && weightTracking.goalWeight && (
                  <div className="border-t border-white/10 pt-3 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/50">Current:</span>
                      <span className="text-white font-semibold">
                        {weightTracking.checkIns.length > 0
                          ? weightTracking.checkIns[weightTracking.checkIns.length - 1].weight
                          : weightTracking.initialWeight}{' '}
                        lbs
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/50">Goal:</span>
                      <span className="text-amber-400 font-semibold">{weightTracking.goalWeight} lbs</span>
                    </div>
                  </div>
                )}
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
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={endWorkout}
                      disabled={workoutSession.exercises.length === 0 || !workoutSession.exercises.every(ex => ex.completed)}
                    >
                      End Workout
                    </Button>
                    {workoutSession.exercises.length > 0 && !workoutSession.exercises.every(ex => ex.completed) && (
                      <p className="text-amber-400 text-xs">Complete all exercises to finish workout</p>
                    )}
                  </div>
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
                              <span className="text-amber-400 font-semibold">RPE {exercise.targetRPE}</span>
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
                                  className="w-full bg-amber-950/30 border-2 border-amber-500/30 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-amber-400 focus:shadow-lg focus:shadow-amber-500/20 transition-all"
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
                                  className="w-full bg-amber-950/30 border-2 border-amber-500/30 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-amber-400 focus:shadow-lg focus:shadow-amber-500/20 transition-all"
                                />
                              </div>
                              <button
                                onClick={() => toggleSetComplete(exercise.id, set.setNumber)}
                                className={`py-2 rounded-lg font-semibold text-sm transition-all ${
                                  set.completed
                                    ? 'bg-green-500/30 text-green-300 border-2 border-green-400/50'
                                    : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-2 border-amber-500/30 hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-500/20'
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

      {/* Initial Weight and Goal Modal */}
      <AnimatePresence>
        {showInitialWeightModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md"
            >
              <GlassCard>
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowInitialWeightModal(false);
                      setTempInitialWeight('');
                      setTempGoalWeight('');
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white font-bold transition-all hover:scale-110"
                  >
                    ×
                  </button>
                  <h3 className="text-white text-xl font-bold mb-4">Set Your Weight Goals</h3>
                  <p className="text-white/60 text-sm mb-6">
                    Before starting your first workout, let's track your progress toward your goals.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-white/80 text-sm block mb-2">Current Weight (lbs)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={tempInitialWeight}
                      onChange={(e) => setTempInitialWeight(e.target.value)}
                      className="w-full bg-amber-950/30 border-2 border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400 transition-all"
                      placeholder="Enter your current weight"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="text-white/80 text-sm block mb-2">Goal Weight (lbs)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={tempGoalWeight}
                      onChange={(e) => setTempGoalWeight(e.target.value)}
                      className="w-full bg-amber-950/30 border-2 border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400 transition-all"
                      placeholder="Enter your goal weight"
                    />
                  </div>

                  <Button variant="primary" onClick={handleInitialWeightSubmit} className="w-full mt-6">
                    Start Workout
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weight Check-In Modal (Every 4 Weeks) */}
      <AnimatePresence>
        {showWeightCheckInModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md"
            >
              <GlassCard>
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowWeightCheckInModal(false);
                      setTempCurrentWeight('');
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white font-bold transition-all hover:scale-110"
                  >
                    ×
                  </button>
                  <h3 className="text-white text-xl font-bold mb-4">Weight Check-In</h3>
                  <p className="text-white/60 text-sm mb-6">
                    It's been 4 weeks! Let's track your progress.
                  </p>
                </div>

                {weightTracking.initialWeight && weightTracking.goalWeight && (
                  <div className="bg-amber-950/30 rounded-xl p-4 mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Starting Weight:</span>
                      <span className="text-white font-semibold">{weightTracking.initialWeight} lbs</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Goal Weight:</span>
                      <span className="text-amber-400 font-semibold">{weightTracking.goalWeight} lbs</span>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-white/80 text-sm block mb-2">Current Weight (lbs)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={tempCurrentWeight}
                      onChange={(e) => setTempCurrentWeight(e.target.value)}
                      className="w-full bg-amber-950/30 border-2 border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400 transition-all"
                      placeholder="Enter your current weight"
                      autoFocus
                    />
                  </div>

                  <Button variant="primary" onClick={handleWeightCheckInSubmit} className="w-full mt-6">
                    Continue to Workout
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GymTracker;
