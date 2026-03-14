#!/usr/bin/env python3
"""Macht weiße und nahezu weiße Pixel in PNGs transparent."""
from pathlib import Path

from PIL import Image

FUNKTIONIERT = Path(__file__).resolve().parent.parent / "public" / "funktioniert"
# Ab diesem Grauwert (0–255) gilt Pixel als „weiß“ und wird transparent
WHITE_THRESHOLD = 250


def remove_white_bg(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    data = img.getdata()
    out = []
    for item in data:
        r, g, b, a = item
        if r >= WHITE_THRESHOLD and g >= WHITE_THRESHOLD and b >= WHITE_THRESHOLD:
            out.append((r, g, b, 0))
        else:
            out.append(item)
    img.putdata(out)
    return img


def main():
    for path in sorted(FUNKTIONIERT.glob("*.png")):
        print(f"Verarbeite {path.name} …")
        img = Image.open(path)
        img = remove_white_bg(img)
        img.save(path, "PNG")
    print("Fertig.")


if __name__ == "__main__":
    main()
