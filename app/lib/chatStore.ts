import { create } from 'zustand';
import { useUserStore } from './userStore';

interface ChatState {
  chatId: string | null;
  chatUser: { uid: string } | null;
  user: { uid: string; blocked: string[] } | null;
  isCurrentUserBlocked: boolean;
  isReceiverBlocked: boolean;
  changeChat: (chatId: string, user: { uid: string; blocked: string[] }) => void;
  changeBlock: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chatId: null,
  chatUser: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,

  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;

    if (!currentUser || !user) {
      console.error("Current user or selected user is undefined");
      return;
    }

    const currentUserBlocked = currentUser.blocked || [];
    const userBlocked = user.blocked || [];

    if (userBlocked.includes(currentUser.uid)) {
      set({
        chatId,
        chatUser: null,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    } else if (currentUserBlocked.includes(user.uid)) {
      set({
        chatId,
        chatUser: user,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    } else {
      set({
        chatId,
        chatUser: user,
        user: user,
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
