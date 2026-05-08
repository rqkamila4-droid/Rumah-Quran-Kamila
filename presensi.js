document.addEventListener("DOMContentLoaded", () => {
    
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    function toggleSidebar() { sidebar.classList.toggle('show'); overlay.classList.toggle('show'); }
    menuToggle.addEventListener('click', toggleSidebar);
    closeSidebar.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);

    const tanggalInput = document.getElementById('tanggalInput');
    const today = new Date().toISOString().split('T')[0];
    tanggalInput.value = today;

    // Database Struktur Al-Quran (Juz dan Surat di dalamnya)
    const quranJuzMap = {
        1: ["1. Al-Fatihah", "2. Al-Baqarah"],
        2: ["2. Al-Baqarah"],
        3: ["2. Al-Baqarah", "3. Ali 'Imran"],
        4: ["3. Ali 'Imran", "4. An-Nisa'"],
        5: ["4. An-Nisa'"],
        6: ["4. An-Nisa'", "5. Al-Ma'idah"],
        7: ["5. Al-Ma'idah", "6. Al-An'am"],
        8: ["6. Al-An'am", "7. Al-A'raf"],
        9: ["7. Al-A'raf", "8. Al-Anfal"],
        10: ["8. Al-Anfal", "9. At-Taubah"],
        11: ["9. At-Taubah", "10. Yunus", "11. Hud"],
        12: ["11. Hud", "12. Yusuf"],
        13: ["12. Yusuf", "13. Ar-Ra'd", "14. Ibrahim"],
        14: ["15. Al-Hijr", "16. An-Nahl"],
        15: ["17. Al-Isra'", "18. Al-Kahf"],
        16: ["18. Al-Kahf", "19. Maryam", "20. Taha"],
        17: ["21. Al-Anbiya'", "22. Al-Hajj"],
        18: ["23. Al-Mu'minun", "24. An-Nur", "25. Al-Furqan"],
        19: ["25. Al-Furqan", "26. Asy-Syu'ara'", "27. An-Naml"],
        20: ["27. An-Naml", "28. Al-Qasas", "29. Al-'Ankabut"],
        21: ["29. Al-'Ankabut", "30. Ar-Rum", "31. Luqman", "32. As-Sajdah", "33. Al-Ahzab"],
        22: ["33. Al-Ahzab", "34. Saba'", "35. Fatir", "36. Yasin"],
        23: ["36. Yasin", "37. As-Saffat", "38. Sad", "39. Az-Zumar"],
        24: ["39. Az-Zumar", "40. Ghafir", "41. Fussilat"],
        25: ["41. Fussilat", "42. Asy-Syura", "43. Az-Zukhruf", "44. Ad-Dukhan", "45. Al-Jasiyah"],
        26: ["46. Al-Ahqaf", "47. Muhammad", "48. Al-Fath", "49. Al-Hujurat", "50. Qaf", "51. Az-Zariyat"],
        27: ["51. Az-Zariyat", "52. At-Tur", "53. An-Najm", "54. Al-Qamar", "55. Ar-Rahman", "56. Al-Waqi'ah", "57. Al-Hadid"],
        28: ["58. Al-Mujadilah", "59. Al-Hasyr", "60. Al-Mumtahanah", "61. As-Saff", "62. Al-Jumu'ah", "63. Al-Munafiqun", "64. At-Tagabun", "65. At-Talaq", "66. At-Tahrim"],
        29: ["67. Al-Mulk", "68. Al-Qalam", "69. Al-Haqqah", "70. Al-Ma'arij", "71. Nuh", "72. Al-Jin", "73. Al-Muzzammil", "74. Al-Muddassir", "75. Al-Qiyamah", "76. Al-Insan", "77. Al-Mursalat"],
        30: ["78. An-Naba'", "79. An-Nazi'at", "80. 'Abasa", "81. At-Takwir", "82. Al-Infitar", "83. Al-Mutaffifin", "84. Al-Insyiqaq", "85. Al-Buruj", "86. At-Tariq", "87. Al-A'la", "88. Al-Ghasyiyah", "89. Al-Fajr", "90. Al-Balad", "91. Asy-Syams", "92. Al-Lail", "93. Ad-Duha", "94. Asy-Syarh", "95. At-Tin", "96. Al-'Alaq", "97. Al-Qadr", "98. Al-Bayyinah", "99. Az-Zalzalah", "100. Al-'Adiyat", "101. Al-Qari'ah", "102. At-Takasur", "103. Al-'Asr", "104. Al-Humazah", "105. Al-Fil", "106. Quraisy", "107. Al-Ma'un", "108. Al-Kausar", "109. Al-Kafirun", "110. An-Nasr", "111. Al-Lahab", "112. Al-Ikhlas", "113. Al-Falaq", "114. An-Nas"]
    };

    const dataSantri = {
        said: [ { id: 1, name: "Ahmad Hanif" }, { id: 2, name: "Budi Santoso" }, { id: 3, name: "Citra Kirana" } ],
        umar: [ { id: 4, name: "Faisal Rahman" }, { id: 5, name: "Gita Savitri" } ],
        utsman: [ { id: 6, name: "Jihan Fahira" }, { id: 7, name: "Kiki Amalia" } ]
    };

    const kelasSelect = document.getElementById('kelasSelect');
    const presensiContainer = document.getElementById('presensiContainer');
    const darsahBadge = document.getElementById('darsahBadge');
    
    function getJuzOptions() {
        let opts = '<option value="">Pilih Juz</option>';
        for(let i=1; i<=30; i++) { opts += `<option value="${i}">Juz ${i}</option>`; }
        return opts;
    }

    function renderPresensiList(kelasKey) {
        presensiContainer.innerHTML = ''; 
        const santris = dataSantri[kelasKey];
        const namaKelas = kelasSelect.options[kelasSelect.selectedIndex].text;
        
        document.getElementById('namaKelasTitle').textContent = "Daftar Santri: " + namaKelas;
        document.getElementById('totalSantriPill').innerHTML = `<i class="fas fa-user-graduate"></i> ${santris.length} Santri`;
        darsahBadge.textContent = namaKelas;

        let juzOpts = getJuzOptions();

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
                                <select id="tahfidz_juz_${id}" onchange="updateSuratOptions(${id}, 'tahfidz')">${juzOpts}</select>
                            </div>
                            <div class="input-wrapper" style="flex: 2;">
                                <label>Surat</label>
                                <select id="tahfidz_surat_${id}"><option value="">-- Pilih Juz Dulu --</option></select>
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
                                <div class="input-wrapper">
                                    <label>Juz</label>
                                    <select id="tahsin_juz_${id}" onchange="updateSuratOptions(${id}, 'tahsin')">${juzOpts}</select>
                                </div>
                                <div class="input-wrapper" style="flex: 2;">
                                    <label>Surat</label>
                                    <select id="tahsin_surat_${id}"><option value="">-- Pilih Juz Dulu --</option></select>
                                </div>
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

    // Logika Pintar: Mengubah Pilihan Surat Berdasarkan Juz
    window.updateSuratOptions = function(id, type) {
        let juzSelect = document.getElementById(`${type}_juz_${id}`);
        let suratSelect = document.getElementById(`${type}_surat_${id}`);
        let selectedJuz = juzSelect.value;

        suratSelect.innerHTML = '<option value="">Pilih Surat</option>';
        if(selectedJuz && quranJuzMap[selectedJuz]) {
            quranJuzMap[selectedJuz].forEach(s => {
                suratSelect.innerHTML += `<option value="${s}">${s}</option>`;
            });
        }
    };

    window.toggleForm = function(id, type) {
        const formTahfidz = document.getElementById(`form_tahfidz_${id}`);
        const formTahsin = document.getElementById(`form_tahsin_${id}`);
        if (type === 'tahfidz') {
            formTahfidz.classList.toggle('show'); formTahsin.classList.remove('show');
        } else {
            formTahsin.classList.toggle('show'); formTahfidz.classList.remove('show');
        }
    };

    window.changeTahsinMode = function(id) {
        const metode = document.getElementById(`tahsin_metode_${id}`).value;
        const boxBuku = document.getElementById(`tahsin_buku_mode_${id}`);
        const boxQuran = document.getElementById(`tahsin_quran_mode_${id}`);
        if (metode === 'quran') {
            boxBuku.style.display = 'none'; boxQuran.style.display = 'block';
        } else {
            boxBuku.style.display = 'flex'; boxQuran.style.display = 'none';
        }
    };

    // Alert Simpan Atas & Bawah
    function showAlert(btnElement) {
        let originalText = btnElement.innerHTML;
        btnElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memperbarui...';
        setTimeout(() => {
            alert('Data Harian berhasil disimpan! Anda bisa mengupdate kembali jika ada anak yang datang terlambat.');
            btnElement.innerHTML = '<i class="fas fa-check-double"></i> Tersimpan';
            btnElement.style.backgroundColor = '#16a085';
            setTimeout(() => {
                btnElement.innerHTML = originalText;
                btnElement.style.backgroundColor = ''; // kembali ke CSS asli
            }, 3000);
        }, 800);
    }

    document.getElementById('btnSimpanAtas').addEventListener('click', function() { showAlert(this); });
    document.getElementById('btnSimpanBawah').addEventListener('click', function() { showAlert(this); });

});
