import { create } from "zustand";

export type Id = number | string;

interface SortableStore {
  items: Id[];
  activeId: Id | null;
  setActiveId: (id: Id|null) => void;
  addItem: (item: Id) => void;
  overId: Id | null;
  setOverId: (id: Id|null) => void;
  removeItem: (item: Id) => void;
}
const useSortableStore = create<SortableStore>((set) => ({
  items: [1, 2, 3],
  activeId: null,
  overId: null,
  setOverId: (id: Id|null) => set((state) => ({ ...state, overId: id })),
  setActiveId: (id: Id|null) => set((state) => ({ ...state, activeId: id })),
  addItem: (item: any) =>
    set((state: { items: any }) => ({ items: [...state.items, item] })),
  removeItem: (i: any) =>
    set((state: { items: any[] }) => ({
      items: state.items.filter((item: any) => item !== i),
    })),
}));
export default useSortableStore;
