<p align="center"><img src="https://user-images.githubusercontent.com/3491729/73158646-c0d30f00-40e4-11ea-8dd9-b5f2946ffcd6.png" width="100" alt="Laravel Logo"></p>

<p align="center">Project Email Local Testing dibuat Oleh Sofa Ramadhan, Menggunakan ilmu tenaga dalam</p>

## Material Project

1. **(Web UI Mailhog)**
   ![image](https://github.com/user-attachments/assets/b83127a9-f6f5-4493-8b0d-df8318f29c09)

2. **(Mailhog Server) Download sesuai os masing-masing**
   ![image](https://github.com/user-attachments/assets/dcf1c538-5f4e-4497-9fb0-9bc9cacebfc8)

3. **Testing dari postman**

   - **GET http://localhost:3000/generate-email**
     ![image](https://github.com/user-attachments/assets/2216b1f2-fdab-4e03-ae2f-0ed2ee7e31f7)

   - **POST http://localhost:3000/send-email**
     ![image](https://github.com/user-attachments/assets/a556c7b9-b36a-45f1-83b0-71a7dbfde4d7)

4. **(Laragon) untuk menyimpan email ke database**
   ![image](https://github.com/user-attachments/assets/a47201eb-41e3-439b-ab91-477d033a992f)

## Langkah Installation

1.  **Sebelum memulai, pastikan Anda telah menginstal yang berikut ini di sistem Anda:**

    ```bash
     - Node.js (minimal versi 14.x atau 16.x)
     - MySQL (disarankan versi 5.7 ke atas)
     - MailHog (untuk testing email secara lokal)
     - npm (biasanya sudah termasuk saat install Node.js)
    ```

2.  **Buat dulu tabel temp_emails** :

    ```bash
      const Database = require('better-sqlite3');
      const db = new Database('tempmail.db');

        db.exec(`
        CREATE TABLE IF NOT EXISTS tb_emails (
            id TEXT PRIMARY KEY,
            email TEXT NOT NULL,
            created_at INTEGER NOT NULL);
        `);
    ```

3.  **Download Server Mailhog.**
4.  **Jalankan Server Mailhog, karna saya menggunakan windows. Nanti tampilannya akan seperti gambar dibawah ini ketika sudah jalan server mailhog.**
5.  **Screenshot** : ![image](https://github.com/user-attachments/assets/ca67dcd1-3191-483a-9ee6-4e3a44e63c6c)
6.  **Buka project yang sudah di download lalu pergi ke server/index.html kemudian live server untuk tampilan UI nya.**
7.  **Screenshot** :

    ![Tampilan Desktop UI EmailTemp](https://github.com/user-attachments/assets/09e34ec8-4916-43cb-96e9-d5a0550871c8)

8.  **Lalu testing klik tombol Buat Email baru.**
9.  **Tampilan inbox Mailhog** : ![image](https://github.com/user-attachments/assets/15978746-5044-4955-929e-cf547efdc8c4)
10. **Done** ✅👌
        <hr>
    <p align="center">🙏 <b>Terima Kasih</b> 🙏</p>
