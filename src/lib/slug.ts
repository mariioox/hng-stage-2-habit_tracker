export function getHabitSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with single hyphen
    .replace(/[^a-z0-9-]/g, '')    // Remove non-alphanumeric except hyphens
    .replace(/^-+|-+$/g, '');      // Remove hyphens from start or end
}