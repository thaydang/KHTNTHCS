#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Clean and restructure KHTN CSV files to 4-column format:
Tiết, Chủ đề, Bài dạy, Yêu cầu cần đạt
"""

import csv
import re
from pathlib import Path

def parse_khtn_csv(input_file):
    """Parse messy KHTN CSV and extract clean 4-column data."""
    rows = []
    
    try:
        with open(input_file, 'r', encoding='utf-8-sig') as f:
            content = f.read()
            
        # Split by newlines, handling multi-line cells
        lines = content.split('\n')
        current_row = ['', '', '', '']
        in_multiline = False
        
        for i, line in enumerate(lines):
            line = line.strip()
            if not line:
                continue
                
            # Skip header rows with non-data content
            if 'TIẾT' in line or 'Nội dung' in line or 'CHỦ ĐỀ' in line.upper():
                continue
            
            # Try to parse CSV line
            try:
                # Remove quotes and split carefully
                parts = [p.strip() for p in line.split(',')]
                
                # Filter and reconstruct
                if len(parts) >= 1:
                    tiet = parts[0].strip('"').strip()
                    chu_de = parts[1].strip('"').strip() if len(parts) > 1 else ''
                    bai_day = parts[2].strip('"').strip() if len(parts) > 2 else ''
                    
                    # Join remaining parts for requirements
                    yeu_cau = ''
                    if len(parts) > 3:
                        # Rejoin remaining parts, clean up
                        yeu_cau_parts = []
                        for p in parts[3:]:
                            p = p.strip().strip('"').strip()
                            if p and p.upper() not in ['', 'KTĐGgkI']:
                                yeu_cau_parts.append(p)
                        yeu_cau = ', '.join(yeu_cau_parts)
                    
                    # Only add if we have tiết and some content
                    if tiet and (bai_day or yeu_cau):
                        rows.append({
                            'Tiết': tiet,
                            'Chủ đề': chu_de,
                            'Bài dạy': bai_day,
                            'Yêu cầu cần đạt': yeu_cau
                        })
            except:
                pass
    
    except Exception as e:
        print(f"Error reading {input_file}: {e}")
        return []
    
    return rows

def write_clean_csv(output_file, rows):
    """Write clean 4-column CSV."""
    try:
        with open(output_file, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=['Tiết', 'Chủ đề', 'Bài dạy', 'Yêu cầu cần đạt'])
            writer.writeheader()
            writer.writerows(rows)
        print(f"✓ Cleaned: {output_file} ({len(rows)} rows)")
    except Exception as e:
        print(f"✗ Error writing {output_file}: {e}")

def main():
    base_dir = Path('C:/Users/dangt/.KHTN/KHTNTHCS/Tai-lieu-chung')
    
    files_to_clean = [
        ('KHOA HỌC TỰ NHIÊN - 2. KHTN 7.csv', 'KHTN 7 - Clean.csv'),
        ('KHOA HỌC TỰ NHIÊN - 3. KHTN 8.csv', 'KHTN 8 - Clean.csv'),
        ('KHOA HỌC TỰ NHIÊN - 4. KHTN 9.csv', 'KHTN 9 - Clean.csv'),
    ]
    
    for input_name, output_name in files_to_clean:
        input_path = base_dir / input_name
        output_path = base_dir / output_name
        
        print(f"\nProcessing {input_name}...")
        rows = parse_khtn_csv(str(input_path))
        write_clean_csv(str(output_path), rows)

if __name__ == '__main__':
    main()
