document.addEventListener("DOMContentLoaded", () => {
    
    // Cek Keamanan: Jika belum login (tidak ada username di memori), usir kembali ke Login
    if (!localStorage.getItem('ustadz_username')) {
        window.location.href = 'login.html';
        return;
    }

    // Tampilkan Nama Ustadz di Dashboard (Opsional)
    const namaUstadz = localStorage.getItem('nama_ustadz');
    const elementNama = document.querySelector('.profile-name');
    if (elementNama && namaUstadz) {
        elementNama.textContent = namaUstadz;
    }

    // SISTEM PENGGERAK MENU SIDEBAR (GARIS 3)
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const closeSidebar = document.getElementById('closeSidebar');

    if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('show');
            overlay.classList.add('show');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
        });

        if (closeSidebar) {
            closeSidebar.addEventListener('click', () => {
                sidebar.classList.remove('show');
                overlay.classList.remove('show');
            });
        }
    }
});
