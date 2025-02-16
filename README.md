# Wokwi Simulation for Detect Ammonia (NH3) Gas using MQ-135 Sensor

## Topology Design

![topology-design](assets/img/image.png)

**Problem**: Mungkin kalian berpikir *kenapa gak langsung send data aja dari ESP32 di Wokwi ke Google Spreadsheets pakai AppScript* ?
**Alasannya**: Karena entah mengapa setiap kirim data dari Wokwi ke Google spreadsheet, HTTP request-nya *selalu gagal* dengan status code: **-1 (connection refused)**. Oleh karena itu, saya cari akal untuk mencari perantaranya, yaitu dengan menggunakan flask app yang di-publish ke ngrok/cloudflare supaya bisa diakses oleh ESP32 di Wokwi (secara publik).

## Requirements

- *Visual Studio Code* untuk mengedit dan menjalankan simulasi.
- Ekstensi VSCode: *PlatformIO* and *Wokwi*.
- *Ngrok* or *Cloudflared* untuk tunneling.

## Usage

- Sebelum di-running, build project PlatformIO terlebih dulu dengan mengklik tanda ✅ yang ada di bawah VSCode.
- Setelah proses build selesai, salin path firmware yang telah di-compile ke bagian `[wokwi]` pada file `wokwi.toml` (ini seharusnya tidak perlu karena hasilnya akan sama saja).
- Untuk menjalankannya, buka file `diagram.json` yang sudah terhubung dengan ekstensi Wokwi, lalu klik tombol play/running.

## Notes

- Untuk mendapatkan file header: `wokwi-api.h`, pergi ke repository contoh custom chip *inverter*: [https://github.com/wokwi/inverter-chip/blob/main/src/wokwi-api.h](https://github.com/wokwi/inverter-chip/blob/main/src/wokwi-api.h).
- Install `emscripten` untuk compile C ke dalam wasm (web assembly): `sudo apt install -y emscripten`.
- Untuk meng-compile C ke wasm pakai perintah: `emcc mq135.chip.c -o mq135.chip.wasm -s EXPORTED_FUNCTIONS='["_attrInit", "_attrRead", "_pinInit", "_pinDACWrite", "_timerInit", "_timerStart"]' -s ERROR_ON_UNDEFINED_SYMBOLS=0`.
