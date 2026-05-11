document.addEventListener("DOMContentLoaded", () => {
    
    // === KONFIGURASI SUPABASE BARU ===
    const SUPABASE_URL = 'https://ucsfssukcrkmguhizbbj.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjc2Zzc3VrY3JrbWd1aGl6YmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMjkxOTksImV4cCI6MjA5MzkwNTE5OX0.2rSwfgAhzyeSb_ru-6K9hDKSMtFbSK1vgiBpopqM9NY';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    const loginForm = document.getElementById('loginForm');
    const btnLogin = document.getElementById('btnLogin');
    const pesanError = document.getElementById('pesanError');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Mencegah halaman refresh otomatis
        
        pesanError.style.display = 'none';
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Ubah teks tombol jadi loading
        let originalText = btnLogin.innerHTML;
        btnLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memeriksa data...';
        btnLogin.disabled = true;

        try {
            // PROSES LOGIN KE SUPABASE
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                throw error; // Lempar ke blok catch jika salah sandi
            }

            // JIKA SUKSES
            // Simpan ID User ke penyimpanan HP/iPad untuk dipakai di halaman lain
            localStorage.setItem('ustadz_id', data.user.id);
            
            // Arahkan otomatis ke Dashboard
            window.location.href = 'dashboard.html';

        } catch (error) {
            // JIKA GAGAL (Sandi salah / email tidak ada)
            pesanError.innerText = "Gagal masuk: Email atau kata sandi salah.";
            pesanError.style.display = 'block';
            
            btnLogin.innerHTML = originalText;
            btnLogin.disabled = false;
        }
    });

    // Cek apakah Ustadz sebenarnya sudah login sebelumnya?
    // Jika sudah login, jangan tampilkan halaman login lagi, langsung usir ke Dashboard.
    async function cekSesiAktif() {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            window.location.href = 'dashboard.html';
        }
    }
    
    cekSesiAktif();
});
