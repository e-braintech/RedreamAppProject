import {create} from 'zustand';
import {PillowStepState} from './state';

const useStepStore = create<PillowStepState>(set => ({
  shoulder: 0,
  neck: 0,
  head: 0,
  rightHead: 0,
  leftHead: 0,
  smell: false,
  setStep: (part, level) => set(state => ({...state, [part]: level})),
}));
