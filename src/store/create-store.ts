import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createStore } from "./patterns";

const useStore = create(
  persist(immer(createStore), {
    name: "flow-store", // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
  })
);

export default useStore
