export function formatBlogDateDisplay(dateStr: string): string {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    const t = Date.parse(dateStr);
    if (!isNaN(t)) {
      return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(t));
    }
  }
  const t = Date.parse(dateStr);
  if (!isNaN(t)) {
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(t));
  }
  return dateStr;
}

export function toDateInputValue(dateStr: string): string {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return dateStr.slice(0, 10);
  const t = Date.parse(dateStr);
  if (!isNaN(t)) return new Date(t).toISOString().slice(0, 10);
  return '';
}
