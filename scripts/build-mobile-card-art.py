#!/usr/bin/env python3
"""Derive mobile-only flat card backgrounds; preserve all original SVG artwork."""
import re
import xml.etree.ElementTree as ET
from pathlib import Path

root = Path(__file__).resolve().parents[1] / 'public' / 'media'
names = [
    'miaoda-core-collaboration.svg',
    'miaoda-beauty-evolution.svg',
    'miaoda-beauty-stage-01-perspective-v3.svg',
    'miaoda-beauty-stage-02.svg',
    'miaoda-beauty-stage-03.svg',
    'miaoda-beauty-stage-04.svg',
    'miaoda-beauty-stage-05.svg',
]
output = root / 'mobile'
output.mkdir(exist_ok=True)
for name in names:
    source = (root / name).read_text(encoding='utf-8')
    node = ET.fromstring(source)
    x, y, width, height = map(float, node.attrib['viewBox'].split())
    changes = [0]

    def flatten(match):
        text = match.group(0)
        rect = ET.fromstring(text)
        rx, ry = float(rect.get('x', '0')), float(rect.get('y', '0'))
        rw, rh = float(rect.get('width', '0')), float(rect.get('height', '0'))
        if (rx, ry, rw, rh) == (x, y, width, height):
            # Only the full-card surface/mask changes. Interior UI radii stay intact.
            text = re.sub(r'\s+r[xy]="[^"]*"', '', text)
            changes[0] += 1
        elif name.startswith('miaoda-beauty-') and rx == 0 and ry == 0 and rw == 1440 and rect.get('fill') == '#F6F6F6':
            # Exported full-artboard backdrop can show through the extended video area.
            text = text.replace('#F6F6F6', '#E5EAF0')
            changes[0] += 1
        return text

    result = re.sub(r'<rect\b[^>]*/>', flatten, source)
    assert changes[0], f'No outer background found: {name}'
    ET.fromstring(result)
    (output / name).write_text(result, encoding='utf-8')
    print(f'{name}: {changes[0]} outer background/mask adjustments')
