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
    // 3. LOGIKA GRAFIK SEBARAN KEMAMPUAN 
    // ==========================================
    
    const chartData = {
        tahsin: {
            labels: [['Dasar', '(Jilid 1-3)'], ['Menengah', '(Jilid 4-6)'], ['Lanjutan', '(Tilawah)']],
            datasets: {
                semua: [10, 8, 6],
                kelas1: [8, 2, 0],
                kelas2: [2, 5, 1],
                kelas3: [0, 1, 5]
            }
        },
        tahfidz: {
            labels: [['½ 1', 'Juz 30'], ['½ 2', 'Juz 30'], ['Juz 29']],
            datasets: {
                semua: [12, 7, 5],
                kelas1: [10, 0, 0],
                kelas2: [2, 5, 1],
                kelas3: [0, 2, 4]
            }
        }
    };

    // Data Simulasi Lengkap Tanpa Singkatan (Sesuai Request)
    const mockStudentData = {
        tahfidz: {
            semua: [
                ['• Ahmad - Al-Falaq ayat 3', '• Budi - Al-Lahab ayat 5', '• Citra - Al-Fajr ayat 10', '• Dina - Al-Adiyat ayat 2', '• Eko - Al-Qariah ayat 4', '• Farhan - At-Takasur ayat 1', '• Gilang - Al-Asr ayat 3', '• Hana - Al-Humazah ayat 5', '• Irfan - Al-Fil ayat 2', '• Jamil - Quraisy ayat 4', '• Kania - Al-Maun ayat 1', '• Luthfi - Al-Kausar ayat 3'],
                ['• Faisal - Al-Ghosyiah ayat 12', '• Gita - Al-A\'la ayat 5', '• Hadi - At-Tariq ayat 3', '• Indah - Al-Buruj ayat 10', '• Jamal - Al-Insyiqaq ayat 5', '• Kiki - Al-Mutaffifin ayat 15', '• Laila - Al-Infitar ayat 8'],
                ['• Iqbal - Al-Mulk ayat 15', '• Jihan - Al-Jin ayat 5', '• Kiki - Nuh ayat 2', '• Maman - Al-Ma\'arij ayat 10', '• Nisa - Al-Haqqah ayat 12']
            ],
            kelas1: [
                ['• Ahmad - Al-Falaq ayat 3', '• Budi - Al-Lahab ayat 5', '• Citra - Al-Fajr ayat 10', '• Farhan - At-Takasur ayat 1', '• Gilang - Al-Asr ayat 3', '• Hana - Al-Humazah ayat 5', '• Irfan - Al-Fil ayat 2', '• Jamil - Quraisy ayat 4', '• Kania - Al-Maun ayat 1', '• Luthfi - Al-Kausar ayat 3'],
                ['Tidak ada anak di tahap ini'],
                ['Tidak ada anak di tahap ini']
            ],
            kelas2: [
                ['• Dina - Al-Adiyat ayat 2', '• Eko - Al-Qariah ayat 4'],
                ['• Faisal - Al-Ghosyiah ayat 12', '• Gita - Al-A\'la ayat 5', '• Indah - Al-Buruj ayat 10', '• Jamal - Al-Insyiqaq ayat 5', '• Kiki - Al-Mutaffifin ayat 15'],
                ['• Iqbal - Al-Mulk ayat 15']
            ],
            kelas3: [
                ['Tidak ada anak di tahap ini'],
                ['• Hadi - At-Tariq ayat 3', '• Laila - Al-Infitar ayat 8'],
                ['• Jihan - Al-Jin ayat 5', '• Kiki - Nuh ayat 2', '• Maman - Al-Ma\'arij ayat 10', '• Nisa - Al-Haqqah ayat 12']
            ]
        },
        tahsin: {
            semua: [
                ['• Budi - Jilid 1 - Hal 5', '• Citra - Jilid 1 - Hal 12', '• Doni - Jilid 2 - Hal 8', '• Eka - Jilid 2 - Hal 20', '• Fina - Jilid 2 - Hal 25', '• Gilang - Jilid 3 - Hal 4', '• Hana - Jilid 3 - Hal 15', '• Irfan - Jilid 3 - Hal 30', '• Jamil - Jilid 3 - Hal 35', '• Kania - Jilid 3 - Hal 40'],
                ['• Ahmad - Jilid 6 - Hal 21', '• Laila - Jilid 4 - Hal 10', '• Maman - Jilid 4 - Hal 22', '• Nisa - Jilid 5 - Hal 5', '• Oki - Jilid 5 - Hal 18', '• Putri - Jilid 5 - Hal 30', '• Qori - Jilid 6 - Hal 8', '• Rina - Jilid 6 - Hal 15'],
                ['• Syifa - Al-Baqarah: 15', '• Tariq - Ali Imran: 5', '• Umar - An-Nisa: 10', '• Vina - Al-Maidah: 2', '• Wawan - Al-An\'am: 8', '• Yudi - Al-A\'raf: 12']
            ],
            kelas1: [
                ['• Budi - Jilid 1 - Hal 5', '• Citra - Jilid 1 - Hal 12', '• Doni - Jilid 2 - Hal 8', '• Eka - Jilid 2 - Hal 20', '• Fina - Jilid 2 - Hal 25', '• Gilang - Jilid 3 - Hal 4', '• Hana - Jilid 3 - Hal 15', '• Irfan - Jilid 3 - Hal 30'],
                ['• Laila - Jilid 4 - Hal 10', '• Maman - Jilid 4 - Hal 22'],
                ['Tidak ada anak di tahap ini']
            ],
            kelas2: [
                ['• Jamil - Jilid 3 - Hal 35', '• Kania - Jilid 3 - Hal 40'],
                ['• Ahmad - Jilid 6 - Hal 21', '• Nisa - Jilid 5 - Hal 5', '• Oki - Jilid 5 - Hal 18', '• Putri - Jilid 5 - Hal 30', '• Qori - Jilid 6 - Hal 8'],
                ['• Syifa - Al-Baqarah: 15']
            ],
            kelas3: [
                ['Tidak ada anak di tahap ini'],
                ['• Rina - Jilid 6 - Hal 15'],
                ['• Tariq - Ali Imran: 5', '• Umar - An-Nisa: 10', '• Vina - Al-Maidah: 2', '• Wawan - Al-An\'am: 8', '• Yudi - Al-A\'raf: 12']
            ]
        }
    };

    let currentMode = 'tahfidz'; 
    let currentClass = 'semua'; 

    const ctxMain = document.getElementById('mainChart').getContext('2d');
    
    Chart.defaults.font.family = 'Poppins';
    Chart.defaults.color = '#7f8c8d';

    let mainChart = new Chart(ctxMain, {
        type: 'bar',
        data: {
            labels: chartData[currentMode].labels,
            datasets: [{
                label: 'Jumlah Anak',
                data: chartData[currentMode].datasets[currentClass],
                backgroundColor: '#99DDCC', 
                borderRadius: 8,
                barPercentage: 0.5 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { 
                    beginAtZero: true, 
                    ticks: { precision: 0 }, 
                    grid: { color: '#ecf0f1' } 
                },
                x: { 
                    grid: { display: false },
                    ticks: { maxRotation: 0, minRotation: 0 }
                }
            },
            plugins: {
                legend: { display: false }, 
                tooltip: {
                    backgroundColor: 'rgba(44, 62, 80, 0.95)', 
                    titleFont: { size: 13, weight: '600' },
                    bodyFont: { size: 12 },
                    padding: 12,
                    displayColors: false, 
                    callbacks: {
                        title: function(context) {
                            let idx = context[0].dataIndex;
                            if (currentMode === 'tahfidz') {
                                const fullTitles = [
                                    '½ 1 Juz 30 (An-Nas - Al-Fajr)',
                                    '½ 2 Juz 30 (Al-Ghosyiah - An-Naba\')',
                                    'Juz 29'
                                ];
                                return fullTitles[idx];
                            } else {
                                const fullTitles = [
                                    'Tahsin Dasar (Jilid 1-3)',
                                    'Tahsin Menengah (Jilid 4-6)',
                                    'Tahsin Lanjutan (Tilawah)'
                                ];
                                return fullTitles[idx];
                            }
                        },
                        label: function(context) {
                            return 'Total: ' + context.raw + ' Anak';
                        },
                        afterLabel: function(context) {
                            let idx = context.dataIndex;
                            let santriList = mockStudentData[currentMode][currentClass][idx];
                            let separator = ['--------------------------------'];
                            return separator.concat(santriList);
                        }
                    }
                }
            }
        }
    });

    function updateChart() {
        mainChart.data.labels = chartData[currentMode].labels;
        mainChart.data.datasets[0].data = chartData[currentMode].datasets[currentClass];
        mainChart.data.datasets[0].backgroundColor = (currentMode === 'tahsin') ? '#99DDCC' : '#BAD7DF'; 
        mainChart.update();
    }

    document.getElementById('classFilter').addEventListener('change', function(e) {
        currentClass = e.target.value;
        updateChart();
    });

    const btnTahsin = document.getElementById('btnTahsin');
    const btnTahfidz = document.getElementById('btnTahfidz');

    btnTahfidz.classList.add('active');
    btnTahsin.classList.remove('active');

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
    // 4. Menggambar Donut Chart
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
