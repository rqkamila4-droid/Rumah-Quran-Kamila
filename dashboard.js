document.addEventListener("DOMContentLoaded", () => {
    // 1. Menampilkan Tanggal Hari Ini (Masehi)
    const dateElement = document.getElementById('dateToday');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('id-ID', options);
    dateElement.textContent = today;
    
    // (Catatan: Untuk tanggal Hijriah dinamis nanti bisa ditambahkan menggunakan API khusus jika diperlukan)

    // 2. Fungsi Klik Menu
    const menus = document.querySelectorAll('.menu-card');
    
    menus.forEach(menu => {
        menu.addEventListener('click', function() {
            const menuId = this.id;
            
            if (menuId === 'btn-logout') {
                const confirmLogout = confirm('Apakah Anda yakin ingin keluar?');
                if (confirmLogout) {
                    window.location.href = 'login.html';
                }
            } else {
                // Simulasi klik menu (Nanti akan diarahkan ke halaman masing-masing)
                // Contoh: Jika id="menu-santri", nama halamannya "data-santri.html"
                const pageName = menuId.replace('menu-', 'data-') + '.html';
                
                // Menampilkan alert sementara untuk testing
                alert(`Anda akan diarahkan ke halaman ${menuId.replace('menu-', '')}`);
                
                // Jika halamannya sudah dibuat, buka komentar kode di bawah ini:
                // window.location.href = pageName;
            }
        });
    });
});
