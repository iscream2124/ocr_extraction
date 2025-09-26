#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
테스트용 PDF 파일 생성
"""

import os
import sys

try:
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    REPORTLAB_AVAILABLE = True
except ImportError as e:
    print(f"ReportLab을 사용할 수 없습니다: {e}")
    print("대신 간단한 텍스트 파일을 생성합니다.")
    REPORTLAB_AVAILABLE = False

def create_test_pdf():
    """테스트용 PDF 파일 생성"""
    filename = "test_document.pdf"
    
    if not REPORTLAB_AVAILABLE:
        # ReportLab이 없으면 텍스트 파일 생성
        txt_filename = "test_document.txt"
        create_test_txt(txt_filename)
        print(f"ReportLab이 없어서 텍스트 파일을 생성했습니다: {txt_filename}")
        return txt_filename
    
    try:
        # PDF 생성
        c = canvas.Canvas(filename, pagesize=letter)
        width, height = letter
        
        # 제목
        c.setFont("Helvetica-Bold", 16)
        c.drawString(100, height - 100, "MinerU 테스트 문서")
        
        # 내용
        c.setFont("Helvetica", 12)
        y_position = height - 150
        
        content = [
            "이것은 MinerU GUI 테스트를 위한 PDF 문서입니다.",
            "",
            "지원되는 파일 형식:",
            "• PDF 파일 (.pdf)",
            "• PNG 이미지 (.png)", 
            "• JPG 이미지 (.jpg)",
            "• JPEG 이미지 (.jpeg)",
            "",
            "이 문서는 OCR 처리를 테스트하기 위해 생성되었습니다.",
            "MinerU를 사용하여 이 텍스트를 추출할 수 있습니다.",
            "",
            "한국어 텍스트도 지원됩니다:",
            "안녕하세요! 이것은 한국어 텍스트입니다.",
            "OCR 처리가 정상적으로 작동하는지 확인해보세요.",
            "",
            "수식 예시:",
            "E = mc²",
            "a² + b² = c²",
            "",
            "표 예시:",
            "항목    | 값",
            "-------|-----",
            "A      | 100",
            "B      | 200",
            "C      | 300"
        ]
        
        for line in content:
            c.drawString(100, y_position, line)
            y_position -= 20
            
        # 페이지 저장
        c.showPage()
        c.save()
        
        print(f"테스트 PDF 파일이 생성되었습니다: {filename}")
        return filename
        
    except Exception as e:
        print(f"PDF 생성 중 오류 발생: {e}")
        # 오류 발생 시 텍스트 파일 생성
        txt_filename = "test_document.txt"
        create_test_txt(txt_filename)
        print(f"대신 텍스트 파일을 생성했습니다: {txt_filename}")
        return txt_filename

def create_test_txt(filename):
    """테스트용 텍스트 파일 생성"""
    content = """MinerU 테스트 문서

이것은 MinerU GUI 테스트를 위한 문서입니다.

지원되는 파일 형식:
• PDF 파일 (.pdf)
• PNG 이미지 (.png)
• JPG 이미지 (.jpg)
• JPEG 이미지 (.jpeg)

이 문서는 OCR 처리를 테스트하기 위해 생성되었습니다.
MinerU를 사용하여 이 텍스트를 추출할 수 있습니다.

한국어 텍스트도 지원됩니다:
안녕하세요! 이것은 한국어 텍스트입니다.
OCR 처리가 정상적으로 작동하는지 확인해보세요.

수식 예시:
E = mc²
a² + b² = c²

표 예시:
항목    | 값
-------|-----
A      | 100
B      | 200
C      | 300
"""
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"테스트 텍스트 파일이 생성되었습니다: {filename}")
    return filename

if __name__ == "__main__":
    create_test_pdf()
