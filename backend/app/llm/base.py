from abc import ABC, abstractmethod
from typing import List, Dict, Any, Generator

class BaseLLMService(ABC):
    """Abstract Base Class for LLM Provider abstraction."""

    @abstractmethod
    def generate(self, prompt: str, system_instruction: str = "") -> str:
        """Generate response given user prompt and grounded system instruction."""
        pass

    @abstractmethod
    def embed_text(self, text: str) -> List[float]:
        """Generate embedding vector for a given text."""
        pass

    @abstractmethod
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a batch of documents."""
        pass
