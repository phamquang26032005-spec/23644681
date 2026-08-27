// src/store/useAppStore.ts
// Quản lý State toàn cục (ví dụ placeholder cho Zustand/Redux)

export interface AppState {
    user: any | null;
    cart: any[];
}

export const initialAppState: AppState = {
    user: null,
    cart: [],
};
