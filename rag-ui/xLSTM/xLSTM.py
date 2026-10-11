import torch 
from xlstm.xlstm_large.model import xLSTMLargeConfig, xLSTMLarge
#config xsltm
xlstm_config = xLSTMLargeConfig(
    embedding_dim = 512,
    num_heads = 4,
    num_blocks = 6,
    vocab_size = 2048,
    return_last_states = True,
    mode = "inference",
    chunkwise_kernel = "chunkwise--native_autograd",
    sequence_kernel = "native_sequence__native",
    step_kernel = "native"
)

#iniiate the model 
xlstm = xLSTMLarge(xlstm_config)
xlstm = xlstm.to("cuda")

#created input
x = torch.randint(0, 2048, (1, 512)).to("cuda")
out, last_states = xlstm(x)
#run foward pass
out, last_states = xlstm(x)
assert out.shape[1:] == (512, 2048)
print(out.shape)
print(type(last_states))
print(len(last_states))

if __name__ == "__main__":
    print("xLSTM model initialized and forward pass completed successfully.")