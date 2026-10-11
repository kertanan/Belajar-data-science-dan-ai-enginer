import { createContext, useContext, useState, useCallback } from "react";
import {
  MOCK_USER,
  MOCK_DOCUMENTS,
  MOCK_CONVERSATIONS,
  MOCK_EVAL_RUNS,
  MOCK_CHUNKS,
} from "../data/mock";

const StoreContext = createContext(null);

// ID sederhana untuk mock
const uid = (p) => `${p}_${Math.random().toString(36).slice(2, 8)}`;

export function StoreProvider({ children }) {
  // --- Auth (access token hanya di memori, sesuai PRD FR01) ---
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [evalRuns] = useState(MOCK_EVAL_RUNS);

  const login = useCallback((email) => {
    // Mock: terima email apa pun, role dari server (di sini mock evaluator)
    setUser({ ...MOCK_USER, email: email || MOCK_USER.email });
    return true;
  }, []);

  const register = useCallback((name, email) => {
    // Akun baru selalu role "pengguna" (PRD: role ditetapkan server)
    setUser({ user_id: uid("usr"), name, email, role: "pengguna" });
    return true;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  // --- Dokumen ---
  const addDocument = useCallback((file) => {
    const doc = {
      document_id: uid("doc"),
      name: file.name,
      sizeMB: +(file.size / (1024 * 1024)).toFixed(2),
      pages: Math.max(1, Math.round(file.size / 50000)),
      status: "Queued",
      chunk_count: 0,
      uploaded_at: new Date().toISOString(),
      generation_id: null,
    };
    setDocuments((d) => [doc, ...d]);
    // Simulasi transisi status: Queued -> Processing -> Ready
    simulateIngestion(doc.document_id, setDocuments);
    return doc;
  }, []);

  const retryDocument = useCallback((id) => {
    setDocuments((docs) =>
      docs.map((d) => (d.document_id === id ? { ...d, status: "Queued", error_reason: undefined } : d))
    );
    simulateIngestion(id, setDocuments);
  }, []);

  const deleteDocument = useCallback((id) => {
    // PRD FR10: nonaktifkan retrieval dulu (Deleting) lalu hapus
    setDocuments((docs) => docs.map((d) => (d.document_id === id ? { ...d, status: "Deleting" } : d)));
    setTimeout(() => {
      setDocuments((docs) => docs.filter((d) => d.document_id !== id));
    }, 1500);
  }, []);

  // --- Percakapan ---
  const createConversation = useCallback((scope) => {
    const conv = {
      conversation_id: uid("conv"),
      title: "Percakapan baru",
      selected_scope: scope,
      updated_at: new Date().toISOString(),
      messages: [],
    };
    setConversations((c) => [conv, ...c]);
    return conv;
  }, []);

  const deleteConversation = useCallback((id) => {
    setConversations((c) => c.filter((x) => x.conversation_id !== id));
  }, []);

  const appendMessage = useCallback((convId, message) => {
    setConversations((convs) =>
      convs.map((c) =>
        c.conversation_id === convId
          ? { ...c, messages: [...c.messages, message], updated_at: new Date().toISOString() }
          : c
      )
    );
  }, []);

  const updateMessage = useCallback((convId, msgId, patch) => {
    setConversations((convs) =>
      convs.map((c) =>
        c.conversation_id === convId
          ? {
              ...c,
              messages: c.messages.map((m) => (m.message_id === msgId ? { ...m, ...patch } : m)),
            }
          : c
      )
    );
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    documents,
    addDocument,
    retryDocument,
    deleteDocument,
    conversations,
    createConversation,
    deleteConversation,
    appendMessage,
    updateMessage,
    evalRuns,
    chunks: MOCK_CHUNKS,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// Simulasi pipeline ingestion: Queued -> Processing -> Ready
function simulateIngestion(id, setDocuments) {
  const set = (patch) =>
    setDocuments((docs) => docs.map((d) => (d.document_id === id ? { ...d, ...patch } : d)));
  setTimeout(() => set({ status: "Processing", stage: "ekstraksi" }), 1200);
  setTimeout(() => set({ status: "Processing", stage: "chunking" }), 2600);
  setTimeout(() => set({ status: "Processing", stage: "embedding" }), 4000);
  setTimeout(
    () =>
      set({
        status: "Ready",
        stage: undefined,
        chunk_count: Math.floor(Math.random() * 200) + 40,
        embedding_model: "intfloat/multilingual-e5-large",
        dimension: 1024,
        generation_id: "gen_1",
      }),
    5600
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore harus dipakai di dalam StoreProvider");
  return ctx;
}
