#!/usr/bin/env python3
"""Design QA 图像探针：alpha / blank / compare 三个子命令，输出 JSON。"""
import sys, json, io, base64, os
from PIL import Image, ImageChops


def alpha(files):
    out = []
    for f in files:
        try:
            im = Image.open(f).convert('RGBA')
            w, h = im.size
            px = im.load()
            corners = [px[0, 0][3], px[w - 1, 0][3], px[0, h - 1][3], px[w - 1, h - 1][3]]
            opaque = sum(1 for y in range(0, h, max(1, h // 60))
                         for x in range(0, w, max(1, w // 60)) if px[x, y][3] > 8)
            total = len(range(0, h, max(1, h // 60))) * len(range(0, w, max(1, w // 60)))
            out.append({'file': os.path.basename(f), 'size': [w, h],
                        'cornerAlpha': corners, 'transparent': max(corners) == 0,
                        'opaqueRatio': round(opaque / max(1, total), 4)})
        except Exception as e:
            out.append({'file': os.path.basename(f), 'error': str(e)})
    return out


def blank(f):
    try:
        im = Image.open(f).convert('RGB')
        colors = im.getcolors(maxcolors=1 << 24)
        n = len(colors) if colors else 0
        w, h = im.size
        return {'file': os.path.basename(f), 'size': [w, h], 'uniqueColors': n,
                'blank': n <= 2, 'note': '颜色数≤2 视为渲染空白/纯色'}
    except Exception as e:
        return {'file': os.path.basename(f), 'error': str(e)}


def compare(a, b, thr=28):
    try:
        ia = Image.open(a).convert('RGB')
        ib = Image.open(b).convert('RGB')
        if ia.size != ib.size:
            ib = ib.resize(ia.size)
        w, h = ia.size
        diff = ImageChops.difference(ia, ib).convert('L').point(lambda p: 255 if p > thr else 0)
        bw = diff.point(lambda p: 1 if p else 0)
        changed = bw.histogram()[1]  # 值为 1 的像素数，避免旧版 getdata 弃用告警
        ratio = changed / float(w * h)
        # 4x4 网格差异分布，定位偏差区域
        regions = []
        for gy in range(4):
            for gx in range(4):
                box = (gx * w // 4, gy * h // 4, (gx + 1) * w // 4, (gy + 1) * h // 4)
                sub = bw.crop(box)
                r = sub.histogram()[1] / float(max(1, (box[2] - box[0]) * (box[3] - box[1])))
                if r > 0.05:
                    regions.append({'grid': [gx, gy], 'ratio': round(r, 4)})
        regions.sort(key=lambda x: -x['ratio'])
        return {'a': os.path.basename(a), 'b': os.path.basename(b), 'size': [w, h],
                'diffRatio': round(ratio, 4), 'thresholdPx': thr,
                'topRegions': regions[:6]}
    except Exception as e:
        return {'error': str(e)}


def main():
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'usage: img_probe.py alpha|blank|compare ...'}))
        return
    cmd = sys.argv[1]
    if cmd == 'alpha':
        res = alpha(sys.argv[2:])
    elif cmd == 'blank':
        res = blank(sys.argv[2])
    elif cmd == 'compare':
        res = compare(sys.argv[2], sys.argv[3])
    else:
        res = {'error': 'unknown command'}
    print(json.dumps(res, ensure_ascii=False))


if __name__ == '__main__':
    main()
