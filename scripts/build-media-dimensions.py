#!/usr/bin/env python3
"""Record intrinsic image sizes so deferred images never collapse the existing layout."""
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
sizes = {}
for path in sorted((root / 'public' / 'media').rglob('*')):
    if not path.is_file():
        continue
    if path.suffix.lower() == '.svg':
        node = ET.parse(path).getroot()
        view_box = re.split(r'[ ,]+', node.get('viewBox', '').strip())
        if len(view_box) == 4:
            width, height = map(float, view_box[2:])
        else:
            width = float(node.get('width', '0').removesuffix('px'))
            height = float(node.get('height', '0').removesuffix('px'))
    elif path.suffix.lower() in {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif'}:
        with Image.open(path) as image:
            width, height = image.size
    else:
        continue
    if width > 0 and height > 0:
        sizes[path.relative_to(root / 'public').as_posix()] = [width, height]
output = root / 'src' / 'data' / 'media-dimensions.json'
output.write_text(json.dumps(sizes, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Recorded {len(sizes)} image dimensions; original media unchanged.')
