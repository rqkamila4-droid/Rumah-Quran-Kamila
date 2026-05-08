document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    function toggleSidebar() { sidebar.classList.toggle('show'); overlay.classList.toggle('show'); }
    menuToggle.addEventListener('click', toggleSidebar);
    closeSidebar.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);

    // 2. Set Tanggal Hari Ini
    const tanggalInput = document.getElementById('tanggalInput');
    const today = new Date().toISOString().split('T')[0];
    tanggalInput.value = today;

    // 3. Database Dummy (Surat Juz 30 sebagai contoh dominan)
    const surahJuz30 = [
        "78. An-Naba'", "79. An-Nazi'at", "80. 'Abasa", "81. At-Takwir", "82. Al-Infitar", 
        "83. Al-Mutaffifin", "84. Al-Insyiqaq", "85. Al-Buruj", "86. At-Tariq", "87. Al-A'la", 
        "88. Al-Ghasyiyah", "89. Al-Fajr", "90. Al-Balad", "91. Asy-Syams", "92. Al-Lail", 
        "93. Ad-Duha", "94. Asy-Syarh", "95. At-Tin", "96. Al-'Alaq", "97. Al-Qadr", 
        "98. Al-Bayyinah", "99. Az-Zalzalah", "100. Al-'Adiyat", "101. Al-Qari'ah", "102. At-Takasur", 
        "103. Al-'Asr", "104. Al-Humazah", "105. Al-Fil", "106. Quraisy", "107. Al-Ma'un", 
        "108. Al-Kausar", "109. Al-Kafirun", "110. An-Nasr", "111. Al-Lahab", "112. Al-Ikhlas", 
        "113. Al-Falaq", "114. An-Nas"
    ];

    const dataSantri = {
        said: [ { id: 1, name: "Ahmad Hanif" }, { id: 2, name: "Budi Santoso" }, { id: 3, name: "Citra Kirana" } ],
        umar: [ { id: 4, name: "Faisal Rahman" }, { id: 5, name: "Gita Savitri" } ],
        utsman: [ { id: 6, name: "Jihan Fahira" }, { id: 7, name: "Kiki Amalia" } ]
    };

    const kelasSelect = document.getElementById('kelasSelect');
    const presensiContainer = document.getElementById('presensiContainer');
    const darsahBadge = document.getElementById('darsahBadge');
    
    // Fungsi membuat opsi Juz 1-30
    function getJuzOptions() {
        let opts = '<option value="">Pilih Juz</option>';
        for(let i=1; i<=30; i++) { opts += `<option value="${i}">Juz ${i}</option>`; }
        return opts;
    }

    // Fungsi membuat opsi Surat (Disimulasikan, khusus Juz 30 detail, sisanya generic)
    function getSuratOptions() {
        let opts = '<option value="">Pilih Surat</option>';
        surahJuz30.forEach(s => opts += `<option value="${s}">${s}</option>`);
        opts += `<option value="lainnya">-- Surat Lainnya --</option>`;
        return opts;
    }

    // 4. Render Daftar Santri & Form Dinamis
    function renderPresensiList(kelasKey) {
        presensiContainer.innerHTML = ''; 
        const santris = dataSantri[kelasKey];
        const namaKelas = kelasSelect.options[kelasSelect.selectedIndex].text;
        
        document.getElementById('namaKelasTitle').textContent = "Daftar Santri: " + namaKelas;
        document.getElementById('totalSantriPill').innerHTML = `<i class="fas fa-user-graduate"></i> ${santris.length} Santri`;
        darsahBadge.textContent = namaKelas;

        let juzOpts = getJuzOptions();
        let suratOpts = getSuratOptions();

        santris.forEach((santri) => {
            let initial = santri.name.charAt(0);
            let id = santri.id;
            
            let html = `
                <div class="presensi-item" id="item_${id}">
                    <div class="presensi-header">
                        <div class="active-avatar">${initial}</div>
                        <div class="santri-name">${santri.name}</div>
                    </div>
                    
                    <div class="presensi-status">
                        <input type="radio" name="status_${id}" id="hadir_${id}" class="status-radio" value="hadir" checked>
                        <label for="hadir_${id}" class="status-label"><i class="fas fa-check"></i> Hadir</label>
                        <input type="radio" name="status_${id}" id="izin_${id}" class="status-radio" value="izin">
                        <label for="izin_${id}" class="status-label">Izin</label>
                        <input type="radio" name="status_${id}" id="sakit_${id}" class="status-radio" value="sakit">
                        <label for="sakit_${id}" class="status-label">Sakit</label>
                        <input type="radio" name="status_${id}" id="alpha_${id}" class="status-radio" value="alpha">
                        <label for="alpha_${id}" class="status-label">Alpha</label>
                    </div>

                    <div class="action-buttons">
                        <button class="btn-toggle-form" onclick="toggleForm(${id}, 'tahfidz')"><i class="fas fa-book-quran"></i> Isi Tahfidz</button>
                        <button class="btn-toggle-form" onclick="toggleForm(${id}, 'tahsin')"><i class="fas fa-microphone-lines"></i> Isi Tahsin</button>
                    </div>

                    <div id="form_tahfidz_${id}" class="dynamic-form">
                        <div class="form-row">
                            <div class="input-wrapper">
                                <label>Juz</label>
                                <select id="tahfidz_juz_${id}">${juzOpts}</select>
                            </div>
                            <div class="input-wrapper" style="flex: 2;">
                                <label>Surat</label>
                                <select id="tahfidz_surat_${id}">${suratOpts}</select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="input-wrapper">
                                <label>Ayat (Dari - Sampai)</label>
                                <input type="text" id="tahfidz_ayat_${id}" placeholder="Contoh: 1 - 5">
                            </div>
                        </div>
                    </div>

                    <div id="form_tahsin_${id}" class="dynamic-form">
                        <div class="form-row">
                            <div class="input-wrapper">
                                <label>Metode</label>
                                <select id="tahsin_metode_${id}" onchange="changeTahsinMode(${id})">
                                    <option value="iqro">Iqro</option>
                                    <option value="ummi">Ummi</option>
                                    <option value="quran">Al-Qur'an</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row" id="tahsin_buku_mode_${id}">
                            <div class="input-wrapper">
                                <label>Jilid</label>
                                <select id="tahsin_jilid_${id}">
                                    <option value="1">Jilid 1</option><option value="2">Jilid 2</option>
                                    <option value="3">Jilid 3</option><option value="4">Jilid 4</option>
                                    <option value="5">Jilid 5</option><option value="6">Jilid 6</option>
                                </select>
                            </div>
                            <div class="input-wrapper">
                                <label>Halaman</label>
                                <input type="number" id="tahsin_hal_${id}" placeholder="Hal...">
                            </div>
                        </div>

                        <div id="tahsin_quran_mode_${id}" style="display:none;">
                            <div class="form-row">
                                <div class="input-wrapper"><label>Juz</label><select>${juzOpts}</select></div>
                                <div class="input-wrapper" style="flex: 2;"><label>Surat</label><select>${suratOpts}</select></div>
                            </div>
                            <div class="form-row">
                                <div class="input-wrapper"><label>Ayat</label><input type="text" placeholder="1 - 5"></div>
                            </div>
                        </div>
                    </div>

                </div>
            `;
            presensiContainer.innerHTML += html;
        });
    }

    renderPresensiList('said');
    kelasSelect.addEventListener('change', e => renderPresensiList(e.target.value));

    // 5. Fungsi Buka/Tutup Form (Diekspos ke window agar bisa dipanggil HTML)
    window.toggleForm = function(id, type) {
        const formTahfidz = document.getElementById(`form_tahfidz_${id}`);
        const formTahsin = document.getElementById(`form_tahsin_${id}`);
        
        if (type === 'tahfidz') {
            formTahfidz.classList.toggle('show');
            formTahsin.classList.remove('show');
        } else {
            formTahsin.classList.toggle('show');
            formTahfidz.classList.remove('show');
        }
    };

    // 6. Fungsi Ganti Input Tahsin Berdasarkan Metode
    window.changeTahsinMode = function(id) {
        const metode = document.getElementById(`tahsin_metode_${id}`).value;
        const boxBuku = document.getElementById(`tahsin_buku_mode_${id}`);
        const boxQuran = document.getElementById(`tahsin_quran_mode_${id}`);

        if (metode === 'quran') {
            boxBuku.style.display = 'none';
            boxQuran.style.display = 'block';
        } else {
            boxBuku.style.display = 'flex';
            boxQuran.style.display = 'none';
        }
    };

    // 7. Simpan Data Fleksibel
    const btnSimpan = document.getElementById('btnSimpan');
    btnSimpan.addEventListener('click', () => {
        let originalText = btnSimpan.innerHTML;
        btnSimpan.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memperbarui...';
        
        setTimeout(() => {
            // Karena Ustadz butuh fleksibilitas update data, notifikasinya disesuaikan.
            alert('Data Harian (Absensi, Tahfidz, Tahsin, Darsah) berhasil disimpan/diperbarui di sistem!');
            btnSimpan.innerHTML = '<i class="fas fa-check-double"></i> Data Terkini Disimpan';
            btnSimpan.style.backgroundColor = '#16a085';
            
            setTimeout(() => {
                btnSimpan.innerHTML = originalText;
                btnSimpan.style.backgroundColor = 'var(--color-mint-dark)';
            }, 3000);
        }, 800);
    });

});
