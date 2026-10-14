import numpy as np
import pandas as pd
import statsmodels.api as sm
import matplotlib.pyplot as plt
import os

# Baca dataset
Data_Path = os.path.join("dataset", "daily_min_temp.csv")
df = pd.read_csv(Data_Path)

# Pastikan kolom Date bertipe datetime
df["Date"] = pd.to_datetime(df["Date"])

# Variabel target (y) = suhu
y = df["Temp"].astype(float)

# Variabel prediktor (X) = indeks waktu (urutan hari ke-0, 1, 2, ...)
# karena Date berupa teks, kita ubah jadi angka urutan
X = np.arange(len(df))

# Tambahkan konstanta (intercept) ke prediktor
X = sm.add_constant(X)

# Fit model OLS: OLS(y, X)
ols_regration_model = sm.OLS(y, X).fit()

# Tampilkan ringkasan hasil regresi
print(ols_regration_model.summary())

# (Opsional) plot data asli vs garis regresi
plt.figure(figsize=(12, 5))
plt.plot(df["Date"], y, label="Data Suhu", linewidth=0.6)
plt.plot(df["Date"], ols_regration_model.predict(X),
         color="red", label="Garis Regresi OLS")
plt.xlabel("Tanggal")
plt.ylabel("Suhu")
plt.title("Regresi OLS Suhu Harian")
plt.legend()
plt.tight_layout()
plt.show()
