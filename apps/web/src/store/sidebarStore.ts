import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface StoreStoreType {
  isSideBarOpen: boolean;
  toggleSideBar: () => void;
}

export const useSidebarStore = create<StoreStoreType>()(
  devtools((set) => ({
    isSideBarOpen: true,
    toggleSideBar() {
      set((state) => ({ isSideBarOpen: !state.isSideBarOpen }));
    },
  }))
);
