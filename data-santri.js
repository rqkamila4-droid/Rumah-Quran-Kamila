document.addEventListener("DOMContentLoaded", () => {
    
    // === KONFIGURASI SUPABASE ===
    // Perbaikan: URL diakhiri dengan .co saja, tanpa /rest/v1/
    const SUPABASE_URL = 'https://iofgzryyarqaxihemlez.supabase.co'; 
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZmd6cnl5YXJxYXhpaGVtbGV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzOTcwNzgsImV4cCI6MjA4NDk3MzA3OH0.RrkJCQaQ8KjV1SjhAGZXqXgGvqtIVdiIU20UUm5dEYs'; 
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    function toggleSidebar() { 
        sidebar.classList.toggle('show'); 
        overlay.classList.toggle('show'); 
    }
    if(menuToggle) menuToggle.addEventListener('click', toggleSidebar);
    if(closeSidebar) closeSidebar.addEventListener('click', toggleSidebar);
    if(overlay) overlay.addEventListener('click', toggleSidebar);

    // Variabel Global
    let daftarSantri = [];
    let daftarKelas = [];
    const tableBody = document.getElementById('santriTableBody');
    const inputKelas = document.getElementById('inputKelas');
    const filterKelasTable = document.getElementById('filterKelasTable');

    // 1. FUNGSI AMBIL DATA KELAS
    async function fetchKelas() {
        try {
            const { data, error } = await supabase.from('kelas').select('*');
            if (error) throw error;
            
            daftarKelas = data;
            
            let optsForm = '<option value="">Pilih Kelas...</option>';
            let optsFilter = '<option value="semua">Semua Kelas</option>';
            
            data.forEach(k => {
                optsForm += `<option value="${k.id}">${k.nama_kelas}</option>`;
                optsFilter += `<option value="${k.id}">${k.nama_kelas}</option>`;
            });
            
            if(inputKelas) inputKelas.innerHTML = optsForm;
            if(filterKelasTable) filterKelasTable.innerHTML = optsFilter;
        } catch (error) {
            console.error("Gagal memuat kelas:", error.message);
        }
    }

    // 2. FUNGSI AMBIL DATA SANTRI
    async function fetchSantri() {
        try {
            if(tableBody) tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Menarik data...</td></tr>';
            
            const { data, error } = await supabase.from('santri').select('*').order('nama', { ascending: true });
            if (error) throw error;
            
            daftarSantri = data;
            renderTable(daftarSantri);
        } catch (error) {
            console.error("Gagal memuat santri:", error.message);
            if(tableBody) tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">Gagal menarik data. ${error.message}</td></tr>`;
        }
    }

    // Fungsi Render Tabel
    function renderTable(dataToRender) {
        if(!tableBody) return;
        tableBody.innerHTML = '';
        
        if(dataToRender.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Belum ada data santri.</td></tr>';
            return;
        }

        dataToRender.forEach((s) => {
            let namaKelas = "Tidak diketahui";
            // Pastikan ID dibandingkan dengan tipe data yang sama (angka)
            let kelasObj = daftarKelas.find(k => k.id == s.kelas_id);
            if(kelasObj) namaKelas = kelasObj.nama_kelas;

            let row = `
                <tr>
                    <td>${s.nis}</td>
                    <td><strong>${s.nama}</strong></td>
                    <td><span class="class-badge">${namaKelas}</span></td>
                    <td>${s.gender || '-'}</td>
                    <td style="text-align: center;">
                        <button class="btn-edit" onclick="editSantri('${s.nis}')"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" onclick="deleteSantri('${s.nis}')"><i class="fas fa-trash-alt"></i></button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    // Jalankan pengambilan data
    fetchKelas().then(() => fetchSantri());

    // 3. PENCARIAN & FILTER
    function filterData() {
        let keyword = document.getElementById('searchSantri').value.toLowerCase();
        let kelasId = filterKelasTable.value;

        let filtered = daftarSantri.filter(s => {
            let matchSearch = (s.nama && s.nama.toLowerCase().includes(keyword)) || (s.nis && s.nis.toLowerCase().includes(keyword));
            let matchKelas = (kelasId === 'semua' || s.kelas_id == kelasId);
            return matchSearch && matchKelas;
        });

        renderTable(filtered);
    }
    
    if(document.getElementById('searchSantri')) {
        document.getElementById('searchSantri').addEventListener('input', filterData);
    }
    if(filterKelasTable) {
        filterKelasTable.addEventListener('change', filterData);
    }

    // 4. MODAL TAMBAH/EDIT
    const modal = document.getElementById('santriModal');
    const santriForm = document.getElementById('santriForm');

    const btnTambah = document.getElementById('btnTambahSantri');
    if(btnTambah) {
        btnTambah.onclick = () => {
            modal.style.display = "block";
            document.getElementById('modalTitle').textContent = "Tambah Santri Baru";
            document.getElementById('formMode').value = "add";
            document.getElementById('inputNis').readOnly = false;
            santriForm.reset();
        };
    }

    const closeBtn = document.getElementById('closeSantriModal');
    if(closeBtn) {
        closeBtn.onclick = () => modal.style.display = "none";
    }
    
    window.onclick = (e) => { 
        if (e.target == modal) modal.style.display = "none"; 
    };

    // 5. SIMPAN KE SUPABASE
    if(santriForm) {
        santriForm.onsubmit = async (e) => {
            e.preventDefault();
            const mode = document.getElementById('formMode').value;
            const nis = document.getElementById('inputNis').value;
            const nama = document.getElementById('inputNama').value;
            const kelas_id = document.getElementById('inputKelas').value;
            const gender = document.getElementById('inputGender').value;
            const no_hp = document.getElementById('inputNoHp').value;

            const btnSubmit = document.getElementById('btnSubmitForm');
            let originalText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
            btnSubmit.disabled = true;

            try {
                if (mode === "add") {
                    const { error } = await supabase.from('santri').insert([
                        { nis: nis, nama: nama, kelas_id: kelas_id, gender: gender, no_hp: no_hp, status: 'Aktif' }
                    ]);
                    if (error) throw error;
                } else {
                    const { error } = await supabase.from('santri').update({
                        nama: nama, kelas_id: kelas_id, gender: gender, no_hp: no_hp
                    }).eq('nis', nis);
                    if (error) throw error;
                }

                alert("Alhamdulillah, data berhasil disimpan!");
                modal.style.display = "none";
                fetchSantri();
            } catch (err) {
                console.error(err);
                alert("Gagal: " + err.message);
            } finally {
                btnSubmit.innerHTML = originalText;
                btnSubmit.disabled = false;
            }
        };
    }

    // 6. EDIT & DELETE (Global)
    window.editSantri = (nis) => {
        let s = daftarSantri.find(item => item.nis == nis);
        if(!s) return;

        document.getElementById('formMode').value = "edit";
        document.getElementById('inputNis').value = s.nis;
        document.getElementById('inputNis').readOnly = true;
        document.getElementById('inputNama').value = s.nama;
        document.getElementById('inputKelas').value = s.kelas_id;
        document.getElementById('inputGender').value = s.gender;
        document.getElementById('inputNoHp').value = s.no_hp || '';
        
        document.getElementById('modalTitle').textContent = "Edit Data Santri";
        modal.style.display = "block";
    };

    window.deleteSantri = async (nis) => {
        if (confirm("Apakah Anda yakin ingin menghapus santri ini?")) {
            try {
                const { error } = await supabase.from('santri').delete().eq('nis', nis);
                if (error) throw error;
                alert("Data berhasil dihapus.");
                fetchSantri();
            } catch (error) {
                alert("Gagal menghapus: " + error.message);
            }
        }
    };
});
