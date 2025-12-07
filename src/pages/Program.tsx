import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components';
import { WORKOUT_PROGRAM, WARM_UP_PROTOCOL, WorkoutExercise } from '../data/workoutProgram';
import { useAuth } from '../contexts/AuthContext';
import { workoutService } from '../services/workoutService';

interface WorkoutProgression {
  currentWeek: number;
  completedDays: number[];
}

const Program: React.FC = () => {
  const { user } = useAuth();
  const [progression, setProgression] = useState<WorkoutProgression>({
    currentWeek: 1,
    completedDays: [],
  });
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(0);
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);

  // Load progression from backend/storage
  useEffect(() => {
    if (!user) return;

    const loadProgression = async () => {
      const saved = await workoutService.getProgression(user.id);
      if (saved) {
        setProgression(saved);
        setSelectedWeek(saved.currentWeek);
      }
    };

    loadProgression();
  }, [user]);

  // Check if a week is unlocked (can be viewed)
  const isWeekUnlocked = (weekNumber: number): boolean => {
    return weekNumber <= progression.currentWeek;
  };

  const currentWeek = WORKOUT_PROGRAM.find(w => w.week === selectedWeek);
  const currentWorkout = currentWeek?.days[selectedDay];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 space-y-4 sm:space-y-6">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={cardVariants}>
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Training Program</h1>
          <p className="text-white/60 text-sm sm:text-base">Bodybuilding Transformation System - Beginner</p>
          <p className="text-orange-400 text-xs sm:text-sm mt-2">
            {currentWeek?.block || 'Foundation Block'} • Week {selectedWeek}
          </p>
        </motion.div>

        {/* Warm-Up Protocol */}
        <motion.div initial="hidden" animate="visible" variants={cardVariants} transition={{ delay: 0.1 }}>
          <GlassCard>
            <h3 className="text-white text-lg sm:text-xl font-bold mb-3 sm:mb-4">Warm-Up Protocol (5-10 mins)</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-orange-400 font-semibold mb-2">General Warm-Up</h4>
                <p className="text-white/80 text-sm mb-3">{WARM_UP_PROTOCOL.general.cardio}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {WARM_UP_PROTOCOL.general.dynamicStretches.map((stretch, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-3">
                      <p className="text-white text-sm font-medium">{stretch.name}</p>
                      <p className="text-white/60 text-xs">{stretch.reps}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-orange-400 font-semibold mb-2">Exercise-Specific Warm-Up</h4>
                <div className="space-y-2">
                  {Object.entries(WARM_UP_PROTOCOL.exerciseSpecific).map(([sets, desc]) => (
                    <div key={sets} className="bg-white/5 rounded-lg p-3">
                      <p className="text-white text-sm"><span className="font-semibold text-orange-400">{sets}:</span> {desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Week Selector */}
        <motion.div initial="hidden" animate="visible" variants={cardVariants} transition={{ delay: 0.2 }}>
          <GlassCard>
            <h3 className="text-white text-lg font-semibold mb-3">Select Week</h3>
            <p className="text-white/60 text-sm mb-4">
              You are on <span className="text-orange-400 font-semibold">Week {progression.currentWeek}</span>. Complete all 5 days to unlock the next week.
            </p>
            <div className="flex flex-wrap gap-3">
              {WORKOUT_PROGRAM.map((week) => {
                const isUnlocked = isWeekUnlocked(week.week);
                const isCurrent = week.week === progression.currentWeek;
                const isEmpty = week.days.length === 0;
                const isLocked = !isUnlocked || isEmpty;

                return (
                  <button
                    key={week.week}
                    onClick={() => isUnlocked && !isEmpty && setSelectedWeek(week.week)}
                    disabled={isLocked}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all relative ${
                      selectedWeek === week.week
                        ? 'bg-orange-500 text-white'
                        : isLocked
                        ? 'bg-white/5 text-white/30 cursor-not-allowed'
                        : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {!isUnlocked && !isEmpty && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span>Week {week.week}</span>
                      {isCurrent && <span className="ml-1 text-xs">(Current)</span>}
                    </div>
                    {isEmpty && <span className="text-xs block">Coming Soon</span>}
                    {!isUnlocked && !isEmpty && <span className="text-xs block">Locked</span>}
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* Day Selector */}
        <motion.div initial="hidden" animate="visible" variants={cardVariants} transition={{ delay: 0.3 }}>
          <GlassCard>
            <h3 className="text-white text-base sm:text-lg font-semibold mb-3">Select Workout Day</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3">
              {currentWeek?.days.map((day, idx) => {
                const isCompleted = selectedWeek === progression.currentWeek && progression.completedDays.includes(idx);

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDay(idx)}
                    className={`p-4 rounded-xl font-semibold transition-all relative ${
                      selectedDay === idx
                        ? 'bg-orange-500/30 border-2 border-orange-400 text-white'
                        : isCompleted
                        ? 'bg-green-500/10 border-2 border-green-400/50 text-white/90'
                        : 'bg-white/5 border-2 border-white/10 text-white/70 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {isCompleted && (
                      <div className="absolute top-2 right-2 text-green-400 text-xl">✓</div>
                    )}
                    <div className="text-xs text-white/60 mb-1">Day {idx + 1}</div>
                    <div>{day.name}</div>
                    <div className="text-xs text-white/60 mt-1">{day.exercises.length} exercises</div>
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* Workout Exercises */}
        {currentWorkout && (
          <motion.div initial="hidden" animate="visible" variants={cardVariants} transition={{ delay: 0.4 }}>
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white text-2xl font-bold">{currentWorkout.name}</h3>
                  <p className="text-white/60 text-sm mt-1">Week {selectedWeek} • Day {selectedDay + 1}</p>
                </div>
                <div className="text-right">
                  <p className="text-orange-400 text-3xl font-bold">{currentWorkout.exercises.length}</p>
                  <p className="text-white/60 text-sm">Exercises</p>
                </div>
              </div>

              <div className="space-y-3">
                {currentWorkout.exercises.map((exercise, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 rounded-xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setExpandedExercise(expandedExercise === idx ? null : idx)}
                      className="w-full p-4 text-left hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-orange-400 font-bold text-lg">#{idx + 1}</span>
                            <h4 className="text-white font-semibold text-lg">{exercise.name}</h4>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="text-white/60">
                              <span className="text-white font-medium">{exercise.workingSets}</span> sets × <span className="text-white font-medium">{exercise.reps}</span> reps
                            </span>
                            <span className="text-orange-400 font-medium">
                              RPE {exercise.lastSetRPE}
                            </span>
                            <span className="text-white/60">
                              Rest: {exercise.rest}
                            </span>
                          </div>
                        </div>
                        <svg
                          className={`w-6 h-6 text-white/60 transition-transform ${
                            expandedExercise === idx ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {expandedExercise === idx && (
                      <div className="px-4 pb-4 space-y-3">
                        {exercise.notes && (
                          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                            <p className="text-sm text-orange-200/90">
                              <span className="font-semibold text-orange-400">💡 Form Notes:</span> {exercise.notes}
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-white/60 text-xs mb-1">Warm-up Sets</p>
                            <p className="text-white font-semibold">{exercise.warmupSets}</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-white/60 text-xs mb-1">Intensity Technique</p>
                            <p className="text-white font-semibold">{exercise.intensityTechnique || 'N/A'}</p>
                          </div>
                        </div>

                        {(exercise.substitution1 || exercise.substitution2) && (
                          <div>
                            <p className="text-white/60 text-xs mb-2">Alternative Exercises:</p>
                            <div className="flex gap-2">
                              {exercise.substitution1 && (
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2 flex-1">
                                  <p className="text-blue-300 text-sm">{exercise.substitution1}</p>
                                </div>
                              )}
                              {exercise.substitution2 && (
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2 flex-1">
                                  <p className="text-blue-300 text-sm">{exercise.substitution2}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Quick Notes */}
        <motion.div initial="hidden" animate="visible" variants={cardVariants} transition={{ delay: 0.5 }}>
          <GlassCard>
            <h3 className="text-white text-lg font-semibold mb-3">📝 Important Program Notes</h3>
            <div className="space-y-2 text-sm text-white/80">
              <p>• Week 1: Take sets to RPE ~6-7 (leaving 3-4 reps in the tank) - this is a deload/intro week</p>
              <p>• After Week 1: Intensity increases to ~2-3 reps shy of failure</p>
              <p>• <span className="text-orange-400 font-semibold">Early Sets</span> = slightly easier than last set</p>
              <p>• <span className="text-orange-400 font-semibold">Last Set</span> = pushed closer to failure</p>
              <p>• Volume may feel low in Weeks 1-2 - focus on mastering technique!</p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Program;
