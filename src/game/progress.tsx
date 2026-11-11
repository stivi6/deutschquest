import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  freshProgress,
  readProgress,
  writeProgress,
  saveAttempt,
  resetStoredProgress,
  type Progress,
  type Answer,
} from "./logic";
type Game = {
  progress: Progress;
  ready: boolean;
  storageWarning: boolean;
  finish: (id: string, answers: Answer[]) => void;
  reset: () => void;
  visit: (id: string) => void;
};
const Context = createContext<Game | null>(null);
export function GameProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(freshProgress);
  const [ready, setReady] = useState(false);
  const [storageWarning, setWarning] = useState(false);
  useEffect(() => {
    setProgress(readProgress());
    setReady(true);
  }, []);
  function persist(next: Progress) {
    setProgress(next);
    setWarning(!writeProgress(next));
  }
  function finish(id: string, answers: Answer[]) {
    persist(saveAttempt(progress, id, answers));
  }
  function reset() {
    const cleared = resetStoredProgress();
    setProgress(freshProgress());
    setWarning(!cleared);
  }
  function visit(id: string) {
    persist({ ...progress, lastVisitedExerciseId: id, updatedAt: new Date().toISOString() });
  }
  return (
    <Context.Provider value={{ progress, ready, storageWarning, finish, reset, visit }}>
      {children}
    </Context.Provider>
  );
}
export function useGame() {
  const value = useContext(Context);
  if (!value) throw new Error("GameProvider is required");
  return value;
}
