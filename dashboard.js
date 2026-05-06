document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Menangani Tanggal di Jadwal
    const badgeDate = document.getElementById('todayBadge');
    const today = new Date();
    badgeDate.textContent = today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' });

    // 2. Menangani Toggle Sidebar untuk Tampilan Mobile/iPad
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const overlay = document.getElementById('sidebarOverlay');

    function toggleSidebar() {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
    }

    menuToggle.addEventListener('click', toggleSidebar);
    closeSidebar.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);

    // 3. Menggambar Bar Chart (Grafik Utama)
    const ctxMain = document.getElementById('mainChart').getContext('2d');
    new Chart(ctxMain, {
        type: 'bar',
        data: {
            labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
            datasets: [
                {
                    label: 'Kehadiran',
                    data: [85, 90, 88, 92],
                    backgroundColor: '#BAD7DF',
                    borderRadius: 5
                },
                {
                    label: 'Setoran Selesai',
                    data: [60, 75, 70, 85],
                    backgroundColor: '#99DDCC',
                    borderRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { display: true, color: '#ecf0f1' } },
                x: { grid: { display: false } }
            },
            plugins: {
                legend: { position: 'top', align: 'end' }
            }
        }
    });

    // 4. Menggambar Donut Chart (Persentase Kehadiran)
    const ctxDonut = document.getElementById('donutChart').getContext('2d');
    new Chart(ctxDonut, {
        type: 'doughnut',
        data: {
            labels: ['Hadir', 'Izin', 'Sakit/Alpha'],
            datasets: [{
                data: [85, 10, 5],
                backgroundColor: ['#99DDCC', '#BAD7DF', '#FFE2E2'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%', // Membuat lubang di tengah lebih besar agar elegan
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

});
