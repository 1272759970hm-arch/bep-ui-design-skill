# -*- coding: utf-8 -*-
"""Check offline package references, JSON, assets and entry metadata. Stdlib only."""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1];errors=[]
text=(root/'SKILL.md').read_text()
assert text.startswith('---\n')
assert re.search(r'^name: chart-skill$',text,re.M)
assert re.search(r'^description: .+',text,re.M)
for p in root.rglob('*.json'):
 try:json.loads(p.read_text())
 except Exception as e:errors.append(f'{p.relative_to(root)}: {e}')
for p in root.rglob('*.md'):
 for link in re.findall(r'\]\(([^)]+)\)',p.read_text()):
  if '://' in link or link.startswith('#'):continue
  target=link.split('#')[0]
  if target and not (p.parent/target).exists():errors.append(f'{p.relative_to(root)} missing {link}')
for name in ['yikan.js','yikan.css','assets.js','tokens.css','tokens.json','component-registry.json','coverage.json']:
 if not (root/'assets/offline'/name).exists():errors.append('Missing '+name)
for p in [root/'assets/offline/yikan.js',root/'scripts/build_page.py']:
 if re.search(r'fetch\(|XMLHttpRequest|https://figma',p.read_text()):errors.append('Unexpected runtime network code in '+p.name)
result={'metadata_basic_check':True,'local_link_and_json_check':not errors,'errors':errors,'official_yaml_validator':'未运行：本机缺少PyYAML；本脚本仅检查本包简单入口字段，不冒充完整YAML验证','runtime_test':'另见runtime.test.cjs与browser-validation.json'}
print(json.dumps(result,ensure_ascii=False,indent=2))
raise SystemExit(bool(errors))
