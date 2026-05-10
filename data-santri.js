document.addEventListener("DOMContentLoaded", async () => {
    
    // === KONFIGURASI SUPABASE BARU ===
    const SUPABASE_URL = 'https://ucsfssukcrkmguhizbbj.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjc2Zzc3VrY3JrbWd1aGl6YmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMjkxOTksImV4cCI6MjA5MzkwNTE5OX0.2rSwfgAhzyeSb_ru-6K9hDKSMtFbSK1vgiBpopqM9NY';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // Simulasi Login Ustadz
    let currentUstadzId = localStorage.getItem('ustadz_id') || '00000000-0000-0000-0000-000000000000';

    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    function toggleSidebar() { sidebar.classList.toggle('show'); overlay.classList.toggle('show'); }
    if(menuToggle) menuToggle.addEventListener('click', toggleSidebar);
    if(closeSidebar) closeSidebar.addEventListener('click', toggleSidebar);
    if(overlay) overlay.addEventListener('click', toggleSidebar);

    // Variabel Global Data
    let daftarSantriBinaan = [];
    let daftarKelasBinaan = [];
    let daftarDapodikTersedia = [];
    
    const tableBody = document.getElementById('santriTableBody');
    const filterKelasTable = document.getElementById('filterKelasTable');
    const selectKelasTarget = document.getElementById('selectKelasTarget');
    const dapodikListContainer = document.getElementById('dapodikListContainer');

    // ==========================================
    // 1. FUNGSI AMBIL KELAS & SANTRI (BINAAN)
    // ==========================================
    async function fetchKelasBinaan() {
        try {
            // SIMULASI: Data Kelas
            const data = [
                { id: 1, nama_kelas: "Said Bin Zaid (Simulasi)", jadwal_hari: "Senin, Rabu", jam_mulai: "13:30", jam_selesai: "14:30" }
            ];
            
            daftarKelasBinaan = data;
            
            let optsFilter = '<option value="semua">Semua Kelas Binaan</option>';
            let optsTarget = '';
            
            data.forEach(k => {
                let infoJadwal = k.jadwal_hari ? ` (${k.jadwal_hari})` : '';
                optsFilter += `<option value="${k.id}">${k.nama_kelas}</option>`;
                optsTarget += `<option value="${k.id}">${k.nama_kelas}${infoJadwal}</option>`;
            });
            
            if(filterKelasTable) filterKelasTable.innerHTML = optsFilter;
            if(selectKelasTarget) selectKelasTarget.innerHTML = optsTarget;
        } catch (error) {
            console.error("Gagal memuat kelas:", error.message);
        }
    }

    async function fetchSantriBinaan() {
        try {
            if(tableBody) tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Menarik data binaan...</td></tr>';
            
            if (daftarKelasBinaan.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Anda belum memiliki kelas. Buat kelas terlebih dahulu.</td></tr>';
                return;
            }

            // SIMULASI: Data Santri
            const data = [
                { nis: "202601", nama: "Ahmad Hanif (Simulasi)", kelas_id: 1, gender: "L" },
                { nis: "202602", nama: "Fatimah Az-Zahra (Simulasi)", kelas_id: 1, gender: "P" }
            ];
            
            daftarSantriBinaan = data;
            renderTable(daftarSantriBinaan);
        } catch (error) {
            console.error("Gagal memuat santri:", error.message);
        }
    }

    async function fetchDapodikTersedia() {
        try {
            dapodikListContainer.innerHTML = '<div style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Memuat data Dapodik...</div>';
            
            const data = [
                { nis: "9001", nama: "Budi Santoso", gender: "L" },
                { nis: "9002", nama: "Citra Kirana", gender: "P" },
                { nis: "9003", nama: "Dika Pratama", gender: "L" }
            ];
            
            daftarDapodikTersedia = data;
            renderDapodikList(daftarDapodikTersedia);
        } catch (error) {
            dapodikListContainer.innerHTML = `<div style="color:red; text-align:center;">Gagal memuat Dapodik.</div>`;
        }
    }

    // ==========================================
    // 2. FUNGSI RENDER TABEL & LIST
    // ==========================================
    function renderTable(dataToRender) {
        if(!tableBody) return;
        tableBody.innerHTML = '';
        
        if(dataToRender.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Belum ada santri. Klik "Tarik Santri".</td></tr>';
            return;
        }

        dataToRender.forEach((s) => {
            let namaKelas = "Tidak diketahui";
            let kelasObj = daftarKelasBinaan.find(k => k.id == s.kelas_id);
            if(kelasObj) namaKelas = kelasObj.nama_kelas;

            let row = `
                <tr>
                    <td>${s.nis}</td>
                    <td><strong>${s.nama}</strong></td>
                    <td><span class="class-badge">${namaKelas}</span></td>
                    <td>${s.gender || '-'}</td>
                    <td style="text-align: center;">
                        <button class="btn-delete" onclick="keluarkanSantri('${s.nis}')" title="Keluarkan dari Kelas"><i class="fas fa-user-minus"></i></button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    function renderDapodikList(dataToRender) {
        dapodikListContainer.innerHTML = '';
        if(dataToRender.length === 0) {
            dapodikListContainer.innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 10px;">Semua santri di Dapodik sudah masuk ke kelas.</div>';
            return;
        }

        dataToRender.forEach(s => {
            let item = `
                <div style="display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                    <input type="checkbox" class="dapodik-checkbox" value="${s.nis}" id="chk_${s.nis}" style="margin-right: 10px; transform: scale(1.2);">
                    <label for="chk_${s.nis}" style="font-size: 0.85rem; cursor: pointer; flex: 1;">
                        <strong>${s.nama}</strong> <span style="color: #999; font-size: 0.75rem;">(NIS: ${s.nis})</span>
                    </label>
                </div>
            `;
            dapodikListContainer.innerHTML += item;
        });
    }

    await fetchKelasBinaan();
    fetchSantriBinaan();

    // ==========================================
    // 3. FITUR PENCARIAN & FILTER
    // ==========================================
    function filterDataUtama() {
        let keyword = document.getElementById('searchSantri').value.toLowerCase();
        let kelasId = filterKelasTable.value;

        let filtered = daftarSantriBinaan.filter(s => {
            let matchSearch = (s.nama && s.nama.toLowerCase().includes(keyword)) || (s.nis && s.nis.toLowerCase().includes(keyword));
            let matchKelas = (kelasId === 'semua' || s.kelas_id == kelasId);
            return matchSearch && matchKelas;
        });
        renderTable(filtered);
    }
    if(document.getElementById('searchSantri')) document.getElementById('searchSantri').addEventListener('input', filterDataUtama);
    if(filterKelasTable) filterKelasTable.addEventListener('change', filterDataUtama);

    const searchDapodik = document.getElementById('searchDapodik');
    if (searchDapodik) {
        searchDapodik.addEventListener('input', (e) => {
            let keyword = e.target.value.toLowerCase();
            let filtered = daftarDapodikTersedia.filter(s => s.nama.toLowerCase().includes(keyword) || s.nis.toLowerCase().includes(keyword));
            renderDapodikList(filtered);
        });
    }

    // ==========================================
    // 4. MODAL & LOGIKA BUAT KELAS BARU (Dengan Jadwal)
    // ==========================================
    const kelasModal = document.getElementById('kelasModal');
    const btnBuatKelas = document.getElementById('btnBuatKelas');
    const closeKelasModal = document.getElementById('closeKelasModal');

    if(btnBuatKelas) {
        btnBuatKelas.onclick = () => { 
            kelasModal.style.display = "block"; 
            document.getElementById('inputNamaKelas').value = ''; 
            document.getElementById('inputHariKelas').value = ''; 
            document.getElementById('inputJamMulai').value = ''; 
            document.getElementById('inputJamSelesai').value = ''; 
        };
    }
    if(closeKelasModal) closeKelasModal.onclick = () => kelasModal.style.display = "none";

    const btnSimpanKelas = document.getElementById('btnSimpanKelas');
    if(btnSimpanKelas) {
        btnSimpanKelas.onclick = async () => {
            const namaKelas = document.getElementById('inputNamaKelas').value;
            const hariKelas = document.getElementById('inputHariKelas').value;
            const jamMulai = document.getElementById('inputJamMulai').value;
            const jamSelesai = document.getElementById('inputJamSelesai').value;
            
            if(!namaKelas) { alert("Nama kelas tidak boleh kosong!"); return; }

            let originalText = btnSimpanKelas.innerHTML;
            btnSimpanKelas.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
            btnSimpanKelas.disabled = true;

            try {
                // LOGIKA ASLI SUPABASE (Hapus tanda '//' jika sudah siap)
                /*
                const { error } = await supabase.from('kelas').insert([
                    { 
                        nama_kelas: namaKelas, 
                        jadwal_hari: hariKelas, 
                        jam_mulai: jamMulai, 
                        jam_selesai: jamSelesai,
                        ustadz_id: currentUstadzId 
                    }
                ]);
                if (error) throw error;
                */

                // SIMULASI BERHASIL
                setTimeout(() => {
                    alert(`Alhamdulillah, Kelas "${namaKelas}" berhasil dibuat!`);
                    kelasModal.style.display = "none";
                    
                    const idBaru = Date.now();
                    daftarKelasBinaan.push({ 
                        id: idBaru, 
                        nama_kelas: namaKelas,
                        jadwal_hari: hariKelas,
                        jam_mulai: jamMulai,
                        jam_selesai: jamSelesai
                    });
                    
                    let optsFilter = '<option value="semua">Semua Kelas Binaan</option>';
                    let optsTarget = '';
                    daftarKelasBinaan.forEach(k => {
                        let infoJadwal = k.jadwal_hari ? ` (${k.jadwal_hari})` : '';
                        optsFilter += `<option value="${k.id}">${k.nama_kelas}</option>`;
                        optsTarget += `<option value="${k.id}">${k.nama_kelas}${infoJadwal}</option>`;
                    });
                    
                    if(filterKelasTable) filterKelasTable.innerHTML = optsFilter;
                    if(selectKelasTarget) selectKelasTarget.innerHTML = optsTarget;

                    btnSimpanKelas.innerHTML = originalText;
                    btnSimpanKelas.disabled = false;
                }, 800);

            } catch (error) {
                console.error("Gagal membuat kelas:", error.message);
                alert("Gagal membuat kelas: " + error.message);
                btnSimpanKelas.innerHTML = originalText;
                btnSimpanKelas.disabled = false;
            }
        };
    }

    // ==========================================
    // 5. MODAL & LOGIKA TARIK SANTRI (DAPODIK)
    // ==========================================
    const santriModal = document.getElementById('santriModal');
    const btnTarikSantri = document.getElementById('btnTarikSantri');
    const closeSantriModal = document.getElementById('closeSantriModal');

    if(btnTarikSantri) {
        btnTarikSantri.onclick = () => {
            if(daftarKelasBinaan.length === 0) {
                alert("Harap buat kelas terlebih dahulu sebelum menarik santri!");
                return;
            }
            santriModal.style.display = "block";
            fetchDapodikTersedia(); 
        };
    }
    if(closeSantriModal) closeSantriModal.onclick = () => santriModal.style.display = "none";
    
    window.onclick = (e) => { 
        if (e.target == kelasModal) kelasModal.style.display = "none";
        if (e.target == santriModal) santriModal.style.display = "none";
    };

    const btnSimpanTarikSantri = document.getElementById('btnSimpanTarikSantri');
    if (btnSimpanTarikSantri) {
        btnSimpanTarikSantri.onclick = async () => {
            const targetKelasId = document.getElementById('selectKelasTarget').value;
            const checkedBoxes = document.querySelectorAll('.dapodik-checkbox:checked');
            const nisTerpilih = Array.from(checkedBoxes).map(cb => cb.value);

            if (nisTerpilih.length === 0) { alert("Centang minimal satu santri!"); return; }
            if (!targetKelasId) { alert("Pilih kelas target!"); return; }

            let originalText = btnSimpanTarikSantri.innerHTML;
            btnSimpanTarikSantri.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
            btnSimpanTarikSantri.disabled = true;

            setTimeout(() => {
                alert(`Alhamdulillah, ${nisTerpilih.length} santri berhasil ditarik ke kelas Anda!`);
                santriModal.style.display = "none";
                btnSimpanTarikSantri.innerHTML = originalText;
                btnSimpanTarikSantri.disabled = false;
            }, 800);
        };
    }

    // ==========================================
    // 6. FUNGSI KELUARKAN SANTRI
    // ==========================================
    window.keluarkanSantri = async (nis) => {
        if (confirm("Yakin ingin mengeluarkan santri ini dari kelas? (Santri akan kembali ke daftar Dapodik utama)")) {
            alert("Santri berhasil dikembalikan ke Dapodik.");
        }
    };

});
