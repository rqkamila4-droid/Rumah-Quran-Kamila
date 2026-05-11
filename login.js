document.addEventListener("DOMContentLoaded", () => {
    
    // KONFIGURASI SUPABASE
    const SUPABASE_URL = 'https://ucsfssukcrkmguhizbbj.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjc2Zzc3VrY3JrbWd1aGl6YmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMjkxOTksImV4cCI6MjA5MzkwNTE5OX0.2rSwfgAhzyeSb_ru-6K9hDKSMtFbSK1vgiBpopqM9NY';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // Kunci Otomatis: Jika sudah login, langsung usir ke Dashboard
    if (localStorage.getItem('ustadz_username')) {
        window.location.href = 'dashboard.html';
    }

    const loginForm = document.getElementById('loginForm');
    const btnLogin = document.getElementById('btnLogin');
    const pesanError = document.getElementById('pesanError');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        pesanError.style.display = 'none'; 
        
        const userValue = document.getElementById('username').value.trim();
        const passValue = document.getElementById('password').value.trim();

        let originalText = btnLogin.innerHTML;
        btnLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memeriksa data...';
        btnLogin.disabled = true;

        try {
            // PROSES PENCOCOKAN DATA KE TABEL SUPABASE
            const { data, error } = await supabase
                .from('profil_users')
                .select('*')
                .eq('username', userValue)
                .eq('password', passValue)
                .single(); 

            if (error || !data) {
                throw new Error("Username atau sandi salah.");
            }

            // JIKA SUKSES! 
            localStorage.setItem('ustadz_id', data.id);
            localStorage.setItem('ustadz_username', data.username);
            localStorage.setItem('nama_ustadz', data.nama_lengkap);
            
            // ARAHKAN KE DASHBOARD
            window.location.href = 'dashboard.html';

        } catch (error) {
            // JIKA GAGAL MASUK
            pesanError.innerText = "Username atau Password salah! Periksa kembali.";
            pesanError.style.display = 'block';
            
            btnLogin.innerHTML = originalText;
            btnLogin.disabled = false;
        }
    });

});
