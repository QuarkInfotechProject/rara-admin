function applyFilters(values: Record<string, string | null | undefined>) {
  const pageURL = new URL(window.location.href);
  Object.entries(values).forEach(([key, value]) => {
    if (value !== "all" && value) {
      pageURL.searchParams.set(key, value);
    } else {
      pageURL.searchParams.delete(key);
    }
  });
  return {
    pageURL,
  };
}

export default applyFilters;
