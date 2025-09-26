#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MinerU GUI - OCR 텍스트 추출 도구
tkinter를 사용한 사용자 친화적인 인터페이스
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox, scrolledtext
import subprocess
import os
import threading
import sys
from pathlib import Path

class MinerUGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("MinerU OCR 텍스트 추출 도구")
        self.root.geometry("800x600")
        self.root.resizable(True, True)
        
        # 변수 초기화
        self.input_path = tk.StringVar()
        self.output_path = tk.StringVar()
        self.method = tk.StringVar(value="auto")
        self.backend = tk.StringVar(value="pipeline")
        self.language = tk.StringVar(value="korean")
        self.formula_enabled = tk.BooleanVar(value=True)
        self.table_enabled = tk.BooleanVar(value=True)
        self.device = tk.StringVar(value="cpu")
        
        self.setup_ui()
        
    def setup_ui(self):
        """UI 구성 요소 설정"""
        # 메인 프레임
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # 그리드 가중치 설정
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=1)
        
        # 제목
        title_label = ttk.Label(main_frame, text="MinerU OCR 텍스트 추출 도구", 
                               font=("Arial", 16, "bold"))
        title_label.grid(row=0, column=0, columnspan=3, pady=(0, 20))
        
        # 파일 선택 섹션
        self.create_file_section(main_frame, 1)
        
        # 출력 디렉토리 섹션
        self.create_output_section(main_frame, 2)
        
        # 옵션 설정 섹션
        self.create_options_section(main_frame, 3)
        
        # 처리 버튼
        self.create_control_section(main_frame, 4)
        
        # 로그 출력 섹션
        self.create_log_section(main_frame, 5)
        
    def create_file_section(self, parent, row):
        """파일 선택 섹션 생성"""
        # 파일 선택
        ttk.Label(parent, text="입력 파일/폴더:").grid(row=row, column=0, sticky=tk.W, pady=5)
        input_entry = ttk.Entry(parent, textvariable=self.input_path, width=50)
        input_entry.grid(row=row, column=1, sticky=(tk.W, tk.E), padx=(5, 5), pady=5)
        
        # 파일 경로 변경 시 검증
        input_entry.bind('<KeyRelease>', self.validate_input_path)
        input_entry.bind('<Tab>', self.auto_complete_path)
        
        # 버튼 프레임
        button_frame = ttk.Frame(parent)
        button_frame.grid(row=row, column=2, pady=5)
        
        ttk.Button(button_frame, text="파일", command=self.browse_input_file).pack(side=tk.LEFT, padx=(0, 2))
        ttk.Button(button_frame, text="폴더", command=self.browse_input_folder).pack(side=tk.LEFT)
        
        # 도움말 텍스트
        help_text = "지원 형식: PDF, PNG, JPG, JPEG | 직접 경로 입력 또는 버튼 사용 | Tab: 자동완성"
        help_label = ttk.Label(parent, text=help_text, font=("Arial", 8), foreground="gray")
        help_label.grid(row=row+1, column=1, sticky=tk.W, padx=(5, 0), pady=(0, 5))
        
    def create_output_section(self, parent, row):
        """출력 디렉토리 섹션 생성"""
        ttk.Label(parent, text="출력 디렉토리:").grid(row=row, column=0, sticky=tk.W, pady=5)
        ttk.Entry(parent, textvariable=self.output_path, width=50).grid(row=row, column=1, sticky=(tk.W, tk.E), padx=(5, 5), pady=5)
        ttk.Button(parent, text="찾아보기", command=self.browse_output_dir).grid(row=row, column=2, pady=5)
        
    def create_options_section(self, parent, row):
        """옵션 설정 섹션 생성"""
        # 옵션 프레임
        options_frame = ttk.LabelFrame(parent, text="처리 옵션", padding="10")
        options_frame.grid(row=row, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=10)
        options_frame.columnconfigure(1, weight=1)
        
        # 방법 선택
        ttk.Label(options_frame, text="처리 방법:").grid(row=0, column=0, sticky=tk.W, pady=2)
        method_combo = ttk.Combobox(options_frame, textvariable=self.method, 
                                   values=["auto", "txt", "ocr"], state="readonly", width=15)
        method_combo.grid(row=0, column=1, sticky=tk.W, padx=(5, 0), pady=2)
        
        # 백엔드 선택
        ttk.Label(options_frame, text="백엔드:").grid(row=0, column=2, sticky=tk.W, padx=(20, 0), pady=2)
        backend_combo = ttk.Combobox(options_frame, textvariable=self.backend,
                                    values=["pipeline", "vlm-transformers", "vlm-vllm-engine", "vlm-http-client"], 
                                    state="readonly", width=15)
        backend_combo.grid(row=0, column=3, sticky=tk.W, padx=(5, 0), pady=2)
        
        # 언어 선택
        ttk.Label(options_frame, text="언어:").grid(row=1, column=0, sticky=tk.W, pady=2)
        lang_combo = ttk.Combobox(options_frame, textvariable=self.language,
                                 values=["korean", "ch", "en", "japan", "chinese_cht", "ta", "te", "ka", "th", "el", 
                                        "latin", "arabic", "east_slavic", "cyrillic", "devanagari"], 
                                 state="readonly", width=15)
        lang_combo.grid(row=1, column=1, sticky=tk.W, padx=(5, 0), pady=2)
        
        # 디바이스 선택
        ttk.Label(options_frame, text="디바이스:").grid(row=1, column=2, sticky=tk.W, padx=(20, 0), pady=2)
        device_combo = ttk.Combobox(options_frame, textvariable=self.device,
                                   values=["cpu", "cuda", "cuda:0", "npu", "npu:0", "mps"], 
                                   state="readonly", width=15)
        device_combo.grid(row=1, column=3, sticky=tk.W, padx=(5, 0), pady=2)
        
        # 체크박스 옵션들
        ttk.Checkbutton(options_frame, text="수식 처리", variable=self.formula_enabled).grid(row=2, column=0, sticky=tk.W, pady=5)
        ttk.Checkbutton(options_frame, text="표 처리", variable=self.table_enabled).grid(row=2, column=1, sticky=tk.W, pady=5)
        
    def create_control_section(self, parent, row):
        """제어 버튼 섹션 생성"""
        control_frame = ttk.Frame(parent)
        control_frame.grid(row=row, column=0, columnspan=3, pady=10)
        
        self.start_button = ttk.Button(control_frame, text="OCR 처리 시작", 
                                     command=self.start_processing, style="Accent.TButton")
        self.start_button.pack(side=tk.LEFT, padx=(0, 10))
        
        self.stop_button = ttk.Button(control_frame, text="중지", 
                                    command=self.stop_processing, state="disabled")
        self.stop_button.pack(side=tk.LEFT, padx=(0, 10))
        
        self.clear_button = ttk.Button(control_frame, text="로그 지우기", 
                                     command=self.clear_log)
        self.clear_button.pack(side=tk.LEFT)
        
    def create_log_section(self, parent, row):
        """로그 출력 섹션 생성"""
        log_frame = ttk.LabelFrame(parent, text="처리 로그", padding="5")
        log_frame.grid(row=row, column=0, columnspan=3, sticky=(tk.W, tk.E, tk.N, tk.S), pady=10)
        log_frame.columnconfigure(0, weight=1)
        log_frame.rowconfigure(0, weight=1)
        parent.rowconfigure(row, weight=1)
        
        self.log_text = scrolledtext.ScrolledText(log_frame, height=15, width=80)
        self.log_text.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
    def browse_input_file(self):
        """입력 파일 선택"""
        try:
            filename = filedialog.askopenfilename(
                title="입력 파일 선택",
                filetypes=[("지원 파일", "*.pdf *.png *.jpg *.jpeg"), ("모든 파일", "*")]
            )
            if filename:
                self.input_path.set(filename)
                self.log_message(f"파일 선택됨: {os.path.basename(filename)}")
                self.validate_input_path()
        except Exception as e:
            self.log_message(f"파일 선택 오류: {e}")
            messagebox.showerror("오류", f"파일 선택 중 오류가 발생했습니다: {e}")
            
    def browse_input_folder(self):
        """입력 폴더 선택"""
        try:
            dirname = filedialog.askdirectory(title="입력 폴더 선택")
            if dirname:
                self.input_path.set(dirname)
                self.log_message(f"폴더 선택됨: {os.path.basename(dirname)}")
                self.validate_input_path()
        except Exception as e:
            self.log_message(f"폴더 선택 오류: {e}")
            messagebox.showerror("오류", f"폴더 선택 중 오류가 발생했습니다: {e}")
                
    def browse_output_dir(self):
        """출력 디렉토리 선택"""
        dirname = filedialog.askdirectory(title="출력 디렉토리 선택")
        if dirname:
            self.output_path.set(dirname)
            
    def log_message(self, message):
        """로그 메시지 출력"""
        self.log_text.insert(tk.END, f"{message}\n")
        self.log_text.see(tk.END)
        self.root.update_idletasks()
        
    def clear_log(self):
        """로그 지우기"""
        self.log_text.delete(1.0, tk.END)
        
    def validate_input_path(self, event=None):
        """입력 경로 실시간 검증"""
        input_path = self.input_path.get().strip()
        if not input_path:
            return
            
        # 경로 존재 여부 확인
        if os.path.exists(input_path):
            if os.path.isfile(input_path):
                file_ext = os.path.splitext(input_path)[1].lower()
                supported_extensions = ['.pdf', '.png', '.jpg', '.jpeg']
                if file_ext in supported_extensions:
                    self.log_message(f"✓ 파일 확인됨: {os.path.basename(input_path)}")
                else:
                    self.log_message(f"⚠ 지원되지 않는 파일 형식: {file_ext}")
            else:
                self.log_message(f"✓ 폴더 확인됨: {os.path.basename(input_path)}")
        else:
            # 경로가 존재하지 않는 경우, 유사한 경로 제안
            self.suggest_similar_path(input_path)
            
    def suggest_similar_path(self, input_path):
        """유사한 경로 제안"""
        try:
            # 현재 디렉토리에서 유사한 파일 찾기
            current_dir = os.path.dirname(input_path) or "."
            filename = os.path.basename(input_path)
            
            if os.path.exists(current_dir):
                files = os.listdir(current_dir)
                similar_files = [f for f in files if filename.lower() in f.lower()]
                
                if similar_files:
                    self.log_message(f"⚠ 경로를 찾을 수 없습니다. 유사한 파일: {', '.join(similar_files[:3])}")
                else:
                    self.log_message(f"⚠ 경로를 찾을 수 없습니다: {input_path}")
            else:
                self.log_message(f"⚠ 경로를 찾을 수 없습니다: {input_path}")
        except Exception as e:
            self.log_message(f"⚠ 경로를 찾을 수 없습니다: {input_path}")
            
    def auto_complete_path(self, event):
        """경로 자동 완성"""
        try:
            input_path = self.input_path.get().strip()
            if not input_path:
                return
                
            # 현재 디렉토리에서 유사한 파일 찾기
            current_dir = os.path.dirname(input_path) or "."
            filename = os.path.basename(input_path)
            
            if os.path.exists(current_dir):
                files = os.listdir(current_dir)
                # 지원되는 파일 형식만 필터링
                supported_files = [f for f in files if f.lower().endswith(('.pdf', '.png', '.jpg', '.jpeg'))]
                similar_files = [f for f in supported_files if f.lower().startswith(filename.lower())]
                
                if similar_files:
                    # 가장 유사한 파일로 자동 완성
                    completed_path = os.path.join(current_dir, similar_files[0])
                    self.input_path.set(completed_path)
                    self.log_message(f"자동 완성: {os.path.basename(completed_path)}")
                    self.validate_input_path()
                else:
                    self.log_message("자동 완성할 파일을 찾을 수 없습니다.")
        except Exception as e:
            self.log_message(f"자동 완성 오류: {e}")
        
    def validate_inputs(self):
        """입력값 검증"""
        input_path = self.input_path.get().strip()
        output_path = self.output_path.get().strip()
        
        if not input_path:
            messagebox.showerror("오류", "입력 파일/폴더를 선택해주세요.")
            return False
            
        if not output_path:
            messagebox.showerror("오류", "출력 디렉토리를 선택해주세요.")
            return False
            
        # 입력 경로 검증
        if not os.path.exists(input_path):
            messagebox.showerror("오류", f"입력 파일/폴더가 존재하지 않습니다:\n{input_path}")
            return False
            
        # 지원되는 파일 확장자 확인
        if os.path.isfile(input_path):
            file_ext = os.path.splitext(input_path)[1].lower()
            supported_extensions = ['.pdf', '.png', '.jpg', '.jpeg']
            if file_ext not in supported_extensions:
                messagebox.showerror("오류", f"지원되지 않는 파일 형식입니다.\n지원 형식: {', '.join(supported_extensions)}")
                return False
        
        # 출력 디렉토리 생성
        try:
            os.makedirs(output_path, exist_ok=True)
            # 쓰기 권한 확인
            test_file = os.path.join(output_path, "test_write.tmp")
            with open(test_file, 'w') as f:
                f.write("test")
            os.remove(test_file)
        except Exception as e:
            messagebox.showerror("오류", f"출력 디렉토리에 접근할 수 없습니다: {e}")
            return False
            
        return True
        
    def start_processing(self):
        """OCR 처리 시작"""
        if not self.validate_inputs():
            return
            
        # UI 상태 변경
        self.start_button.config(state="disabled")
        self.stop_button.config(state="normal")
        
        # 백그라운드에서 처리 실행
        self.processing_thread = threading.Thread(target=self.run_processing)
        self.processing_thread.daemon = True
        self.processing_thread.start()
        
    def stop_processing(self):
        """처리 중지"""
        if hasattr(self, 'process') and self.process:
            self.process.terminate()
            self.log_message("처리가 중지되었습니다.")
            
        # UI 상태 복원
        self.start_button.config(state="normal")
        self.stop_button.config(state="disabled")
        
    def run_processing(self):
        """실제 OCR 처리 실행"""
        try:
            # MinerU 명령어 구성
            cmd = [
                "mineru",
                "-p", self.input_path.get(),
                "-o", self.output_path.get(),
                "-m", self.method.get(),
                "-b", self.backend.get(),
                "-l", self.language.get(),
                "-f", str(self.formula_enabled.get()).lower(),
                "-t", str(self.table_enabled.get()).lower(),
                "-d", self.device.get()
            ]
            
            self.log_message(f"실행 명령어: {' '.join(cmd)}")
            self.log_message("처리를 시작합니다...")
            
            # 프로세스 실행
            self.process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
                bufsize=1
            )
            
            # 실시간 출력 읽기
            for line in iter(self.process.stdout.readline, ''):
                if line:
                    self.log_message(line.strip())
                    
            self.process.wait()
            
            if self.process.returncode == 0:
                self.log_message("처리가 성공적으로 완료되었습니다!")
                messagebox.showinfo("완료", "OCR 처리가 완료되었습니다.")
            else:
                self.log_message(f"처리 중 오류가 발생했습니다. (종료 코드: {self.process.returncode})")
                messagebox.showerror("오류", "처리 중 오류가 발생했습니다. 로그를 확인해주세요.")
                
        except Exception as e:
            self.log_message(f"오류 발생: {e}")
            messagebox.showerror("오류", f"처리 중 오류가 발생했습니다: {e}")
            
        finally:
            # UI 상태 복원
            self.root.after(0, lambda: self.start_button.config(state="normal"))
            self.root.after(0, lambda: self.stop_button.config(state="disabled"))

def main():
    """메인 함수"""
    # pyenv 환경 활성화
    os.environ['PATH'] = f"/Users/im_1511/.pyenv/shims:{os.environ.get('PATH', '')}"
    
    root = tk.Tk()
    
    # 스타일 설정
    style = ttk.Style()
    style.theme_use('clam')
    
    # 앱 실행
    app = MinerUGUI(root)
    
    # 창 닫기 이벤트 처리
    def on_closing():
        if hasattr(app, 'process') and app.process:
            app.process.terminate()
        root.destroy()
    
    root.protocol("WM_DELETE_WINDOW", on_closing)
    
    root.mainloop()

if __name__ == "__main__":
    main()
