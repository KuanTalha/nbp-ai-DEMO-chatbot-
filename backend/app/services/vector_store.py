import os
import uuid
from typing import List, Dict, Any, Optional
from qdrant_client import QdrantClient
from qdrant_client.http import models

class QdrantVectorStore:
    def __init__(self, url: str = None, collection_name: str = "company_knowledge"):
        self.url = url or os.getenv("QDRANT_URL", "http://localhost:6333")
        self.collection_name = collection_name or os.getenv("QDRANT_COLLECTION", "company_knowledge")
        self.client = QdrantClient(url=self.url)
        self.vector_dim = 768  # default for Gemini embeddings (1536 for OpenAI)

    def init_collection(self, dim: int = 768):
        self.vector_dim = dim
        collections = self.client.get_collections().collections
        collection_names = [c.name for c in collections]
        
        if self.collection_name not in collection_names:
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(
                    size=dim,
                    distance=models.Distance.COSINE
                )
            )

    def insert_chunks(self, chunks: List[Dict[str, Any]], vectors: List[List[float]]):
        points = []
        for chunk, vector in zip(chunks, vectors):
            point_id = str(uuid.uuid4())
            payload = {
                "chunk_text": chunk["chunk_text"],
                "document": chunk.get("document", ""),
                "page": chunk.get("page"),
                "url": chunk.get("url"),
                "source_type": chunk.get("source_type", "txt"),
                "doc_id": chunk.get("doc_id", "")
            }
            points.append(
                models.PointStruct(
                    id=point_id,
                    vector=vector,
                    payload=payload
                )
            )
        
        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )

    def search(self, query_vector: List[float], top_k: int = 5, score_threshold: float = 0.35) -> List[Dict[str, Any]]:
        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=top_k,
            score_threshold=score_threshold
        )
        
        formatted = []
        for r in results:
            formatted.append({
                "chunk_text": r.payload.get("chunk_text"),
                "document": r.payload.get("document"),
                "page": r.payload.get("page"),
                "url": r.payload.get("url"),
                "source_type": r.payload.get("source_type"),
                "score": r.score
            })
        return formatted

    def delete_by_document(self, document_name: str):
        self.client.delete(
            collection_name=self.collection_name,
            points_selector=models.FilterSelector(
                filter=models.Filter(
                    must=[
                        models.FieldCondition(
                            key="document",
                            match=models.MatchValue(value=document_name)
                        )
                    ]
                )
            )
        )

    def count_chunks(self) -> int:
        try:
            info = self.client.get_collection(self.collection_name)
            return info.points_count or 0
        except Exception:
            return 0
