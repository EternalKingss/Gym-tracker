import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components';
import ProgressChart from '../components/ProgressChart';
import { useAuth } from '../contexts/AuthContext';
import { workoutService } from '../services/workoutService';

interface WorkoutHistory {
  date: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight: number;
  }[];
}

// Tracked exercises from training program
const TRACKED_EXERCISES = [
  '45° Incline Barbell Press',
  'Cable Crossover',
  'Wide-Grip Pull-Up',
  'High-Cable Lateral Raise',
  'Pendlay Deficit Row',
  'Overhead Cable Triceps Extension',
  'Bayesian Cable Curl',
  'Lying Leg Curl',
  'Smith Machine Squat',
  'Barbell RDL',
  'Leg Extension',
  'Standing Calf Raise',
  'Cable Crunch',
  'Neutral-Grip Lat Pulldown',
  'Chest-Supported Machine Row',
  '1-Arm 45° Cable Rear Delt Flye',
  'Machine Shrug',
  'EZ-Bar Cable Curl',
  'Machine Preacher Curl',
  'Bench Press',
  'Squats',
  'Deadlifts',
];

const Progress: React.FC = () => {
  const { user } = useAuth();
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>([]);
  const [selectedExercise, setSelectedExercise] = useState('45° Incline Barbell Press');

  useEffect(() => {
    if (!user) return;

    // Load user-specific workout history from backend/storage
    const loadHistory = async () => {
      const saved = await workoutService.getWorkoutHistory(user.id);
      if (saved) {
        setWorkoutHistory(saved);
      } else {
        // No workout history for this user yet
        setWorkoutHistory([]);
      }
    };

    loadHistory();
  }, [user]);

  const generateSampleData = (): WorkoutHistory[] => {
    // Return empty array - no sample data
    return [];
  };

  const getProgressData = (exerciseName: string) => {
    return workoutHistory
      .map((workout) => {
        const exercise = workout.exercises.find((ex) => ex.name === exerciseName);
        if (exercise) {
          return {
            date: new Date(workout.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            weight: exercise.weight,
          };
        }
        return null;
      })
      .filter((item) => item !== null) as { date: string; weight: number }[];
  };

  const getExerciseStats = (exerciseName: string) => {
    const data = getProgressData(exerciseName);
    if (data.length === 0) return { current: 0, max: 0, gain: 0 };

    const current = data[data.length - 1].weight;
    const max = Math.max(...data.map((d) => d.weight));
    const start = data[0].weight;
    const gain = current - start;

    return { current, max, gain };
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const stats = getExerciseStats(selectedExercise);
  const progressData = getProgressData(selectedExercise);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          'linear-gradient(to bottom right, #4a5568 0%, #2d3748 30%, #1a202c 70%, #000000 100%)',
      }}
    >
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-40"
          style={{
            background:
              'radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, rgba(251, 146, 60, 0) 70%)',
          }}
        />
        <div
          className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, rgba(251, 146, 60, 0) 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 md:py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="mb-6"
        >
          <h1 className="text-white text-4xl font-bold mb-2">Progress Tracker</h1>
          <p className="text-white/60">Track your strength gains over time</p>
        </motion.div>

        {/* Exercise Selector */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="mb-6"
        >
          <GlassCard>
            <h3 className="text-white text-lg font-semibold mb-4">Select Exercise</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {TRACKED_EXERCISES.map((exercise) => (
                <button
                  key={exercise}
                  onClick={() => setSelectedExercise(exercise)}
                  className={`p-3 rounded-xl transition-all font-medium ${
                    selectedExercise === exercise
                      ? 'bg-orange-500/30 border-2 border-orange-400 text-white'
                      : 'bg-white/5 border-2 border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {exercise}
                </button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.1 }}
          >
            <GlassCard>
              <div className="text-center space-y-2">
                <h3 className="text-white/60 text-sm">Current Weight</h3>
                <p className="text-white text-4xl font-bold">{stats.current}</p>
                <p className="text-white/50 text-xs">lbs</p>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.2 }}
          >
            <GlassCard>
              <div className="text-center space-y-2">
                <h3 className="text-white/60 text-sm">Personal Record</h3>
                <p className="text-orange-400 text-4xl font-bold">{stats.max}</p>
                <p className="text-white/50 text-xs">lbs</p>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.3 }}
          >
            <GlassCard>
              <div className="text-center space-y-2">
                <h3 className="text-white/60 text-sm">Total Gain</h3>
                <p
                  className={`text-4xl font-bold ${
                    stats.gain > 0 ? 'text-green-400' : 'text-white'
                  }`}
                >
                  +{stats.gain}
                </p>
                <p className="text-white/50 text-xs">lbs</p>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Progress Chart */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ delay: 0.4 }}
        >
          <GlassCard>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-xl font-bold">{selectedExercise} Progress</h3>
                <div className="text-right">
                  <p className="text-white/60 text-xs">Last 60 days</p>
                  <p className="text-green-400 text-sm font-semibold">
                    +{stats.gain} lbs gain
                  </p>
                </div>
              </div>

              {progressData.length > 0 ? (
                <ProgressChart data={progressData} exerciseName={selectedExercise} />
              ) : (
                <div className="text-center py-12 text-white/40">
                  <p>No data available for {selectedExercise}</p>
                  <p className="text-sm mt-2">Complete workouts to see your progress</p>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Workout History */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <GlassCard>
            <h3 className="text-white text-xl font-bold mb-4">Recent Workouts</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {workoutHistory.slice(-10).reverse().map((workout, index) => {
                const exercise = workout.exercises.find(
                  (ex) => ex.name === selectedExercise
                );
                if (!exercise) return null;

                return (
                  <div
                    key={index}
                    className="bg-white/5 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-white font-semibold">
                        {new Date(workout.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-white/50 text-sm">
                        {exercise.sets} sets × {exercise.reps} reps
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-400 text-2xl font-bold">
                        {exercise.weight}
                      </p>
                      <p className="text-white/50 text-xs">lbs</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Progress;
