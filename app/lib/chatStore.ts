import { create } from 'zustand';
import { useUserStore } from './userStore';

interface ChatState {
  chatId: string | null;
  chatUser: any | null;
  isCurrentUserBlocked: boolean;
  isReceiverBlocked: boolean;
  changeChat: (chatId: string, user: { uid: string; blocked: string[] }) => void;
  changeBlock: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chatId: null,
  chatUser: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,

  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;

    if (user.blocked?.includes(currentUser?.uid)) {
      set({
        chatId,
        chatUser: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    } else if (currentUser?.blocked?.includes(user.uid)) {
      set({
        chatId,
        chatUser: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    } else {
      set({
        chatId,
        chatUser: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      });
    }
  },

  changeBlock: () => {
    set((state) => ({
      ...state,
      isReceiverBlocked: !state.isReceiverBlocked,
    }));
  },
}));
