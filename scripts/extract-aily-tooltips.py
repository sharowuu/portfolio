"""Extract existing Aily callout artwork without altering original SVG assets.
Run from any directory with python3 scripts/extract-aily-tooltips.py.
"""
from copy import deepcopy
import json
from pathlib import Path
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SVG = 'http://www.w3.org/2000/svg'
ET.register_namespace('', SVG)
ET.register_namespace('xlink', 'http://www.w3.org/1999/xlink')
OUTPUT = ROOT / 'public/media/tooltip-layers'
OUTPUT.mkdir(exist_ok=True)
manifest = {}


def path_bounds(path):
    tokens = re.findall(r'[MLHVCZmlhvcz]|[-+]?(?:\d*\.\d+|\d+)', path)
    points, index, x, y = [], 0, 0.0, 0.0
    sizes = {'M': 2, 'L': 2, 'H': 1, 'V': 1, 'C': 6, 'Z': 0}
    command = ''
    while index < len(tokens):
        if tokens[index].isalpha():
            command = tokens[index]
            index += 1
        assert command in sizes, f'Unsupported path command: {command}'
        count = sizes[command]
        if not count:
            continue
        values = [float(v) for v in tokens[index:index + count]]
        index += count
        if command == 'H':
            x = values[0]
            points.append((x, y))
        elif command == 'V':
            y = values[0]
            points.append((x, y))
        else:
            points.extend(zip(values[::2], values[1::2]))
            x, y = values[-2:]
    return min(p[0] for p in points), min(p[1] for p in points), max(p[0] for p in points), max(p[1] for p in points)


for filename in ['aily-revised-layout.json', 'aily-framework-layout.json']:
    pages = json.loads((ROOT / 'src/data' / filename).read_text())
    for page in pages:
        labels = [b for b in page['texts'] if b['color'].upper() == '#455E83' and b['size'] == 12]
        if not labels:
            continue
        source = page['art']
        root = ET.parse(ROOT / 'public' / source).getroot()
        original = ET.tostring(root)
        origin_x, origin_y, _, _ = map(float, root.attrib['viewBox'].split())
        parents = {child: parent for parent in root.iter() for child in parent}
        bubbles = [e for e in root.iter() if e.tag == f'{{{SVG}}}path' and e.get('fill', '').upper() == '#F1F4F7']
        dots = [e for e in root.iter() if e.tag == f'{{{SVG}}}circle' and (e.get('fill', '').upper() == '#455E83' or e.get('stroke', '').upper() == '#455E83')]
        assert len(bubbles) == len(labels)
        tooltips, matched = [], set()
        for bubble in bubbles:
            xmin, ymin, xmax, ymax = path_bounds(bubble.attrib['d'])
            center_y = (ymin + ymax) / 2
            nearby = [d for d in dots if abs(float(d.attrib['cy']) - center_y) < .1]
            assert len(nearby) == 2
            label_index, label = min(enumerate(labels), key=lambda pair: abs(pair[1]['lines'][0]['y'] + origin_y - (center_y + 4.32)))
            assert label_index not in matched
            matched.add(label_index)
            assert abs(label['lines'][0]['y'] + origin_y - center_y - 4.32) < .01
            dot_x = float(nearby[0].attrib['cx'])
            left, right = min(xmin, dot_x - 3.5) - origin_x, max(xmax, dot_x + 3.5) - origin_x
            top, bottom = ymin - origin_y, ymax - origin_y
            tooltips.append({
                'text': ''.join(line['text'] for line in label['lines']),
                'x': left, 'y': top, 'width': right - left, 'height': bottom - top,
                'viewBox': f'{left + origin_x} {top + origin_y} {right - left} {bottom - top}',
                'path': bubble.attrib['d'], 'dotX': dot_x, 'dotY': center_y,
                'textX': label['lines'][0]['x'] - left,
                'textY': label['lines'][0]['y'] - 12 * .86 - top,
                'origin': 'right center' if dot_x > xmax else 'left center',
            })
            parent = parents[bubble]
            assert parent.tag == f'{{{SVG}}}g' and len(parent) == 1
            parents[parent].remove(parent)
            for dot in nearby:
                parents[dot].remove(dot)
        tooltips.sort(key=lambda item: (item['y'], item['x']))
        clean_name = Path(source).name
        ET.ElementTree(root).write(OUTPUT / clean_name, encoding='utf-8', xml_declaration=True)
        manifest[source] = {'art': f'media/tooltip-layers/{clean_name}', 'tooltips': tooltips}
        # Validate only the selected callout layers changed; all other SVG nodes survive.
        assert len([e for e in root.iter() if e.get('fill', '').upper() == '#F1F4F7']) == 0
        assert original != ET.tostring(root)

assert sum(len(item['tooltips']) for item in manifest.values()) == 9
(ROOT / 'src/data/aily-tooltips.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'assets': len(manifest), 'tooltips': sum(len(item['tooltips']) for item in manifest.values()), 'originals_preserved': True}, ensure_ascii=False))
