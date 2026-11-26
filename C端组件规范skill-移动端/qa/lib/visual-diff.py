#!/usr/bin/env python3
"""Design QA · 视觉截图差异分析（唯一外部依赖：Pillow）
用法: python3 visual-diff.py <reference.png> <screenshot.png> [--json]
输出: JSON {ok, reason?, refSize, shotSize, sizeMatch, diffRatio, mae, regions:[...]}
只做确定性像素比对；不判断审美，不猜测设计意图。
"""
import sys, json

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"ok": False, "reason": "usage: visual-diff.py <reference> <screenshot>"}))
        return
    ref_path, shot_path = sys.argv[1], sys.argv[2]
    try:
        from PIL import Image, ImageChops, ImageStat
    except Exception as e:
        print(json.dumps({"ok": False, "reason": "Pillow unavailable: " + str(e)}))
        return
    try:
        ref = Image.open(ref_path).convert('RGB')
        shot = Image.open(shot_path).convert('RGB')
    except Exception as e:
        print(json.dumps({"ok": False, "reason": "cannot open image: " + str(e)}))
        return
    if ref.size != shot.size:
        print(json.dumps({
            "ok": True, "sizeMatch": False, "refSize": list(ref.size), "shotSize": list(shot.size),
            "reason": "尺寸不一致，需先对齐画布（Design QA 默认画布 375×auto，见 registry §5）",
            "diffRatio": None, "mae": None, "regions": [],
        }))
        return
    diff = ImageChops.difference(ref, shot)
    stat = ImageStat.Stat(diff)
    mae = round(sum(stat.mean) / 3, 3)
    gray = diff.convert('L')
    # 像素级差异率：通道差值 > 12 视为差异像素
    hist = gray.histogram()
    changed = sum(hist[13:])
    total = ref.size[0] * ref.size[1]
    ratio = round(changed / total, 5)
    # 分区差异：4×4 网格，找出差异最大的区域
    w, h = ref.size
    regions = []
    for ry in range(4):
        for rx in range(4):
            box = (rx * w // 4, ry * h // 4, (rx + 1) * w // 4, (ry + 1) * h // 4)
            sub = gray.crop(box)
            sub_hist = sub.histogram()
            sub_ratio = round(sum(sub_hist[13:]) / max(1, (box[2] - box[0]) * (box[3] - box[1])), 5)
            regions.append({"grid": f"r{ry+1}c{rx+1}", "box": list(box), "diffRatio": sub_ratio})
    regions.sort(key=lambda r: -r["diffRatio"])
    print(json.dumps({
        "ok": True, "sizeMatch": True, "refSize": list(ref.size), "shotSize": list(shot.size),
        "diffRatio": ratio, "mae": mae, "regions": regions[:6],
    }, ensure_ascii=False))

if __name__ == '__main__':
    main()
