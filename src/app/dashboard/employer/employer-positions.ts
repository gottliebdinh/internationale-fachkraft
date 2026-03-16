export const EMPLOYER_POSITIONS_KEY = "employer_positions";

export type StoredPosition = {
  id: string;
  title: string;
  startDate?: string;
  slots?: number;
};
