import { atom } from "recoil";

import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist({ storage: sessionStorage });

export const loggedInUser = atom({
  key: "loggedInUser",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const chatActiveContact = atom({
  key: "chatActiveContact",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const chatMessages = atom({
  key: "chatMessages",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const chatContacts = atom({
  key: "chatContacts",
  default: false,
  effects_UNSTABLE: [persistAtom],
});
export const chatUsers = atom({
  key: "chatUsers",
  default: false,
  effects_UNSTABLE: [persistAtom],
});
