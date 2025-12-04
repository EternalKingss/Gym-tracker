import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, CircularProgress, Button } from '../components';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  completed: boolean;
}

interface WorkoutSession {
  exercises: Exercise[];
  startTime: Date | null;
  isActive: boolean;
}

// Jeff Nippard's Bodybuilding Transformation System - Beginner
const EXERCISE_LIBRARY = [
  // Upper (Strength Focus)
  { name: '45° Incline Barbell Press', category: 'Chest' },
  { name: 'Cable Crossover', category: 'Chest' },
  { name: 'Wide-Grip Pull-Up', category: 'Back' },
  { name: 'High-Cable Lateral Raise', category: 'Shoulders' },
  { name: 'Pendlay Deficit Row', category: 'Back' },
  { name: 'Overhead Cable Triceps Extension', category: 'Arms' },
  { name: 'Bayesian Cable Curl', category: 'Arms' },

  // Lower (Strength Focus)
  { name: 'Lying Leg Curl', category: 'Legs' },
  { name: 'Smith Machine Squat', category: 'Legs' },
  { name: 'Barbell RDL', category: 'Legs' },
  { name: 'Leg Extension', category: 'Legs' },
  { name: 'Standing Calf Raise', category: 'Legs' },
  { name: 'Cable Crunch', category: 'Abs' },

  // Pull (Hypertrophy Focus)
  { name: 'Neutral-Grip Lat Pulldown', category: 'Back' },
  { name: 'Chest-Supported Machine Row', category: 'Back' },
  { name: '1-Arm 45° Cable Rear Delt Flye', category: 'Shoulders' },
  { name: 'Machine Shrug', category: 'Back' },
  { name: 'EZ-Bar Cable Curl', category: 'Arms' },
  { name: 'Machine Preacher Curl', category: 'Arms' },

  // Common Alternatives
  { name: 'Bench Press', category: 'Chest' },
  { name: 'Squats', category: 'Legs' },
  { name: 'Deadlifts', category: 'Back' },
  { name: 'Overhead Press', category: 'Shoulders' },
];

