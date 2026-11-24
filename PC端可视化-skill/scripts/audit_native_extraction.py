#!/usr/bin/env python3
"""Verify catalog/source/layout coverage without Figma, network, or third-party modules."""
import hashlib
import json
import xml.etree.ElementTree as ET
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]

def audit_outline(sdk, item, errors):
    try:
        data = (sdk / item['outlinedSvgFile']).read_bytes()
        original = ET.parse(sdk / item['svgFile']).getroot()
        outlined = ET.fromstring(data)
        if outlined.tag != original.tag or any(
            outlined.get(key) != original.get(key) for key in ('width', 'height', 'viewBox')
        ):
            errors.append('Outline viewport mismatch: ' + item['id'])
        if any(node.tag.split('}')[-1] in ('text', 'tspan', 'textPath') for node in outlined.iter()):
            errors.append('Live text in outlined SVG: ' + item['id'])
        if hashlib.sha256(data).hexdigest() != item.get('outlinedSvgSha256'):
            errors.append('Outline checksum mismatch: ' + item['id'])
    except (OSError, ET.ParseError) as exc:
        errors.append(f"Outline {item['id']}: {exc}")

def run():
    sdk=ROOT/'assets/offline';errors=[];chart_count=layout_count=text_count=outlined_count=0
    catalog=json.loads((sdk/'native-source-catalog-2026-11-05.json').read_text())
    home_warning=json.loads((sdk/'home-warning-source-catalog-2026-11-05.json').read_text())
    outlined_counts = {'home': 0, 'warning': 0}
    warning_layout_count = 0
    for item in catalog['items'] + home_warning['items']:
        kind = item['kind']
        if kind in outlined_counts and item.get('outlinedSvgFile'):
            audit_outline(sdk, item, errors)
            outlined_counts[kind] += 1
        if kind == 'warning' and item.get('layoutParametersFile'):
            profile = json.loads((sdk / item['layoutParametersFile']).read_text())
            rows = profile['records']
            count = item['layoutNodeCount']
            if (profile['source'] != item['id'] or profile['recordCount'] != count
                or len(rows) != count or len({row['id'] for row in rows}) != count):
                errors.append('Warning layout count/identity: ' + item['id'])
            params = json.loads((sdk / item['parametersFile']).read_text())
            expected = {row['id'] for row in params['records'] if row['type'] == 'TEXT'}
            actual = {row['id'] for row in rows if row['type'] == 'TEXT' and row.get('textLayout')}
            if expected != actual:
                errors.append('Warning text layout coverage: ' + item['id'])
            warning_layout_count += count
    for item in catalog['items']:
        if item['kind']!='chart':continue
        chart_count+=1;params=json.loads((sdk/item['parametersFile']).read_text())
        if item.get('outlinedSvgFile'):
            audit_outline(sdk, item, errors)
            outlined_count += 1
        file=sdk/'evidence'/('chart-'+item['id'].replace(':','-')+'-layout.json')
        if not file.exists():errors.append('Missing layout: '+item['id']);continue
        layout=json.loads(file.read_text());records=layout['records'];ids=[x['id'] for x in records]
        if len(ids)!=len(set(ids)) or len(ids)!=layout['recordCount']:errors.append('Layout count/identity: '+item['id'])
        expected={x['id'] for x in params['records'] if x['type']=='TEXT'}
        actual={x['id'] for x in records if x['type']=='TEXT'}
        if expected!=actual:errors.append('Text coverage mismatch: '+item['id'])
        for row in records:
            if row['type']=='TEXT' and not row.get('textLayout'):errors.append('Missing text resizing: '+row['id'])
        layout_count+=len(ids);text_count+=len(actual)
    coverage = json.loads((sdk / 'coverage.json').read_text())
    funding_sources = coverage.get('funding_source_2026_11_16', {})
    for name, expected in funding_sources.items():
        try:
            svg = (sdk / 'native' / name).read_bytes()
            root = ET.fromstring(svg)
            if hashlib.sha256(svg).hexdigest() != expected['sha256'] or root.get('viewBox') != '0 0 343 326':
                errors.append('Funding source checksum/viewport mismatch: ' + name)
        except (OSError, ET.ParseError) as exc:
            errors.append(f'Funding source {name}: {exc}')
    native=list((sdk/'native').glob('*.svg'))
    for file in native:
        try:ET.parse(file)
        except ET.ParseError as exc:errors.append(file.name+': '+str(exc))
    result={'chartSources':chart_count,'fundingSourceFiles':len(funding_sources),'outlinedChartSources':outlined_count,'outlinedHomeSources':outlined_counts['home'],'outlinedWarningSources':outlined_counts['warning'],'warningLayoutAndTextNodes':warning_layout_count,'layoutAndTextNodes':layout_count,'textNodes':text_count,'validNativeSvgCount':len(native),'errors':errors,'scope':'Structural extraction checks only; not visual or dynamic-template approval.'}
    print(json.dumps(result,ensure_ascii=False,indent=2))
    if errors:raise SystemExit(1)
    return result
if __name__=='__main__':run()
