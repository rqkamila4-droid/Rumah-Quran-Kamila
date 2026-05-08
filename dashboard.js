document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Toggles Sidebar
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    function toggleSidebar() { sidebar.classList.toggle('show'); overlay.classList.toggle('show'); }
    menuToggle.addEventListener('click', toggleSidebar);
    closeSidebar.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);

    // ==========================================
    // 2. LOGIKA JADWAL HARI INI (REAL-TIME STATUS)
    // ==========================================
    // Format displayTime menggunakan " - "
    // startTime digunakan untuk logika hitung mundur (wajib HH:MM)
    const todaySchedule = [
        { name: "SAID BIN ZAID", displayTime: "13:30 - 14:30", startTime: "13:30", count: 11 },
        { name: "UMAR BIN KHATTAB", displayTime: "15:00 - 16:00", startTime: "15:00", count: 15 },
        { name: "UTSMAN BIN AFFAN", displayTime: "16:30 - 17:30", startTime: "16:30", count: 12 }
    ];

    function checkScheduleStatus() {
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentTimeInMinutes = (currentHours * 60) + currentMinutes;

        let nextClass = null;
        let statusText = "Selesai";
        let statusClass = "done"; // Default class untuk yang sudah selesai

        for (let cls of todaySchedule) {
            let [h, m] = cls.startTime.split(':').map(Number);
            let classTimeInMinutes = (h * 60) + m;
            let diff = classTimeInMinutes - currentTimeInMinutes;

            // Jika kelas belum lewat 60 menit dari jam mulainya
            if (diff > -60) {
                nextClass = cls;
                if (diff > 10) {
                    statusText = "Akan Datang";
                    statusClass = "waiting";
                } else if (diff > 0 && diff <= 10) {
                    statusText = "Segera Dimulai";
                    statusClass = "starting";
                } else {
                    statusText = "Sedang Berjalan";
                    statusClass = "active";
                }
                break; 
            }
        }

        if (nextClass) {
            document.getElementById('nextClassName').textContent = nextClass.name;
            document.getElementById('nextClassTime').textContent = nextClass.displayTime;
            document.getElementById('nextClassCount').textContent = nextClass.count;
            const badge = document.getElementById('nextClassStatus');
            badge.textContent = statusText;
            badge.className = "status-badge " + statusClass;
        } else {
            document.getElementById('nextClassName').textContent = "Tidak Ada";
            document.getElementById('nextClassTime').textContent = "-";
            document.getElementById('nextClassCount').textContent = "0";
            const badge = document.getElementById('nextClassStatus');
            badge.textContent = "Semua Selesai";
            badge.className = "status-badge done";
        }
    }

    checkScheduleStatus();
    setInterval(checkScheduleStatus, 60000);

    // ==========================================
    // 3. MODAL BOX STATUS MENGULANG
    // ==========================================
    const modal = document.getElementById('murojaahModal');
    const btnMurojaah = document.getElementById('btnMurojaah');
    const closeModal = document.getElementById('closeMurojaahModal');
    const murojaahList = document.getElementById('murojaahList');

    const dataMurojaah = [
        { name: "Ahmad Hanif", detail: "Jilid 4 - Hal 21 (Makhroj kurang tepat)" },
        { name: "Doni Saputra", detail: "Jilid 3 - Hal 15 (Tajwid berdengung)" },
        { name: "Siti Aisyah", detail: "Jilid 5 - Hal 8 (Panjang pendek)" },
        { name: "Umar Faruq", detail: "Jilid 2 - Hal 10 (Kelancaran)" },
        { name: "Zaidan Ali", detail: "Al-Baqarah (Lupa sambungan ayat)" }
    ];

    btnMurojaah.addEventListener('click', () => {
        murojaahList.innerHTML = ''; 
        dataMurojaah.forEach(anak => {
            let li = document.createElement('li');
            li.innerHTML = `<strong>${anak.name}</strong> <span>Catatan: ${anak.detail}</span>`;
            murojaahList.appendChild(li);
        });
        modal.style.display = "block";
    });

    closeModal.addEventListener('click', () => { modal.style.display = "none"; });
    window.addEventListener('click', (event) => { if (event.target == modal) { modal.style.display = "none"; }});

    // ==========================================
    // 4. LOGIKA SANTRI TERAKTIF 
    // ==========================================
    const activeData = {
        pekan: [
            { name: "Ahmad Hanif", cls: "Kelas 1", attend: 5, tahsin: "Jilid 4 - Hal 21", tahfidz: "Juz 30 - Al-Mulk: 15" },
            { name: "Fatimah Az", cls: "Kelas 2", attend: 5, tahsin: "Jilid 5 - Hal 10", tahfidz: "Juz 30 - Al-A'la: 5" },
            { name: "Zaidan Ali", cls: "Kelas 3", attend: 4, tahsin: "Tilawah - Al-Baqarah", tahfidz: "Juz 29 - Al-Jin: 5" }
        ],
        bulan: [
            { name: "Budi Santoso", cls: "Kelas 1", attend: 20, tahsin: "Jilid 3 - Hal 15", tahfidz: "Juz 30 - Al-Fajr: 10" },
            { name: "Gita Savitri", cls: "Kelas 2", attend: 19, tahsin: "Jilid 6 - Hal 8", tahfidz: "Juz 30 - At-Tariq: 3" },
            { name: "Kiki Amalia", cls: "Kelas 3", attend: 20, tahsin: "Tilawah - An-Nisa", tahfidz: "Juz 29 - Nuh: 2" }
        ]
    };

    const listContainer = document.getElementById('activeStudentsList');
    const btnWeek = document.getElementById('btnActiveWeek');
    const btnMonth = document.getElementById('btnActiveMonth');

    function renderActiveStudents(period) {
        listContainer.innerHTML = '';
        activeData[period].forEach(anak => {
            let initial = anak.name.charAt(0);
            let html = `
                <div class="active-item">
                    <div class="active-avatar">${initial}</div>
                    <div class="active-details">
                        <h5>${anak.name} <span class="class-tag">${anak.cls}</span></h5>
                        <p><i class="fas fa-microphone-lines"></i> ${anak.tahsin}</p>
                        <p><i class="fas fa-book-quran"></i> ${anak.tahfidz}</p>
                    </div>
                    <div class="score">${anak.attend}x Hadir</div>
                </div>
            `;
            listContainer.innerHTML += html;
        });
    }

    renderActiveStudents('pekan');

    btnWeek.addEventListener('click', () => {
        btnWeek.classList.add('active'); btnMonth.classList.remove('active');
        renderActiveStudents('pekan');
    });
    btnMonth.addEventListener('click', () => {
        btnMonth.classList.add('active'); btnWeek.classList.remove('active');
        renderActiveStudents('bulan');
    });

    // ==========================================
    // 5. GRAFIK SEBARAN KEMAMPUAN
    // ==========================================
    const chartData = {
        tahsin: {
            labels: [['Dasar', '(Jilid 1-3)'], ['Menengah', '(Jilid 4-6)'], ['Lanjutan', '(Tilawah)']],
            datasets: { semua: [10, 8, 6], kelas1: [8, 2, 0], kelas2: [2, 5, 1], kelas3: [0, 1, 5] }
        },
        tahfidz: {
            labels: [['½ 1', 'Juz 30'], ['½ 2', 'Juz 30'], ['Juz 29']],
            datasets: { semua: [12, 7, 5], kelas1: [10, 0, 0], kelas2: [2, 5, 1], kelas3: [0, 2, 4] }
        }
    };

    const mockStudentData = {
        tahfidz: {
            semua: [
                ['• Ahmad - Al-Falaq ayat 3', '• Budi - Al-Lahab ayat 5'],
                ['• Faisal - Al-Ghosyiah ayat 12', '• Gita - Al-A\'la ayat 5'],
                ['• Iqbal - Al-Mulk ayat 15', '• Jihan - Al-Jin ayat 5']
            ],
            kelas1: [['• Ahmad - Al-Falaq'], ['Kosong'], ['Kosong']],
            kelas2: [['Kosong'], ['• Faisal - Al-Ghosyiah'], ['Kosong']],
            kelas3: [['Kosong'], ['Kosong'], ['• Iqbal - Al-Mulk']]
        },
        tahsin: {
            semua: [
                ['• Budi - Jilid 1 - Hal 5'], ['• Ahmad - Jilid 6 - Hal 21'], ['• Syifa - Al-Baqarah: 15']
            ],
            kelas1: [['• Budi - Jilid 1'], ['Kosong'], ['Kosong']],
            kelas2: [['Kosong'], ['• Ahmad - Jilid 6'], ['Kosong']],
            kelas3: [['Kosong'], ['Kosong'], ['• Syifa - Al-Baqarah']]
        }
    };

    let currentMode = 'tahfidz'; let currentClass = 'semua'; 
    const ctxMain = document.getElementById('mainChart').getContext('2d');
    Chart.defaults.font.family = 'Poppins'; Chart.defaults.color = '#7f8c8d';

    let mainChart = new Chart(ctxMain, {
        type: 'bar',
        data: {
            labels: chartData[currentMode].labels,
            datasets: [{
                label: 'Jumlah Anak', data: chartData[currentMode].datasets[currentClass],
                backgroundColor: '#99DDCC', borderRadius: 8, barPercentage: 0.5 
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: '#ecf0f1' } }, x: { grid: { display: false }, ticks: { maxRotation: 0, minRotation: 0 } } },
            plugins: {
                legend: { display: false }, 
                tooltip: {
                    backgroundColor: 'rgba(44, 62, 80, 0.95)', titleFont: { size: 13, weight: '600' }, bodyFont: { size: 12 }, padding: 12, displayColors: false, 
                    callbacks: {
                        title: function(context) {
                            let idx = context[0].dataIndex;
                            return (currentMode === 'tahfidz') ? ['½ 1 Juz 30', '½ 2 Juz 30', 'Juz 29'][idx] : ['Tahsin Dasar', 'Tahsin Menengah', 'Tahsin Lanjutan'][idx];
                        },
                        label: function(context) { return 'Total: ' + context.raw + ' Anak'; },
                        afterLabel: function(context) {
                            return ['--------------------------------'].concat(mockStudentData[currentMode][currentClass][context.dataIndex]);
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
    document.getElementById('classFilter').addEventListener('change', e => { currentClass = e.target.value; updateChart(); });
    document.getElementById('btnTahsin').addEventListener('click', function() { currentMode = 'tahsin'; this.classList.add('active'); document.getElementById('btnTahfidz').classList.remove('active'); updateChart(); });
    document.getElementById('btnTahfidz').addEventListener('click', function() { currentMode = 'tahfidz'; this.classList.add('active'); document.getElementById('btnTahsin').classList.remove('active'); updateChart(); });

    // ==========================================
    // 6. DONUT CHART (INTERAKTIF NAMA ANAK)
    // ==========================================
    const attendanceData = {
        Hadir: ['• Ahmad', '• Budi', '• Citra', '(+17 lainnya)'],
        Izin: ['• Dika', '• Evi'],
        Sakit: ['• Farhan']
    };

    const ctxDonut = document.getElementById('donutChart').getContext('2d');
    new Chart(ctxDonut, {
        type: 'doughnut',
        data: {
            labels: ['Hadir', 'Izin', 'Sakit/Alpha'],
            datasets: [{
                data: [20, 2, 1], 
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
                legend: { position: 'bottom' },
                tooltip: {
                    backgroundColor: 'rgba(44, 62, 80, 0.95)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw + ' Anak';
                        },
                        afterLabel: function(context) {
                            let statusName = context.label.split('/')[0]; 
                            return ['--------------------------------'].concat(attendanceData[statusName]);
                        }
                    }
                }
            }
        }
    });

});
