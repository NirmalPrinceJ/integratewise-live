import { createContext, useContext, useState, ReactNode } from 'react';

export interface WorkspaceBagItem {
  id: string;
  type: string;
  label: string;
  data: any;
}

interface WorkspaceBagContextType {
  items: WorkspaceBagItem[];
  addItem: (item: WorkspaceBagItem) => void;
  removeItem: (id: string) => void;
  clearBag: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const WorkspaceBagContext = createContext<WorkspaceBagContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearBag: () => {},
  isOpen: false,
  setIsOpen: () => {},
});

export function WorkspaceBagProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WorkspaceBagItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <WorkspaceBagContext.Provider
      value={{
        items,
        addItem: (item) => setItems((prev) => [...prev, item]),
        removeItem: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
        clearBag: () => setItems([]),
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </WorkspaceBagContext.Provider>
  );
}

export function useWorkspaceBag() {
  return useContext(WorkspaceBagContext);
}

export function useWorkspaceBagSafe() {
  try {
    return useContext(WorkspaceBagContext);
  } catch {
    return {
      items: [],
      addItem: () => {},
      removeItem: () => {},
      clearBag: () => {},
      isOpen: false,
      setIsOpen: () => {},
    };
  }
}

export default WorkspaceBagContext;
