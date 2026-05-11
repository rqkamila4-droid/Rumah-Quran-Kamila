document.addEventListener("DOMContentLoaded", () => {

    // 1. SISTEM PENGGERAK MENU SIDEBAR (GARIS 3)
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const closeSidebar = document.getElementById('closeSidebar');

    if (menuToggle && sidebar && overlay) {
        // Buka Sidebar saat tombol garis 3 diklik
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('show');
            overlay.classList.add('show');
        });

        // Tutup Sidebar saat area gelap (overlay) diklik
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
        });

        // Tutup Sidebar saat tombol X diklik
        if (closeSidebar) {
            closeSidebar.addEventListener('click', () => {
                sidebar.classList.remove('show');
                overlay.classList.remove('show');
            });
        }
    }

    // 2. SET TANGGAL OTOMATIS HARI INI DI FILTER
    const tanggalInput = document.getElementById('tanggalInput');
    if (tanggalInput) {
        tanggalInput.value = new Date().toISOString().split('T')[0];
    }

});
