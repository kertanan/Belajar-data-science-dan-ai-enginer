// Data mock untuk prototipe UI. Tidak ada backend asli.
// Mencerminkan entitas pada PRD bagian 9 (Document, Conversation, Message, EvaluationRun).

export const MOCK_USER = {
  user_id: "usr_01",
  name: "Rangga Pratama",
  email: "rangga@example.com",
  role: "evaluator", // pengguna | evaluator | admin
};

// Dokumen contoh dengan berbagai status (PRD FR03/FR04)
export const MOCK_DOCUMENTS = [
  {
    document_id: "doc_01",
    name: "Panduan Arsitektur RAG.pdf",
    sizeMB: 2.4,
    pages: 48,
    status: "Ready",
    chunk_count: 132,
    embedding_model: "intfloat/multilingual-e5-large",
    dimension: 1024,
    uploaded_at: "2026-10-07T09:12:00Z",
    generation_id: "gen_3",
  },
  {
    document_id: "doc_02",
    name: "Laporan Keuangan 2025.pdf",
    sizeMB: 5.1,
    pages: 120,
    status: "Ready",
    chunk_count: 318,
    embedding_model: "intfloat/multilingual-e5-large",
    dimension: 1024,
    uploaded_at: "2026-10-06T14:30:00Z",
    generation_id: "gen_2",
  },
  {
    document_id: "doc_03",
    name: "Kontrak Vendor Cloud.pdf",
    sizeMB: 1.2,
    pages: 24,
    status: "Processing",
    stage: "embedding",
    chunk_count: 0,
    uploaded_at: "2026-10-08T15:40:00Z",
    generation_id: "gen_1",
  },
  {
    document_id: "doc_04",
    name: "Spesifikasi Produk v2.pdf",
    sizeMB: 3.3,
    pages: 72,
    status: "Retrying",
    attempt: 2,
    chunk_count: 0,
    uploaded_at: "2026-10-08T15:55:00Z",
    generation_id: "gen_1",
  },
  {
    document_id: "doc_05",
    name: "Hasil Pindai Faktur.pdf",
    sizeMB: 0.9,
    pages: 6,
    status: "Failed",
    error_reason: "PDF tanpa teks terdeteksi. OCR diperlukan (tersedia pada tahap lanjutan).",
    chunk_count: 0,
    uploaded_at: "2026-10-08T16:02:00Z",
    generation_id: null,
  },
  {
    document_id: "doc_06",
    name: "Notulen Rapat Q3.pdf",
    sizeMB: 0.4,
    pages: 8,
    status: "Queued",
    chunk_count: 0,
    uploaded_at: "2026-10-08T16:10:00Z",
    generation_id: null,
  },
];

// Potongan teks sumber contoh untuk sitasi
export const MOCK_CHUNKS = {
  doc_01: [
    { chunk_id: "ch_a1", page: 12, text: "RAG mengambil potongan dokumen yang relevan melalui pencarian vektor, lalu menyertakan konteks tersebut ke dalam prompt model bahasa sebelum menghasilkan jawaban." },
    { chunk_id: "ch_a2", page: 15, text: "Isolasi data antar pengguna dicapai dengan menyertakan filter owner_id dan generation_id pada setiap query vektor ke Qdrant." },
    { chunk_id: "ch_a3", page: 21, text: "Jawaban ditampilkan secara streaming menggunakan Server-Sent Events, dengan event meta, token, citations, dan done." },
  ],
  doc_02: [
    { chunk_id: "ch_b1", page: 34, text: "Pendapatan bersih tahun 2025 tercatat sebesar Rp 184 miliar, meningkat 12% dibanding tahun sebelumnya." },
    { chunk_id: "ch_b2", page: 58, text: "Beban operasional didominasi oleh biaya infrastruktur cloud sebesar 38% dari total pengeluaran." },
  ],
};

