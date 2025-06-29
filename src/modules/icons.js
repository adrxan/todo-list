import {
  createIcons,
  Plus,
  LayoutList,
  CalendarClock,
  ListChecks,
  Trash2,
  Square,
  SquareCheck,
} from "lucide";

export const icons = {
  Plus,
  LayoutList,
  CalendarClock,
  ListChecks,
  Trash2,
  Square,
  SquareCheck,
};

export function refreshIcons() {
  createIcons({ icons });
}
