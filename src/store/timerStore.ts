import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/utils/constants';

export interface TimerState {
  endTime: number | null;
  startTime: number | null;
  isRunning: boolean;
  isPaused: boolean;
  duration: number;
  isComplete: boolean;
}

export interface TimerActions {
  setTimer: (duration: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  completeTimer: () => void;
}

export type TimerStore = TimerState & TimerActions;

const initialState: TimerState = {
  endTime: null,
  startTime: null,
  isRunning: false,
  isPaused: false,
  duration: 0,
  isComplete: false,
};

export const useTimerStore = create<TimerStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      setTimer: (duration: number) => {
        set({
          duration,
          isComplete: false,
        });
      },
      
      startTimer: () => {
        const now = Date.now();
        const duration = useTimerStore.getState().duration;
        
        set({
          startTime: now,
          endTime: now + duration,
          isRunning: true,
          isPaused: false,
          isComplete: false,
        });
      },
      
      pauseTimer: () => {
        const { endTime } = useTimerStore.getState();
        const remainingTime = endTime ? endTime - Date.now() : 0;
        
        set({
          endTime: null,
          duration: remainingTime,
          isRunning: false,
          isPaused: true,
        });
      },
      
      resumeTimer: () => {
        const now = Date.now();
        const duration = useTimerStore.getState().duration;
        
        set({
          startTime: now,
          endTime: now + duration,
          isRunning: true,
          isPaused: false,
        });
      },
      
      resetTimer: () => {
        set({
          ...initialState,
        });
      },
      
      completeTimer: () => {
        set({
          isRunning: false,
          isPaused: false,
          isComplete: true,
        });
      },
    }),
    {
      name: STORAGE_KEYS.TIMER_STATE,
      storage: createJSONStorage(() => localStorage),
    }
  )
); 