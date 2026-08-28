import os
from typing import List, Dict, Any
import requests
from bs4 import BeautifulSoup
from pypdf import PdfReader
import docx
from langchain_text_splitters import RecursiveCharacterTextSplitter

class DocumentLoader:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 150):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", ". ", " ", ""]
        )

    def load_pdf(self, file_path: str, filename: str) -> List[Dict[str, Any]]:
        chunks = []
        reader = PdfReader(file_path)
        for page_num, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or ""
            if not text.strip():
                continue
            split_texts = self.splitter.split_text(text)
            for split in split_texts:
                chunks.append({
                    "chunk_text": split.strip(),
                    "document": filename,
                    "page": page_num,
                    "source_type": "pdf"
                })
        return chunks

    def load_docx(self, file_path: str, filename: str) -> List[Dict[str, Any]]:
        doc = docx.Document(file_path)
        full_text = "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
        split_texts = self.splitter.split_text(full_text)
        chunks = []
        for i, split in enumerate(split_texts):
            chunks.append({
                "chunk_text": split.strip(),
                "document": filename,
                "page": (i // 3) + 1,  # approximate page
                "source_type": "docx"
            })
        return chunks

    def load_txt(self, file_path: str, filename: str) -> List[Dict[str, Any]]:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            text = f.read()
        split_texts = self.splitter.split_text(text)
        chunks = []
        for i, split in enumerate(split_texts):
            chunks.append({
                "chunk_text": split.strip(),
                "document": filename,
                "page": (i // 4) + 1,
                "source_type": "txt"
            })
        return chunks

    def load_website(self, url: str) -> List[Dict[str, Any]]:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
        resp = requests.get(url, headers=headers, timeout=10)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "footer"]):
            script.decompose()
            
        title = soup.title.string.strip() if soup.title else url
        text = soup.get_text(separator="\n")
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        clean_text = "\n".join(lines)
        
        split_texts = self.splitter.split_text(clean_text)
        chunks = []
        for split in split_texts:
            chunks.append({
                "chunk_text": split.strip(),
                "document": title,
                "url": url,
                "source_type": "website"
            })
        return chunks
