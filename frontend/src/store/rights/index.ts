import { RightRole } from 'edifice-ts-client';
import { create } from 'zustand';

type UserRights = Record<RightRole, boolean>;

interface UserRightsState {
  userRights: UserRights;
  setUserRights: (rights: UserRights) => void;
}

/**
 * useUserRightsStore
 * Basic store for managing "rights"
 */
export const useUserRightsStore = create<UserRightsState>((set) => ({
  userRights: {
    creator: false,
    contrib: false,
    manager: false,
    read: false,
  },
  setUserRights: (rights: UserRights) => set({ userRights: rights }),
}));
