import pandas as pd 
import  numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import minmax_scale
from sklearn.model_selection import train_test_split
import torch
import torch.nn as nn
import torch.optim as optim 


time_stamp =np.linspace(0, 500,100)
data = np.sin(time_stamp)
df = pd.DataFrame (data, column= ['VALUE'])

#plot raw data
plt.figure(figsize=(15,5))
plt.plot (df['VALUE'])
plt.title("Time Stamp")
plt.xlabel("Suhu")
plt.ylabel("tahun")


#preprocess data
scaler = minmax_scale()

df["VALUE"] = scaler.fit_transform(df["VALUE"])
data = df["VALUE"].values


