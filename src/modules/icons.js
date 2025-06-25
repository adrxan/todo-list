import {
  createIcons,
  Plus,
  LayoutList,
  CalendarClock,
  ListChecks,
  Trash2,
} from "lucide";

export const icons = {
  Plus,
  LayoutList,
  CalendarClock,
  ListChecks,
  Trash2,
};

export function refreshIcons() {
  createIcons({ icons });
}
