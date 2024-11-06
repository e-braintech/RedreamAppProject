import {create} from 'zustand';
import {loadStepLevel, saveStepLevel} from '../storage/storage';
import {PillowStepState} from './state';

const useStepStore = create<PillowStepState>(set => ({
  shoulder: loadStepLevel('shoulder'),
  neck: loadStepLevel('neck'),
  head: loadStepLevel('head'),
  rightHead: loadStepLevel('rightHead'),
  leftHead: loadStepLevel('leftHead'),
  smell: loadStepLevel('smell') === 1,
  setStep: (part, level) => {
    set(state => ({...state, [part]: level}));
    saveStepLevel(part, level); // MMKV에 저장
  },
}));

export default useStepStore;
