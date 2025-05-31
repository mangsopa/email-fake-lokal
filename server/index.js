const express = require('express');
const axios = require('axios');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2/promise');
const QRCode = require('qrcode');

async function main() {
    const app = express();
    app.use(cors());
    app.use(express.json());

    // Buat koneksi database (MySQL)
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '#####', // sesuaikan passwordnya
        database: '####' // sesuaikan databasenya
    });

    app.post('/send-email', async (req, res) => {
        const { to, subject, text } = req.body;

        if (!to) return res.status(400).json({ error: "'to' email wajib diisi" });

        const transporter = nodemailer.createTransport({
            host: 'localhost',
            port: 1025,
            secure: false,
            tls: { rejectUnauthorized: false },
        });

        try {
            const info = await transporter.sendMail({
                from: '"TempMail" <temp@mail.test>',
                to,
                subject: subject || 'Test Email dari TempMail',
                text: text || 'Ini email testing untuk MailHog',
            });
            console.log('Email terkirim ID:', info.messageId);
            res.json({ message: 'Email terkirim', messageId: info.messageId });
        } catch (error) {
            console.error('Gagal kirim email:', error);
            res.status(500).json({ error: 'Gagal kirim email' });
        }
    });

    // Generate email temporer dan simpan ke database
    app.get('/generate-email', async (req, res) => {
        const alias = uuidv4().split('-')[0];
        const email = `${alias}@localhost.test`;

        try {
            await db.execute('INSERT INTO temp_emails (email) VALUES (?)', [email]);
            res.json({ email });
        } catch (error) {
            console.error('Error simpan email:', error);
            res.status(500).json({ error: 'Gagal generate email' });
        }
    });

    // Fungsi cek apakah email masih valid (auto-expire 10 menit)
    async function isEmailValid(email) {
        const [rows] = await db.execute(
            'SELECT * FROM temp_emails WHERE email = ? AND created_at >= NOW() - INTERVAL 10 MINUTE',
            [email]
        );
        return rows.length > 0;
    }

    // Generate QR Code untuk email
    app.get('/qr/:email', async (req, res) => {
        const { email } = req.params;
        if (!(await isEmailValid(email))) {
            return res.status(404).json({ error: 'Email expired atau tidak ditemukan' });
        }
        try {
            const qr = await QRCode.toDataURL(email);
            res.json({ qr });
        } catch (error) {
            console.error('Error generate QR:', error);
            res.status(500).json({ error: 'Gagal generate QR Code' });
        }
    });

    // Ambil inbox email dari MailHog API
    app.get('/emails/:email', async (req, res) => {
        const targetEmail = req.params.email;
        if (!(await isEmailValid(targetEmail))) {
            return res.status(404).json({ error: 'Email expired atau tidak ditemukan' });
        }

        try {
            const response = await axios.get('http://localhost:8025/api/v2/messages');
            const messages = response.data.items;

            const filtered = messages.filter(msg =>
                msg.Raw.To?.some(to => to.toLowerCase().includes(targetEmail.toLowerCase()))
            ).map(msg => ({
                id: msg.ID,
                subject: msg.Content.Headers.Subject?.[0] || '(No Subject)',
                body: msg.Content.Body,
                from: msg.Content.Headers.From?.[0],
                date: msg.Created,
            }));

            res.json({ inbox: filtered });
        } catch (err) {
            console.error('Error fetch MailHog messages:', err);
            res.status(500).json({ error: 'Gagal ambil email dari MailHog' });
        }
    });

    app.listen(3000, () => {
        console.log('Server jalan di port 3000');
    });
}

main().catch(err => {
    console.error('Fatal error:', err);
});
