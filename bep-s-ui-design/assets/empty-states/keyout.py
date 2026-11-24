#!/usr/bin/env python3
"""
BEP-S 缺省插画：白底抠除（透明化）

为什么需要这一步
----------------
Figma Dev Mode MCP `get_image` 导出的 PNG，会把 instance 框架的白底一起烘焙进去
（像素值实测纯 255,255,255，alpha 全 255）。直接贴到页面底色 #F7F8FA 上，
画面上就是一个明显的白色方块——这是 2026-11-05 被用户当场指出来的问题。

本脚本做"边缘连通域抠图"：
  1. 把 min(r,g,b) >= THRESHOLD 的像素判定为"白"；
  2. 从图片四边出发，做 4 邻接 BFS，只清除**与边缘连通**的那片白；
  3. 被插画轮廓包住的内部白色（吉祥物高光、白纸、白色衣物）原样保留。

为什么不用"全图白色一键透明"：吉祥物身上有白色部件，那样会把它们打穿。

用法
----
    python3 keyout.py <输入.png|目录> [输出目录]

    # 处理单张（输出到同目录，文件名加 _transparent 后缀）
    python3 keyout.py ../figma_out_123.png

    # 批量处理一个目录
    python3 keyout.py ./raw ./transparent

依赖：Pillow、numpy
    pip install pillow numpy
"""

import os
import sys
from collections import deque

import numpy as np
from PIL import Image

THRESHOLD = 244  # min(r,g,b) >= 该值视为白。太高会留白边，太低会啃坏浅色插画


def keyout(src: str, dst: str, threshold: int = THRESHOLD) -> dict:
    im = Image.open(src).convert("RGBA")
    arr = np.array(im)
    rgb = arr[:, :, :3].astype(np.int16)
    is_white = rgb.min(axis=2) >= threshold
    h, w = is_white.shape

    seen = np.zeros((h, w), bool)
    dq = deque()

    # 只从四边种子出发：边界上的白才可能是背景
    for x in range(w):
        for y in (0, h - 1):
            if is_white[y, x] and not seen[y, x]:
                seen[y, x] = True
                dq.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if is_white[y, x] and not seen[y, x]:
                seen[y, x] = True
                dq.append((y, x))

    while dq:
        y, x = dq.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and is_white[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True
                dq.append((ny, nx))

    removed = int(seen.sum())
    total_white = int(is_white.sum())
    arr[:, :, 3] = np.where(seen, 0, arr[:, :, 3])

    os.makedirs(os.path.dirname(os.path.abspath(dst)) or ".", exist_ok=True)
    Image.fromarray(arr, "RGBA").save(dst)

    return {
        "file": os.path.basename(src),
        "size": f"{w}x{h}",
        "removed": removed,
        "totalWhite": total_white,
        "keptInteriorWhite": total_white - removed,
    }


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    src = sys.argv[1]
    jobs = []
    if os.path.isdir(src):
        outdir = sys.argv[2] if len(sys.argv) > 2 else os.path.join(src, "transparent")
        for f in sorted(os.listdir(src)):
            if f.lower().endswith(".png"):
                jobs.append((os.path.join(src, f), os.path.join(outdir, f)))
    else:
        base, ext = os.path.splitext(src)
        dst = sys.argv[2] if len(sys.argv) > 2 else base + "_transparent" + ext
        if len(sys.argv) > 2 and os.path.isdir(sys.argv[2]):
            dst = os.path.join(sys.argv[2], os.path.basename(src))
        jobs.append((src, dst))

    for s, d in jobs:
        r = keyout(s, d)
        print(
            f"{r['file']}: {r['size']}  抠掉 {r['removed']} px / "
            f"纯白共 {r['totalWhite']} px（内部保留 {r['keptInteriorWhite']}）→ {d}"
        )

    print("\n自检：把结果合成到 #F7F8FA 上打开看，不应出现任何白色方块；")
    print("      插画内部的白色部件（高光/白纸）应当仍然存在，否则阈值调低到 240。")


if __name__ == "__main__":
    main()
