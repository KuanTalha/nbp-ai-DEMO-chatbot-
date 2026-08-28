import os
from typing import List
from google import genai
from .base import BaseLLMService

class GeminiService(BaseLLMService):
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is not set.")
        self.client = genai.Client(api_key=self.api_key)
        self.model = "gemini-3.7-flash"
        self.embedding_model = "gemini-embedding-2-preview"

    def generate(self, prompt: str, system_instruction: str = "") -> str:
        config = {}
        if system_instruction:
            config["system_instruction"] = system_instruction

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config=config
        )
        return response.text or ""

    def embed_text(self, text: str) -> List[float]:
        result = self.client.models.embed_content(
            model=self.embedding_model,
            contents=text
        )
        return result.embedding.values

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return [self.embed_text(t) for t in texts]
