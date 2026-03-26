#!/usr/bin/env python3
"""Launch VIBE_DASHBOARD in Chrome - app mode, always on top."""

import subprocess
import sys
import os
import time

DASHBOARD = os.path.join(os.path.dirname(os.path.abspath(__file__)), "index.html")
FILE_URL  = "file:///" + DASHBOARD.replace("\\", "/").replace(" ", "%20")

CHROME_PATHS = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
]

def find_chrome():
    for path in CHROME_PATHS:
        if os.path.exists(path):
            return path
    return None

def launch():
    chrome = find_chrome()
    if not chrome:
        print("[ERROR] Chrome not found. Tried:")
        for p in CHROME_PATHS: print(" ", p)
        sys.exit(1)

    args = [
        chrome,
        f"--app={FILE_URL}",
        "--window-size=1400,900",
        "--window-position=0,0",
        "--disable-extensions",
        "--no-first-run",
        "--no-default-browser-check",
        "--autoplay-policy=no-user-gesture-required",
    ]

    print(f"[VIBE_DASHBOARD] Launching...")
    print(f"[VIBE_DASHBOARD] File: {DASHBOARD}")
    proc = subprocess.Popen(args)

    # Wait for Chrome to open, then use pywin32 to set always-on-top
    time.sleep(1.5)
    try:
        import win32gui, win32con
        def make_topmost(hwnd, _):
            title = win32gui.GetWindowText(hwnd)
            if "VIBE_DASHBOARD" in title or "vibe_code_dashboard" in title.lower():
                win32gui.SetWindowPos(
                    hwnd, win32con.HWND_TOPMOST, 0, 0, 0, 0,
                    win32con.SWP_NOMOVE | win32con.SWP_NOSIZE
                )
                print(f"[VIBE_DASHBOARD] Always-on-top set ✓ (window: '{title}')")
        win32gui.EnumWindows(make_topmost, None)
    except ImportError:
        print("[VIBE_DASHBOARD] Note: install pywin32 for always-on-top support")
        print("  pip install pywin32")
        print("[VIBE_DASHBOARD] Running without always-on-top.")

    print("[VIBE_DASHBOARD] Dashboard is running. Close Chrome to exit.")
    proc.wait()

if __name__ == "__main__":
    launch()
