"""
config.py — Pusat konfigurasi untuk proyek RAG AI Engineer.

Semua modul (LLM, embedding, FAISS, database) sebaiknya mengimpor nilai
dari sini agar tidak ada path/parameter yang hardcoded di banyak tempat.

Embedding dibuat secara LOKAL memakai SentenceTransformer (bukan OpenAI),
konsisten dengan faiss_vector.py dan connect_hugingFace.py.
"""

import os
from pathlib import Path
from dotenv import load_dotenv


# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
AI_ENGINEER_PATH = Path(__file__).resolve().parent          # .../rag-ui/Ai Enginer
PROJECT_ROOT = AI_ENGINEER_PATH.parent                      # .../rag-ui
DATASET_DIR = PROJECT_ROOT / "dataset"
FAISS_INDEX_DIR = PROJECT_ROOT / "faiss_index" / "data"
MEMORY_DIR = PROJECT_ROOT / "memory_manager"

load_dotenv(PROJECT_ROOT / ".env")


# ---------------------------------------------------------------------------
# Device
# ---------------------------------------------------------------------------
def get_device() -> str:
    """Kembalikan 'cuda' bila GPU tersedia, selain itu 'cpu'."""
    try:
        import torch
        return "cuda" if torch.cuda.is_available() else "cpu"
    except ImportError:
        return "cpu"


DEVICE = get_device()


# ---------------------------------------------------------------------------
# LLM (llama.cpp / GGUF) — sesuai connect_hugingFace.py
# ---------------------------------------------------------------------------
LLM_CONFIG = {
    "model_path": os.getenv(
        "BASE_MODEL_LLM",
        str(DATASET_DIR / "Llama-Tsundere-3.2-3B-Instruct.Q4_K_M.gguf"),
    ),
    "n_ctx": 4096,
    "n_batch": 512,
    "n_gpu_layers": 32,
    "n_threads": 8,
    "seed": 42,
    "verbose": True,
}

SYSTEM_PROMPT_PATH = DATASET_DIR / "system_prompt.txt"


# ---------------------------------------------------------------------------
# Embedding (lokal, SentenceTransformer / HuggingFace)
# ---------------------------------------------------------------------------
class Embedding:
    """
    Pembangkit embedding lokal memakai SentenceTransformer.
    Model default disesuaikan dengan faiss_vector.py (multilingual MiniLM).
    """

    def __init__(
        self,
        model_name: str = os.getenv(
            "EMBEDDING_MODEL",
            "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
        ),
    ):
        self.model_name = model_name
        self._model = None  # lazy loading

    @property
    def model(self):
        """Muat model sekali saja (lazy)."""
        if self._model is None:
            from sentence_transformers import SentenceTransformer
            self._model = SentenceTransformer(self.model_name, device=DEVICE)
        return self._model

    def load_texts(self) -> list[str]:
        """Baca semua file .txt dari DATASET_DIR."""
        texts = []
        for filename in os.listdir(DATASET_DIR):
            if filename.endswith(".txt"):
                path = os.path.join(DATASET_DIR, filename)
                with open(path, "r", encoding="utf-8") as f:
                    texts.append(f.read())
        return texts

    def encode(self, text):
        """Encode teks (str atau list[str]) menjadi vektor float32."""
        import numpy as np
        embeddings = self.model.encode(text)
        return np.asarray(embeddings, dtype="float32")


# ---------------------------------------------------------------------------
# FAISS index
# ---------------------------------------------------------------------------
class FaissIndex:
    """Membuat / memuat / menyimpan index FAISS (singleton)."""

    _index_instance = None
    DEFAULT_PATH = str(FAISS_INDEX_DIR / "faiss_index.bin")

    @classmethod
    def build(cls, embeddings):
        """Bangun index baru dari array embeddings berbentuk (n, dim)."""
        import faiss
        dim = embeddings.shape[1]
        index = faiss.IndexFlatL2(dim)
        index.add(embeddings)
        cls._index_instance = index
        return index

    @classmethod
    def save(cls, index, index_path: str = None):
        """Simpan index ke disk."""
        import faiss
        index_path = index_path or cls.DEFAULT_PATH
        os.makedirs(os.path.dirname(index_path), exist_ok=True)
        faiss.write_index(index, index_path)
        print(f"FAISS index disimpan ke {index_path}")

    @classmethod
    def get_index(cls, index_path: str = None):
        """Muat index dari file bila ada; jika tidak, kembalikan None."""
        import faiss
        index_path = index_path or cls.DEFAULT_PATH
        if cls._index_instance is not None:
            return cls._index_instance
        if os.path.exists(index_path):
            cls._index_instance = faiss.read_index(index_path)
            print("FAISS index loaded successfully.")
        else:
            print("FAISS index belum ada. Bangun dulu dengan FaissIndex.build().")
        return cls._index_instance


# ---------------------------------------------------------------------------
# Database (PostgreSQL via SSH tunnel) — sesuai conn/connect_db.py
# ---------------------------------------------------------------------------
SSH_CONFIG = {
    "ssh_host": "127.0.0.1",
    "ssh_port": 2222,
    "ssh_username": "vboxuser",
    "ssh_password": os.getenv("SSH_PASSWORD"),
    "remote_bind_address": ("localhost", 5432),
}

DB_CONFIG = {
    "dbname": "rag_memory",
    "user": "boxuser",
    "password": os.getenv("DB_PASSWORD"),
    "host": "127.0.0.1",
    # port diisi dinamis dari tunnel.local_bind_port saat runtime
}


# ---------------------------------------------------------------------------
# Pencarian
# ---------------------------------------------------------------------------
def search_faiss_index(query: str, texts: list[str], k: int = 3) -> str:
    """Cari k teks paling relevan untuk sebuah query."""
    if not query.strip():
        return "Query kosong. Mohon berikan query yang valid."

    embedder = Embedding()
    index = FaissIndex.get_index()
    if index is None:
        return "Index FAISS belum tersedia."

    query_embedding = embedder.encode([query])
    k = min(k, index.ntotal)
    distances, indices = index.search(query_embedding, k)

    retrieved = [texts[idx] for idx in indices[0] if 0 <= idx < len(texts)]
    return "\n".join(retrieved) if retrieved else "Tidak ada informasi relevan."
