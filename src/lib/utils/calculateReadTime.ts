function calculateReadTime(text: string, wpm: number = 200): number {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wpm);
  return minutes;
}

export default calculateReadTime;
