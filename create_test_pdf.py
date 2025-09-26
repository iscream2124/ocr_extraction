#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
테스트용 PDF 파일 생성
"""

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

def create_test_pdf():
    """테스트용 PDF 파일 생성"""
    filename = "test_document.pdf"
    
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

if __name__ == "__main__":
    create_test_pdf()
