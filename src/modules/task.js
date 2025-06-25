export default function createTask({
  title,
  description,
  dueDate,
  priority,
  notes = "",
  checklist = [],
}) {
  return {
    id: Date.now().toString(),
    title,
    description,
    dueDate,
    priority,
    notes,
    checklist,
    complete: false,
  };
}
