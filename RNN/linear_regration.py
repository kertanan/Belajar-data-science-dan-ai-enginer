import os
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt

# ============================================================
# 1. LOAD DATA
# ============================================================
# os.path.join supaya path aman di Windows (hindari masalah backslash \t, \d, dll)
DATA_PATH = os.path.join("dataset", "daily_min_temp.csv")
df = pd.read_csv(DATA_PATH)

print("Num GPUs Available:", len(tf.config.list_physical_devices("GPU")))

# Ambil kolom suhu, bentuk jadi (n, 1), tipe float32
temps = df["Temp"].values.reshape(-1, 1).astype("float32")

# ============================================================
# 2. NORMALISASI ke rentang 0-1 (wajib untuk training stabil)
# ============================================================
scaler = MinMaxScaler()
temps_scaled = scaler.fit_transform(temps)

# ============================================================
# 3. SLIDING WINDOW
#    Pakai `WINDOW` hari terakhir untuk memprediksi hari berikutnya.
# ============================================================
def make_windows(series, window):
    x, y = [], []
    for i in range(len(series) - window):
        x.append(series[i:i + window])
        y.append(series[i + window])
    return np.array(x), np.array(y)

WINDOW = 30
x, y = make_windows(temps_scaled, WINDOW)
# x shape: (samples, WINDOW, 1) -> cocok untuk LSTM

# ============================================================
# 4. SPLIT TRAIN/TEST (urut, TANPA shuffle karena ini time series)
# ============================================================
split = int(len(x) * 0.8)
x_train, x_test = x[:split], x[split:]
y_train, y_test = y[:split], y[split:]

print("x_train:", x_train.shape, "x_test:", x_test.shape)

# ============================================================
# 5. MODEL LSTM
# ============================================================
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(WINDOW, 1)),
    tf.keras.layers.LSTM(64),
    tf.keras.layers.Dense(32, activation="relu"),
    tf.keras.layers.Dense(1),
])

optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)
model.compile(optimizer=optimizer, loss="mse", metrics=["mae"])
model.summary()

# ============================================================
# 6. EARLY STOPPING supaya epoch 500 aman dari overfitting
# ============================================================
early_stop = tf.keras.callbacks.EarlyStopping(
    monitor="val_loss", patience=20, restore_best_weights=True
)

# ============================================================
# 7. TRAINING dengan epoch 500
# ============================================================
history = model.fit(
    x_train, y_train,
    validation_data=(x_test, y_test),
    epochs=500,
    batch_size=32,
    callbacks=[early_stop],
    verbose=1,
)

# ============================================================
# 8. EVALUASI + PLOT
# ============================================================
# Prediksi lalu kembalikan ke skala suhu asli
pred_scaled = model.predict(x_test)
pred = scaler.inverse_transform(pred_scaled)
actual = scaler.inverse_transform(y_test)


plt.figure(figsize=(8, 8))  # Menggunakan rasio 1:1 agar aspek visualnya seimbang

plt.scatter(actual, pred, color='blue', alpha=0.5, label="Titik Data")

lims = [
    np.min([actual.min(), pred.min()]),  # Nilai minimum global
    np.max([actual.max(), pred.max()])   # Nilai maksimum global
]
plt.plot(lims, lims, color='red', linestyle='--', alpha=0.75, zorder=3, label="Ideal (Perfect Match)")


plt.title("Analisis Scatter Plot: Aktual vs Prediksi Suhu Minimum Harian")
plt.xlabel("Suhu Aktual (°C)")
plt.ylabel("Suhu Prediksi (°C)")
plt.xlim(lims)
plt.ylim(lims)
plt.grid(True, linestyle=':', alpha=0.6)
plt.legend()
plt.tight_layout()

# Penyimpanan
plt.savefig("hasil_prediksi_scatter.png")
print("Grafik scatter plot disimpan ke hasil_prediksi_scatter.png")