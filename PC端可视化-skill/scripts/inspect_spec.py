# -*- coding: utf-8 -*-
"""Find archived local specification records; no Figma/network dependency."""
import argparse,json
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('keyword');p.add_argument('--limit',type=int,default=15);a=p.parse_args()
r=Path(__file__).resolve().parents[1]/'assets/offline';records=json.loads((r/'geometry-catalog.json').read_text());matches=[x for x in records if a.keyword.lower() in json.dumps(x,ensure_ascii=False).lower()]
print(json.dumps({'total_matches':len(matches),'shown':matches[:max(1,a.limit)],'note':'截取展示；全部记录在geometry-catalog.json，节点是归档来源，不需联网'},ensure_ascii=False,indent=2))
