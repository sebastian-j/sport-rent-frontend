const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export function resolveImageUrl(image?: string | null): string {
  if (!image) return '';
  if (/^(https?:|data:)/.test(image)) return image;
  return `${API_URL}/${image.replace(/^\//, '')}`;
}

export function resolveImageUrls(images?: string[] | null): string[] {
  return (images ?? []).map(resolveImageUrl);
}
