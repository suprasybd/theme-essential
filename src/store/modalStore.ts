import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ModalPathTypes {
  modal: Record<string, string | number>;
  setModalPath: (data: Record<string, string | number>) => void;
  clearModalPath: () => void;
}

export const useModalStore = create<ModalPathTypes>()(
  devtools((set) => ({
    modal: {},
    setModalPath(data) {
      set((state) => ({ modal: data }));
    },
    clearModalPath() {
      set((state) => ({ modal: {} }));
    },
  }))
);
