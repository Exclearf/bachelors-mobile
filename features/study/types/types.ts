import { GlossTranslation } from "@/features/shared/types/types";

export type SignPageResult = {
  totalPages: number;
  results: GlossTranslation[];
  currentPage: number;
};
