from llama_cpp import Llama

llm =  Llama(
    model_path = "E:\belajar ai enginer\dataset\Llama-Tsundere-3.2-3B-Instruct.Q4_K_M.gguf",
    n_ctx = 4096,
    n_batch = 512,
    n_gpu_layers = 32,
    n_threads = 8,
    verbose = True,
    seed = 42,
)