// Percakapan contoh (PRD FR10)
export const MOCK_CONVERSATIONS = [
  {
    conversation_id: "conv_01",
    title: "Cara kerja RAG",
    selected_scope: ["doc_01"],
    updated_at: "2026-10-08T10:00:00Z",
    messages: [
      {
        message_id: "msg_01",
        role: "user",
        text: "Bagaimana cara kerja RAG pada platform ini?",
        status: "Completed",
      },
      {
        message_id: "msg_02",
        role: "assistant",
        status: "Completed",
        text: "RAG bekerja dengan mengambil potongan dokumen yang relevan melalui pencarian vektor, lalu menyertakan konteks tersebut ke prompt model bahasa sebelum menghasilkan jawaban [1]. Jawaban ditampilkan secara streaming melalui Server-Sent Events [2].",
        citations: [
          { id: 1, document_id: "doc_01", doc_name: "Panduan Arsitektur RAG.pdf", page: 12, chunk_id: "ch_a1", quote: "RAG mengambil potongan dokumen yang relevan melalui pencarian vektor, lalu menyertakan konteks tersebut ke dalam prompt model bahasa sebelum menghasilkan jawaban." },
          { id: 2, document_id: "doc_01", doc_name: "Panduan Arsitektur RAG.pdf", page: 21, chunk_id: "ch_a3", quote: "Jawaban ditampilkan secara streaming menggunakan Server-Sent Events, dengan event meta, token, citations, dan done." },
        ],
        metrics: { ttft_ms: 820, total_ms: 4120 },
      },
    ],
  },
];

// Run evaluasi contoh (PRD FR11/FR12)
export const MOCK_EVAL_RUNS = [
  {
    run_id: "run_02",
    dataset_version: "v1.2",
    corpus_snapshot: "snap_2026_10_07",
    status: "Completed",
    created_at: "2026-10-07T18:00:00Z",
    config: {
      embedding_model: "intfloat/multilingual-e5-large",
      chunk_tokens: 500,
      overlap_tokens: 80,
      top_k: 5,
      threshold: 0.72,
      concurrency: 10,
    },
    metrics: {
      hit_rate_5: 0.84,
      retrieval_p50_ms: 310,
      retrieval_p95_ms: 690,
      ttft_p95_ms: 2800,
      answer_p50_ms: 6200,
      answer_p95_ms: 13900,
      total_questions: 50,
      answerable: 50,
      unanswerable: 20,
      failed: 1,
      abstention_rate: 0.95,
    },
    details: [
      { query_id: "q1", question: "Berapa pendapatan bersih 2025?", gold: "doc_02 hal. 34", top_k: ["ch_b1", "ch_b2"], hit: true, retrieval_ms: 280 },
      { query_id: "q2", question: "Apa itu RAG?", gold: "doc_01 hal. 12", top_k: ["ch_a1", "ch_a3"], hit: true, retrieval_ms: 305 },
      { query_id: "q3", question: "Siapa CEO perusahaan X?", gold: "(unanswerable)", top_k: ["ch_b2"], hit: false, retrieval_ms: 410, unanswerable: true },
      { query_id: "q4", question: "Bagaimana isolasi data pengguna?", gold: "doc_01 hal. 15", top_k: ["ch_a2"], hit: true, retrieval_ms: 260 },
      { query_id: "q5", question: "Berapa biaya infrastruktur cloud?", gold: "doc_02 hal. 58", top_k: ["ch_b1"], hit: false, retrieval_ms: 520 },
    ],
  },
  {
    run_id: "run_01",
    dataset_version: "v1.1",
    corpus_snapshot: "snap_2026_10_05",
    status: "Completed",
    created_at: "2026-10-05T11:00:00Z",
    config: {
      embedding_model: "intfloat/multilingual-e5-large",
      chunk_tokens: 400,
      overlap_tokens: 60,
      top_k: 5,
      threshold: 0.70,
      concurrency: 8,
    },
    metrics: {
      hit_rate_5: 0.78,
      retrieval_p50_ms: 340,
      retrieval_p95_ms: 740,
      ttft_p95_ms: 3100,
      answer_p50_ms: 6800,
      answer_p95_ms: 14600,
      total_questions: 50,
      answerable: 50,
      unanswerable: 20,
      failed: 2,
      abstention_rate: 0.90,
    },
    details: [],
  },
];
