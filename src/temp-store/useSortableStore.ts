import { create } from "zustand";

export type Id = number | string;

interface SortableStore {
  items: Id[];
  activeId: Id | null;
  setActiveId: (id: Id | null) => void;
  addItem: (item: Id) => void;
  removeItem: (item: Id) => void;
}
const useSortableStore = create<SortableStore>((set) => ({
  items: [1, 2, 3],
  activeId: null,
  setActiveId: (id) => set({ activeId: id }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (i) =>
    set((state) => ({
      items: state.items.filter((item) => item !== i),
    })),
}));
export default useSortableStore;
