import { create } from 'zustand';
import { useUserStore } from './userStore';

interface ChatState {
  chatId: string | null;
  chatUser: { uid: string } | null; // Typage approprié pour chatUser
  user: { uid: string; blocked: string[] } | null; // Ajout de la propriété `user`
  isCurrentUserBlocked: boolean;
  isReceiverBlocked: boolean;
  changeChat: (chatId: string, user: { uid: string; blocked: string[] }) => void;
  changeBlock: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chatId: null,
  chatUser: null,
  user: null, // Initialisation de `user`
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,

  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;

    if (!currentUser) {
      // Vous pouvez gérer l'absence de currentUser ici, par exemple :
      console.error("Current user is not defined");
      return;
    }

    if (user.blocked.includes(currentUser.uid)) {
      set({
        chatId,
        chatUser: null,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    } else if (currentUser.blocked.includes(user.uid)) {
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
