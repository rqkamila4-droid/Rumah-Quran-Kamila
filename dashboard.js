document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Cek Keamanan: Jika belum login, usir kembali ke Login
    if (!localStorage.getItem('ustadz_username')) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Set Nama Profil & Inisial Otomatis
    const namaUstadz = localStorage.getItem('nama_ustadz');
    if (namaUstadz) {
        const elementNama = document.querySelector('.profile-name');
        if (elementNama) elementNama.textContent = namaUstadz;
        
        // Mengambil 2 huruf depan untuk Foto Profil (Misal: Reyndi Alafasy -> RA)
        const inisial = namaUstadz.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
        const picElement = document.querySelector('.profile-pic');
        if (picElement) picElement.textContent = inisial;
    }

    // 3. SISTEM PENGGERAK MENU SIDEBAR (GARIS 3)
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

    // ==========================================
    // 4. MENGHIDUPKAN GRAFIK CHART.JS (INTERAKTIF)
    // ==========================================
    
    // Memastikan library Chart.js sudah termuat dari HTML
    if (window.Chart) {
        // Set default font family untuk grafik agar serasi dengan web
        Chart.defaults.font.family = "'Poppins', sans-serif";
        Chart.defaults.color = '#7f8c8d';

        // A. GRAFIK BATANG (Sebaran Kemampuan)
        const canvasBar = document.getElementById('barChartSantri');
        if (canvasBar) {
            const ctxBar = canvasBar.getContext('2d');
            new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: ['Dasar (Jilid 1-3)', 'Menengah (Jilid 4-6)', 'Lanjutan (Tilawah)'],
                    datasets: [{
                        label: 'Jumlah Santri',
                        data: [12, 8, 4], // Ini angka sementara (Dummy)
                        backgroundColor: '#88dec3', // Warna hijau mint khas aplikasi
                        borderRadius: 6, // Ujung batang membulat
                        borderSkipped: false,
                        barThickness: 40 // Ketebalan batang
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }, // Sembunyikan label kotak atas
                        tooltip: {
                            backgroundColor: '#2c3e50',
                            padding: 10,
                            titleFont: { size: 13 },
                            bodyFont: { size: 14, weight: 'bold' },
                            displayColors: false,
                            callbacks: {
                                label: function(context) { return context.parsed.y + ' Santri'; }
                            }
                        }
                    },
                    scales: {
                        y: { beginAtZero: true, grid: { borderDash: [5, 5] }, ticks: { stepSize: 4 } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        // B. GRAFIK DONUT (Persentase Kehadiran)
        const canvasDonut = document.getElementById('donutChartAbsen');
        if (canvasDonut) {
            const ctxDonut = canvasDonut.getContext('2d');
            new Chart(ctxDonut, {
                type: 'doughnut',
                data: {
                    labels: ['Hadir', 'Izin', 'Sakit/Alpha'],
                    datasets: [{
                        data: [85, 10, 5], // Ini angka Persentase (%) sementara
                        backgroundColor: [
                            '#88dec3', // Hijau (Hadir)
                            '#d1d8e0', // Abu-abu (Izin)
                            '#ff7675'  // Merah (Alpha/Sakit)
                        ],
                        borderWidth: 0,
                        hoverOffset: 5 // Efek membesar saat disentuh
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%', // Ketebalan lingkaran donut
                    plugins: {
                        legend: { display: false }, // Disembunyikan karena kita buat legend manual di HTML
                        tooltip: {
                            backgroundColor: '#2c3e50',
                            padding: 10,
                            bodyFont: { size: 14, weight: 'bold' },
                            callbacks: {
                                label: function(context) { return context.label + ': ' + context.parsed + '%'; }
                            }
                        }
                    }
                }
            });
        }
    }

});
