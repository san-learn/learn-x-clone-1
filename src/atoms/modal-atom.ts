import { atom } from "recoil";

export const isOpenState = atom({
  key: "isOpenState",
  default: false,
});

export const postIdState = atom({
  key: "postIdState",
  default: "",
});