const GymTracker: React.FC = () => {
  const [workoutSession, setWorkoutSession] = useState<WorkoutSession>({
    exercises: [],
    startTime: null,
    isActive: false,
  });

  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [totalWorkouts] = useState(24);
  const [weeklyProgress] = useState(67);

  const startWorkout = () => {
    setWorkoutSession({
      exercises: [],
      startTime: new Date(),
      isActive: true,
    });
  };

  const endWorkout = () => {
    setWorkoutSession({
      exercises: [],
      startTime: null,
      isActive: false,
    });
  };

  const addExercise = (exerciseName: string) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exerciseName,
      sets: 3,
      reps: 10,
      weight: 0,
      completed: false,
    };
    setWorkoutSession({
      ...workoutSession,
      exercises: [...workoutSession.exercises, newExercise],
    });
    setShowExerciseModal(false);
  };

  const toggleExerciseComplete = (id: string) => {
    setWorkoutSession({
      ...workoutSession,
      exercises: workoutSession.exercises.map(ex =>
        ex.id === id ? { ...ex, completed: !ex.completed } : ex
      ),
    });
  };

  const updateExercise = (id: string, field: keyof Exercise, value: any) => {
    setWorkoutSession({
      ...workoutSession,
      exercises: workoutSession.exercises.map(ex =>
        ex.id === id ? { ...ex, [field]: value } : ex
      ),
    });
  };

  const removeExercise = (id: string) => {
    setWorkoutSession({
      ...workoutSession,
      exercises: workoutSession.exercises.filter(ex => ex.id !== id),
    });
  };

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
          {/* Total Workouts */}
          <motion.div variants={cardVariants}>
            <GlassCard className="h-full">
              <div className="text-center space-y-2">
                <h3 className="text-white/60 text-sm">Total Workouts</h3>
                <div className="flex items-center justify-center">
                  <CircularProgress
                    percentage={weeklyProgress}
                    size="sm"
                    color="orange"
                    showPercentage={false}
                  />
                </div>
                <p className="text-white text-3xl font-bold">{totalWorkouts}</p>
                <p className="text-white/50 text-xs">This month</p>
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
                <p className="text-white/50 text-xs">Keep it up!</p>
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

        {/* Main Workout Area */}
        <motion.div variants={cardVariants}>
          <GlassCard>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-white text-2xl font-bold">
                  {workoutSession.isActive ? 'Active Workout' : 'Start Your Workout'}
                </h2>
                {workoutSession.isActive ? (
                  <Button
                    variant="secondary"
                    onClick={endWorkout}
                  >
                    End Workout
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={startWorkout}
                  >
                    Start Workout
                  </Button>
                )}
              </div>

              {workoutSession.isActive && (
                <>
                  {/* Add Exercise Button */}
                  <button
                    onClick={() => setShowExerciseModal(true)}
                    className="w-full py-4 border-2 border-dashed border-white/20 rounded-2xl hover:border-orange-400/50 hover:bg-white/5 transition-all text-white/60 hover:text-white"
                  >
                    + Add Exercise
                  </button>

                  {/* Exercise List */}
                  <AnimatePresence>
                    {workoutSession.exercises.map((exercise) => (
                      <motion.div
                        key={exercise.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white/5 rounded-2xl p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-white text-lg font-semibold">
                            {exercise.name}
                          </h3>
                          <button
                            onClick={() => removeExercise(exercise.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          {/* Sets */}
                          <div>
                            <label className="text-white/50 text-xs block mb-1">
                              Sets
                            </label>
                            <input
                              type="number"
                              value={exercise.sets}
                              onChange={(e) =>
                                updateExercise(exercise.id, 'sets', parseInt(e.target.value))
                              }
                              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:border-orange-400"
                            />
                          </div>

                          {/* Reps */}
                          <div>
                            <label className="text-white/50 text-xs block mb-1">
                              Reps
                            </label>
                            <input
                              type="number"
                              value={exercise.reps}
                              onChange={(e) =>
                                updateExercise(exercise.id, 'reps', parseInt(e.target.value))
                              }
                              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:border-orange-400"
                            />
                          </div>

                          {/* Weight */}
                          <div>
                            <label className="text-white/50 text-xs block mb-1">
                              Weight (lbs)
                            </label>
                            <input
                              type="number"
                              value={exercise.weight}
                              onChange={(e) =>
                                updateExercise(exercise.id, 'weight', parseInt(e.target.value))
                              }
                              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:border-orange-400"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => toggleExerciseComplete(exercise.id)}
                          className={`w-full py-3 rounded-xl font-semibold transition-all ${
                            exercise.completed
                              ? 'bg-green-500/30 border-2 border-green-400 text-green-300'
                              : 'bg-white/10 border-2 border-white/20 text-white hover:border-orange-400'
                          }`}
                        >
                          {exercise.completed ? '✓ Completed' : 'Mark Complete'}
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {workoutSession.exercises.length === 0 && (
                    <div className="text-center py-12 text-white/40">
                      <p>No exercises added yet</p>
                      <p className="text-sm mt-2">Click "Add Exercise" to get started</p>
                    </div>
                  )}
                </>
              )}

              {!workoutSession.isActive && (
                <div className="text-center py-12 space-y-4">
                  <div className="text-6xl">💪</div>
                  <p className="text-white/60">Ready to crush your goals?</p>
                  <p className="text-white/40 text-sm">Click "Start Workout" to begin tracking</p>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Exercise Selection Modal */}
      <AnimatePresence>
        {showExerciseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={() => setShowExerciseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <GlassCard>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white text-xl font-bold">Select Exercise</h3>
                    <button
                      onClick={() => setShowExerciseModal(false)}
                      className="text-white/60 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {EXERCISE_LIBRARY.map((exercise) => (
                      <button
                        key={exercise.name}
                        onClick={() => addExercise(exercise.name)}
                        className="bg-white/5 hover:bg-orange-500/20 border border-white/10 hover:border-orange-400 rounded-xl p-4 text-left transition-all"
                      >
                        <p className="text-white font-semibold">{exercise.name}</p>
                        <p className="text-white/50 text-sm">{exercise.category}</p>
                      </button>
                    ))}
                  </div>
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
