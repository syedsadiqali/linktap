import { LinksRow } from "@/types/utils";
import { create } from "zustand";

interface LinkState {
  links: LinksRow[];
  addLink: (newLink: LinksRow) => void;
  setLinks: (links: LinksRow[]) => void;
  deleteLink: (linkId: string) => void;
  updateLink: (linkId: string, newData: Partial<LinksRow> | LinksRow) => void;
}

export const useLinks = create<LinkState>((set) => ({
  links: [],
  setLinks: (links: LinksRow[]) =>
    set((state) => {
      return { links };
    }),
  addLink: (newLink: LinksRow) =>
    set((state) => {
      return { links: [newLink, ...state.links] };
    }),
  deleteLink: (linkId: string) =>
    set((state) => {
      let a = state.links.findIndex((link) => link.id === linkId);

      return { links: state.links.filter((e, i) => i != a) };
    }),
  updateLink: (linkId, newData) => {
    set((state) => {
      let links = [...state.links];
      let indexToUpdate = state.links.findIndex((link) => link.id === linkId);
      links[indexToUpdate] = { ...links[indexToUpdate], ...newData };

      return {
        links: links,
      };
    });
  }
}));
