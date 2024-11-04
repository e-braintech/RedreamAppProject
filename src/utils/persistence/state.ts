export interface PillowStepState {
  shoulder: number;
  neck: number;
  head: number;
  rightHead: number;
  leftHead: number;
  setStep: (part: string, level: number) => void;
}
