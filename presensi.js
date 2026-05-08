document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Sidebar Toggle Mobile
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    function toggleSidebar() { sidebar.classList.toggle('show'); overlay.classList.toggle('show'); }
    menuToggle.addEventListener('click', toggleSidebar);
    closeSidebar.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);

    // 2. Set Tanggal Hari Ini Secara Otomatis di Input Tanggal
    const tanggalInput = document.getElementById('tanggalInput');
    const today = new Date().toISOString().split('T')[0];
    tanggalInput.value = today;

    // 3. Data Dummy Santri Per Kelas
    const dataSantri = {
        said: [
            { id: 1, name: "Ahmad Hanif" }, { id: 2, name: "Budi Santoso" },
            { id: 3, name: "Citra Kirana" }, { id: 4, name: "Dina Fitri" }, { id: 5, name: "Eko Prasetyo" }
        ],
        umar: [
            { id: 6, name: "Faisal Rahman" }, { id: 7, name: "Gita Savitri" },
            { id: 8, name: "Hadi Susanto" }, { id: 9, name: "Indah Permata" }
        ],
        utsman: [
            { id: 10, name: "Jihan Fahira" }, { id: 11, name: "Kiki Amalia" },
            { id: 12, name: "Laila Majnun" }
        ]
    };

    const kelasSelect = document.getElementById('kelasSelect');
    const presensiContainer = document.getElementById('presensiContainer');
    const namaKelasTitle = document.getElementById('namaKelasTitle');
    const totalSantriPill = document.getElementById('totalSantriPill');

    // 4. Fungsi Menggambar Daftar Santri
    function renderPresensiList(kelasKey) {
        presensiContainer.innerHTML = ''; // Kosongkan daftar
        const santris = dataSantri[kelasKey];
        
        // Update Judul & Jumlah Santri
        const namaKelas = kelasSelect.options[kelasSelect.selectedIndex].text;
        namaKelasTitle.textContent = "Daftar Santri: " + namaKelas;
        totalSantriPill.innerHTML = `<i class="fas fa-user-graduate"></i> ${santris.length} Santri`;

        // Buat kartu untuk masing-masing anak
        santris.forEach((santri, index) => {
            let initial = santri.name.charAt(0);
            let html = `
                <div class="presensi-item">
                    <div class="presensi-header">
                        <div class="active-avatar">${initial}</div>
                        <div class="santri-name">${santri.name}</div>
                    </div>
                    
                    <div class="presensi-status">
                        <input type="radio" name="status_${santri.id}" id="hadir_${santri.id}" class="status-radio" value="hadir" checked>
                        <label for="hadir_${santri.id}" class="status-label"><i class="fas fa-check"></i> Hadir</label>

                        <input type="radio" name="status_${santri.id}" id="izin_${santri.id}" class="status-radio" value="izin">
                        <label for="izin_${santri.id}" class="status-label">Izin</label>

                        <input type="radio" name="status_${santri.id}" id="sakit_${santri.id}" class="status-radio" value="sakit">
                        <label for="sakit_${santri.id}" class="status-label">Sakit</label>

                        <input type="radio" name="status_${santri.id}" id="alpha_${santri.id}" class="status-radio" value="alpha">
                        <label for="alpha_${santri.id}" class="status-label">Alpha</label>
                    </div>

                    <div class="setoran-input-group">
                        <i class="fas fa-pen-clip"></i>
                        <input type="text" class="setoran-input" placeholder="Isi Setoran (Misal: Jilid 4 Hal 21 / Al-Mulk ayat 1-5)">
                    </div>
                </div>
            `;
            presensiContainer.innerHTML += html;
        });
    }

    // Jalankan pertama kali saat halaman dibuka
    renderPresensiList('said');

    // Jika Ustadz mengganti pilihan kelas, ubah daftarnya
    kelasSelect.addEventListener('change', function(e) {
        renderPresensiList(e.target.value);
    });

    // 5. Efek Tombol Simpan
    const btnSimpan = document.getElementById('btnSimpan');
    btnSimpan.addEventListener('click', () => {
        // Efek loading simpel
        let originalText = btnSimpan.innerHTML;
        btnSimpan.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
        
        setTimeout(() => {
            alert('Alhamdulillah! Data presensi dan setoran hari ini berhasil disimpan.');
            btnSimpan.innerHTML = '<i class="fas fa-check"></i> Tersimpan!';
            btnSimpan.style.backgroundColor = '#16a085';
            
            setTimeout(() => {
                btnSimpan.innerHTML = originalText;
                btnSimpan.style.backgroundColor = 'var(--color-mint-dark)';
            }, 2000);
        }, 1000);
    });

});
