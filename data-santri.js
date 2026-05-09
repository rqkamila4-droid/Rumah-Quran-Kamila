document.addEventListener("DOMContentLoaded", async () => {
    
    // === KONFIGURASI SUPABASE BARU ===
    const SUPABASE_URL = 'https://ucsfssukcrkmguhizbbj.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjc2Zzc3VrY3JrbWd1aGl6YmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMjkxOTksImV4cCI6MjA5MzkwNTE5OX0.2rSwfgAhzyeSb_ru-6K9hDKSMtFbSK1vgiBpopqM9NY';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // ==========================================
    // SIMULASI LOGIN USTADZ (KARENA HALAMAN LOGIN ASLI BELUM AKTIF)
    // ==========================================
    // Nanti, ID ini akan didapat otomatis dari supabase.auth saat ustadz berhasil login.
    // Karena saat ini database baru Anda KOSONG (belum ada tabel atau user), ini berguna untuk "membypass" agar halaman tidak error.
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

    // Variabel Global
    let daftarSantriBinaan = [];
    let daftarKelasBinaan = [];
    let daftarDapodikTersedia = []; // Santri yang belum punya kelas_id
    
    const tableBody = document.getElementById('santriTableBody');
    const filterKelasTable = document.getElementById('filterKelasTable');
    const selectKelasTarget = document.getElementById('selectKelasTarget');
    const dapodikListContainer = document.getElementById('dapodikListContainer');

    // 1. FUNGSI AMBIL KELAS (HANYA MILIK USTADZ YANG LOGIN)
    async function fetchKelasBinaan() {
        try {
            // Logika Asli (jika sudah ada data di database):
            // const { data, error } = await supabase.from('kelas').select('*').eq('ustadz_id', currentUstadzId);
            
            // SIMULASI SEMENTARA KARENA DATABASE BARU BELUM DIISI (Agar tabel tidak kosong/error)
            const data = [
                { id: 1, nama_kelas: "Said Bin Zaid (Simulasi)" },
                { id: 2, nama_kelas: "Umar Bin Khattab (Simulasi)" }
            ];
            
            daftarKelasBinaan = data;
            
            let optsFilter = '<option value="semua">Semua Kelas Binaan</option>';
            let optsTarget = '';
            
            data.forEach(k => {
                optsFilter += `<option value="${k.id}">${k.nama_kelas}</option>`;
                optsTarget += `<option value="${k.id}">${k.nama_kelas}</option>`;
            });
            
            if(filterKelasTable) filterKelasTable.innerHTML = optsFilter;
            if(selectKelasTarget) selectKelasTarget.innerHTML = optsTarget;
        } catch (error) {
            console.error("Gagal memuat kelas binaan:", error.message);
        }
    }

    // 2. FUNGSI AMBIL SANTRI BINAAN (YANG KELASNYA MILIK USTADZ INI)
    async function fetchSantriBinaan() {
        try {
            if(tableBody) tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Menarik data binaan Anda...</td></tr>';
            
            if (daftarKelasBinaan.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Anda belum memiliki kelas binaan.</td></tr>';
                return;
            }

            const idsKelas = daftarKelasBinaan.map(k => k.id);

            // Logika Asli:
            // const { data, error } = await supabase.from('santri').select('*').in('kelas_id', idsKelas).order('nama', { ascending: true });
            
            // SIMULASI SEMENTARA:
            const data = [
                { nis: "202601", nama: "Ahmad Hanif (Simulasi)", kelas_id: 1, gender: "L" },
                { nis: "202602", nama: "Budi Santoso (Simulasi)", kelas_id: 2, gender: "L" }
            ];
            
            daftarSantriBinaan = data;
            renderTable(daftarSantriBinaan);
        } catch (error) {
            console.error("Gagal memuat santri binaan:", error.message);
            if(tableBody) tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">Gagal: ${error.message}</td></tr>`;
        }
    }

    // 3. FUNGSI AMBIL SANTRI DAPODIK (BELUM PUNYA KELAS)
    async function fetchDapodikTersedia() {
        try {
            dapodikListContainer.innerHTML = '<div style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Memuat data...</div>';
            
            // Logika Asli: Mencari santri yang kelas_id nya masih kosong (null)
            // const { data, error } = await supabase.from('santri').select('nis, nama, gender').is('kelas_id', null).order('nama', { ascending: true });
            
            // SIMULASI SEMENTARA:
            const data = [
                { nis: "202690", nama: "Santri Baru A", gender: "L" },
                { nis: "202691", nama: "Santri Baru B", gender: "P" },
                { nis: "202692", nama: "Santri Baru C", gender: "L" }
            ];
            
            daftarDapodikTersedia = data;
            renderDapodikList(daftarDapodikTersedia);
        } catch (error) {
            console.error("Gagal memuat data Dapodik:", error.message);
            dapodikListContainer.innerHTML = `<div style="color:red; text-align:center;">Gagal memuat data Dapodik.</div>`;
        }
    }

    // Fungsi Render Tabel Binaan Utama
    function renderTable(dataToRender) {
        if(!tableBody) return;
        tableBody.innerHTML = '';
        
        if(dataToRender.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Belum ada santri di kelas Anda. Klik "Tarik Santri Baru".</td></tr>';
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

    // Fungsi Render Daftar Checkbox Dapodik
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

    // Jalankan Inisialisasi
    await fetchKelasBinaan();
    fetchSantriBinaan();

    // FILTER TABEL UTAMA
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

    // PENCARIAN DI MODAL DAPODIK
    const searchDapodik = document.getElementById('searchDapodik');
    if (searchDapodik) {
        searchDapodik.addEventListener('input', (e) => {
            let keyword = e.target.value.toLowerCase();
            let filtered = daftarDapodikTersedia.filter(s => 
                s.nama.toLowerCase().includes(keyword) || s.nis.toLowerCase().includes(keyword)
            );
            renderDapodikList(filtered);
        });
    }

    // MODAL TARIK SANTRI
    const modal = document.getElementById('santriModal');
    const btnTarikSantri = document.getElementById('btnTarikSantri');
    const closeBtn = document.getElementById('closeSantriModal');

    if(btnTarikSantri) {
        btnTarikSantri.onclick = () => {
            modal.style.display = "block";
            fetchDapodikTersedia(); // Tarik data Dapodik terbaru saat modal dibuka
        };
    }
    if(closeBtn) closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

    // PROSES PENYIMPANAN SANTRI DARI DAPODIK KE KELAS (UPDATE KELAS_ID)
    const btnSimpanTarikSantri = document.getElementById('btnSimpanTarikSantri');
    if (btnSimpanTarikSantri) {
        btnSimpanTarikSantri.onclick = async () => {
            const targetKelasId = document.getElementById('selectKelasTarget').value;
            
            // Ambil NIS mana saja yang dicentang
            const checkedBoxes = document.querySelectorAll('.dapodik-checkbox:checked');
            const nisTerpilih = Array.from(checkedBoxes).map(cb => cb.value);

            if (nisTerpilih.length === 0) {
                alert("Pilih minimal satu santri untuk ditarik.");
                return;
            }

            if (!targetKelasId) {
                alert("Anda tidak memiliki kelas target.");
                return;
            }

            let originalText = btnSimpanTarikSantri.innerHTML;
            btnSimpanTarikSantri.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
            btnSimpanTarikSantri.disabled = true;

            try {
                // Logika Asli (Update massal kelas_id pada santri yang dipilih)
                /* const { error } = await supabase
                    .from('santri')
                    .update({ kelas_id: parseInt(targetKelasId) })
                    .in('nis', nisTerpilih);
                
                if (error) throw error;
                */

                // Simulasi Sukses:
                setTimeout(() => {
                    alert(`Alhamdulillah, ${nisTerpilih.length} santri berhasil dimasukkan ke kelas binaan Anda!`);
                    modal.style.display = "none";
                    
                    // Render ulang data (Dalam kondisi real, panggil fetchSantriBinaan())
                    btnSimpanTarikSantri.innerHTML = originalText;
                    btnSimpanTarikSantri.disabled = false;
                }, 800);

            } catch (error) {
                console.error("Gagal menarik santri:", error.message);
                alert("Gagal menarik santri. Periksa koneksi.");
                btnSimpanTarikSantri.innerHTML = originalText;
                btnSimpanTarikSantri.disabled = false;
            }
        };
    }

    // FUNGSI MENGELUARKAN SANTRI DARI KELAS (Bukan hapus data, cuma set kelas_id jadi null)
    window.keluarkanSantri = async (nis) => {
        if (confirm("Keluarkan santri ini dari kelas Anda? Data santri tidak akan terhapus dari Dapodik utama.")) {
            try {
                // Logika Asli:
                // const { error } = await supabase.from('santri').update({ kelas_id: null }).eq('nis', nis);
                // if (error) throw error;

                alert("Santri dikembalikan ke daftar Dapodik (Tanpa Kelas).");
                fetchSantriBinaan(); // Refresh tabel
            } catch (error) {
                alert("Gagal mengeluarkan santri: " + error.message);
            }
        }
    };

});
