// ══════════════════════════════════════════════
// UAP DRONE CAM / LIVE VIDEO FEED
// ══════════════════════════════════════════════

// After page settles, reset iframe src to trigger autoplay.
// Chrome's autoplay policy blocks iframes on initial load even with allow="autoplay";
// reassigning src after a short delay works because the page is now "active".
window.addEventListener('load', () => {
  setTimeout(() => {
    const cam = document.getElementById('ufo-cam');
    if (!cam) return;
    const src = cam.src;
    cam.src = '';
    cam.src = src;
  }, 1200);
});
