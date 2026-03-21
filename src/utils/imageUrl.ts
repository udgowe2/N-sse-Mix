export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path; // Already a full URL
  if (path.startsWith('data:image')) return path; // Base64 image
  
  // Prefix relative paths with the dynamically assigned API base URL (port 3000)
  const API_BASE = "";
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
};
