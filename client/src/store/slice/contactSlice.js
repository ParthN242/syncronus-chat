export const createContactSlice = (set) => ({
  selectedChatType: undefined,
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  selectedChatData: undefined,
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  contactList: undefined,
  setContactList: (contactList) => set({ contactList }),
  channelList: undefined,
  setChannelList: (channelList) => set({ channelList }),
});
