export interface GameState {
  updateRendering: () => void;
  processInput: (inputString: string) => Promise<void>;
  stopRendering: () => void;
  startRendering: () => void;
}
