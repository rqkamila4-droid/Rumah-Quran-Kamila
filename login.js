document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.querySelector('.btn-login');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Mencegah halaman web memuat ulang (refresh)
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validasi sederhana
        if(email && password) {
            // Ubah teks tombol untuk efek loading
            loginBtn.textContent = 'Memproses...';
            loginBtn.style.opacity = '0.8';
            
            // Simulasi loading selama 1 detik, lalu pindah ke Dashboard
            // Nanti blok ini akan kita ganti dengan fungsi Auth Supabase
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }
    });
});
