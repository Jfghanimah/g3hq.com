// ══ APP INIT ══
// Cross-module resize handler
window.addEventListener('resize', () => {
  setupRadar();
  drawFlightMap();
});
