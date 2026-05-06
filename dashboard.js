document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Menangani Tanggal di Jadwal
    const badgeDate = document.getElementById('todayBadge');
    const today = new Date();
    badgeDate.textContent = today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' });

    // 2. Menangani Toggle Sidebar
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

    // ==========================================
    // 3. LOGIKA GRAFIK BARU (SEBARAN KEMAMPUAN)
    // ==========================================
    
    // Data Simulasi (Nanti bisa diganti dari database Supabase)
    const chartData = {
        tahsin: {
            labels: ['Dasar (Jilid 1-3)', 'Menengah (Jilid 4-6)', 'Lanjutan (Tilawah)'],
            datasets: {
                semua: [10, 8, 6],
                kelas1: [8, 2, 0],
                kelas2: [2, 5, 1],
                kelas3: [0, 1, 5]
            }
        },
        tahfidz: {
            labels: ['Juz 30 Awal (An-Nas - Al-A\'la)', 'Juz 30 Akhir (At-Tariq - An-Naba)', 'Juz 29'],
            datasets: {
                semua: [12, 7, 5],
                kelas1: [10, 0, 0],
                kelas2: [2, 5, 1],
                kelas3: [0, 2, 4]
            }
        }
    };

    // Konfigurasi Awal Grafik
    let currentMode = 'tahsin'; // Default mode
    let currentClass = 'semua'; // Default class

    const ctxMain = document.getElementById('mainChart').getContext('2d');
    let mainChart = new Chart(ctxMain, {
        type: 'bar',
        data: {
            labels: chartData[currentMode].labels,
            datasets: [{
                label: 'Jumlah Santri',
                data: chartData[currentMode].datasets[currentClass],
                backgroundColor: '#99DDCC', // Warna mint
                borderRadius: 6,
                barPercentage: 0.6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { 
                    beginAtZero: true, 
                    ticks: { precision: 0 }, // Memaksa angka bulat (1,2,3) bukan desimal
                    grid: { color: '#ecf0f1' } 
                },
                x: { grid: { display: false } }
            },
            plugins: {
                legend: { display: false }, // Sembunyikan legenda karena sudah jelas
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.raw + ' Santri';
                        }
                    }
                }
            }
        }
    });

    // Fungsi Update Grafik Saat Tombol Diklik
    function updateChart() {
        mainChart.data.labels = chartData[currentMode].labels;
        mainChart.data.datasets[0].data = chartData[currentMode].datasets[currentClass];
        
        // Ubah warna agar ustadz tahu mode mana yang aktif
        mainChart.data.datasets[0].backgroundColor = (currentMode === 'tahsin') ? '#99DDCC' : '#BAD7DF'; 
        
        mainChart.update();
    }

    // Event Listener Filter Kelas
    document.getElementById('classFilter').addEventListener('change', function(e) {
        currentClass = e.target.value;
        updateChart();
    });

    // Event Listener Toggle Tahsin/Tahfidz
    const btnTahsin = document.getElementById('btnTahsin');
    const btnTahfidz = document.getElementById('btnTahfidz');

    btnTahsin.addEventListener('click', function() {
        currentMode = 'tahsin';
        btnTahsin.classList.add('active');
        btnTahfidz.classList.remove('active');
        updateChart();
    });

    btnTahfidz.addEventListener('click', function() {
        currentMode = 'tahfidz';
        btnTahfidz.classList.add('active');
        btnTahsin.classList.remove('active');
        updateChart();
    });

    // ==========================================
    // 4. Menggambar Donut Chart (Persentase Kehadiran)
    // ==========================================
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
            cutout: '75%',
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

});
