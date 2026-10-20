(() => {
  const validThemes = new Set(window.siteThemeGroups.flatMap((group) => group.themes.map((theme) => theme.id)));

  let savedTheme = "";
  try {
    savedTheme = localStorage.getItem("homepage-theme") || "";
  } catch {
    // Storage may be unavailable; use the system preference for this visit.
  }

  let systemTheme = "aurora";
  try {
    if (window.matchMedia("(prefers-color-scheme: light)").matches) systemTheme = "white";
  } catch {
    // Older browsers without matchMedia retain the Aurora default.
  }
  document.documentElement.dataset.theme = validThemes.has(savedTheme) ? savedTheme : systemTheme;
})();
