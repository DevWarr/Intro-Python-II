export interface GameState {
  updateRendering: () => void;
  processInput: (inputString: string, resetInputCallback: () => void) => Promise<void>;
  stopRendering: () => void;
  startRendering: () => void;
}
