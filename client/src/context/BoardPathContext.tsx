import { createContext, useContext, useState, ReactNode } from "react";
import { CompleteKanbanBoard } from "@/lib/types";

type StackContextType = {
  stack: CompleteKanbanBoard[];
  push: (board: CompleteKanbanBoard) => void;
  pop: () => CompleteKanbanBoard | undefined;
  clearStack: () => void;
};

const StackContext = createContext<StackContextType | undefined>(undefined);

export function QueueProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<CompleteKanbanBoard[]>([]);

  const push = (board: CompleteKanbanBoard) => {
    setStack((prev) => [...prev, board]);
  };

  const pop = () => {
    let removedBoard: CompleteKanbanBoard | undefined;
    setStack((prev) => {
      if (prev.length === 0) return prev;
      removedBoard = prev[0];
      return prev.slice(1);
    });
    return removedBoard;
  };

  const clearStack = () => {
    setStack([]);
  };

  return (
    <StackContext.Provider value={{ stack, push, pop, clearStack }}>
      {children}
    </StackContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(StackContext);
  if (!context) {
    throw new Error("useStack must be used within a StackProvider");
  }
  return context;
}