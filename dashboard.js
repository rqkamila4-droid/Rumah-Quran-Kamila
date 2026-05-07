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
    // 3. LOGIKA GRAFIK SEBARAN KEMAMPUAN (UPDATE BARU)
    // ==========================================
    
    // Menggunakan Array di dalam label agar teksnya tersusun ke bawah (tidak miring)
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

    // Data Simulasi Daftar Nama Santri untuk Pop-up (Tooltip)
    const mockStudentData = {
        tahfidz: {
            semua: [
                ['• Ahmad - Al-Falaq ayat 3', '• Budi - Al-Lahab ayat 5', '• Citra - Al-Fajr ayat 10', '• Dina - Al-Adiyat ayat 2', '• Eko - Al-Qariah ayat 4', '(+ 7 anak lainnya)'],
                ['• Faisal - Al-Ghosyiah ayat 12', '• Gita - Al-A\'la ayat 5', '• Hadi - At-Tariq ayat 3', '(+ 4 anak lainnya)'],
                ['• Iqbal - Al-Mulk ayat 15', '• Jihan - Al-Jin ayat 5', '• Kiki - Nuh ayat 2', '(+ 2 anak lainnya)']
            ],
            kelas1: [
                ['• Ahmad - Al-Falaq ayat 3', '• Budi - Al-Lahab ayat 5', '(+ 8 anak lainnya)'],
                ['Tidak ada anak di tahap ini'],
                ['Tidak ada anak di tahap ini']
            ],
            kelas2: [
                ['• Dina - Al-Adiyat ayat 2', '• Eko - Al-Qariah ayat 4'],
                ['• Faisal - Al-Ghosyiah ayat 12', '• Gita - Al-A\'la ayat 5', '(+ 3 anak lainnya)'],
                ['• Iqbal - Al-Mulk ayat 15']
            ],
            kelas3: [
                ['Tidak ada anak di tahap ini'],
                ['• Hadi - At-Tariq ayat 3', '• Rio - Abasa ayat 10'],
                ['• Jihan - Al-Jin ayat 5', '• Kiki - Nuh ayat 2', '(+ 2 anak lainnya)']
            ]
        },
        tahsin: {
            semua: [
                ['• Ahmad - Jilid 2', '• Budi - Jilid 1', '• Citra - Jilid 3', '(+ 7 anak lainnya)'],
                ['• Faisal - Jilid 5', '• Gita - Jilid 4', '(+ 6 anak lainnya)'],
                ['• Iqbal - Al-Baqarah', '• Jihan - Ali Imran', '(+ 4 anak lainnya)']
            ],
            kelas1: [
                ['• Ahmad - Jilid 2', '(+ 7 anak lainnya)'],
                ['• Gita - Jilid 4', '• Hasan - Jilid 4'],
                ['Tidak ada anak di tahap ini']
            ],
            kelas2: [
                ['• Citra - Jilid 3', '• Dina - Jilid 3'],
                ['• Faisal - Jilid 5', '(+ 4 anak lainnya)'],
                ['• Iqbal - Al-Baqarah']
            ],
            kelas3: [
                ['Tidak ada anak di tahap ini'],
                ['• Rina - Jilid 6'],
                ['• Jihan - Ali Imran', '• Kiki - An-Nisa', '(+ 3 anak lainnya)']
            ]
        }
    };

    let currentMode = 'tahfidz'; // Diubah defaultnya ke tahfidz agar langsung kelihatan
    let currentClass = 'semua'; 

    const ctxMain = document.getElementById('mainChart').getContext('2d');
    
    // Settingan Global Font Chart.js agar elegan
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
                barPercentage: 0.5 // Membuat batang lebih ramping
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
                    ticks: {
                        maxRotation: 0, // MENCEGAH TEKS MIRING
                        minRotation: 0
                    }
                }
            },
            plugins: {
                legend: { display: false }, 
                tooltip: {
                    backgroundColor: 'rgba(44, 62, 80, 0.95)', // Warna hitam elegan
                    titleFont: { size: 13, weight: '600' },
                    bodyFont: { size: 12 },
                    padding: 12,
                    displayColors: false, // Menghilangkan kotak warna kecil di pop-up
                    callbacks: {
                        // 1. Mengubah Judul Pop-up (Tooltip Title)
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
                        // 2. Teks Total Anak
                        label: function(context) {
                            return 'Total: ' + context.raw + ' Anak';
                        },
                        // 3. Memunculkan Daftar Nama Anak di bawahnya
                        afterLabel: function(context) {
                            let idx = context.dataIndex;
                            let santriList = mockStudentData[currentMode][currentClass][idx];
                            
                            // Membuat garis pembatas putus-putus, lalu menggabungkan dengan daftar nama
                            let separator = ['--------------------------------'];
                            return separator.concat(santriList);
                        }
                    }
                }
            }
        }
    });

    // Fungsi Update Grafik
    function updateChart() {
        mainChart.data.labels = chartData[currentMode].labels;
        mainChart.data.datasets[0].data = chartData[currentMode].datasets[currentClass];
        mainChart.data.datasets[0].backgroundColor = (currentMode === 'tahsin') ? '#99DDCC' : '#BAD7DF'; 
        mainChart.update();
    }

    // Event Listeners untuk Filter & Toggle
    document.getElementById('classFilter').addEventListener('change', function(e) {
        currentClass = e.target.value;
        updateChart();
    });

    const btnTahsin = document.getElementById('btnTahsin');
    const btnTahfidz = document.getElementById('btnTahfidz');

    // Karena default saya set ke Tahfidz, sesuaikan tombol aktifnya
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
