import { LinksRow } from "@/types/utils";
import { create } from "zustand";

interface AddEditDialog {
  isDialogOpen: boolean;
  linkToEdit: LinksRow | null;
  setIsDialogOpen: (isDialogOpen: boolean, linkToEdit?: LinksRow) => void;
}

export const useAddEditDialog = create<AddEditDialog>((set) => ({
  isDialogOpen: false,
  linkToEdit: null,
  setIsDialogOpen: (isDialogOpen, linkToEdit) =>
    set((state) => {
      return {
        isDialogOpen,
        linkToEdit,
      };
    }),
}));
