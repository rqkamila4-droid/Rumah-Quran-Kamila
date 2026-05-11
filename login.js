document.addEventListener("DOMContentLoaded", () => {
    
    // === KONFIGURASI SUPABASE BARU ===
    const SUPABASE_URL = 'https://ucsfssukcrkmguhizbbj.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjc2Zzc3VrY3JrbWd1aGl6YmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMjkxOTksImV4cCI6MjA5MzkwNTE5OX0.2rSwfgAhzyeSb_ru-6K9hDKSMtFbSK1vgiBpopqM9NY';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // Cek apakah sebelumnya ustadz sudah login?
    if (localStorage.getItem('ustadz_username')) {
        window.location.href = 'dashboard.html';
    }

    const loginForm = document.getElementById('loginForm');
    const btnLogin = document.getElementById('btnLogin');
    const pesanError = document.getElementById('pesanError');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        pesanError.style.display = 'none'; 
        
        // Ambil data Username
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        let originalText = btnLogin.innerHTML;
        btnLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memeriksa data...';
        btnLogin.disabled = true;

        try {
            // LOGIKA DARI APLIKASI SEBELAH:
            // Cek ke dalam tabel "profil_users" (atau "users") apakah ada username & password yang cocok
            const { data, error } = await supabase
                .from('profil_users') // Ganti dengan nama tabel akun ustadz Anda di Supabase
                .select('*')
                .eq('username', username)
                .eq('password', password)
                .single();

            if (error || !data) {
                // Jika tidak ada data yang cocok
                throw new Error("Username atau Password salah! Periksa kembali.");
            }

            // JIKA SUKSES
            // Simpan identitas ustadz ke penyimpanan HP
            localStorage.setItem('ustadz_id', data.id);
            localStorage.setItem('ustadz_username', data.username);
            localStorage.setItem('nama_ustadz', data.nama_lengkap);
            
            // Arahkan ke Dashboard
            window.location.href = 'dashboard.html';

        } catch (error) {
            // JIKA GAGAL MASUK
            pesanError.innerText = "Username atau kata sandi salah. Silakan coba lagi.";
            pesanError.style.display = 'block';
            
            btnLogin.innerHTML = originalText;
            btnLogin.disabled = false;
        }
    });

});
