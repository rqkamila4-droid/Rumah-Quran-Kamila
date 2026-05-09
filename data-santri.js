document.addEventListener("DOMContentLoaded", () => {
    
    // === KONFIGURASI SUPABASE ===
    const SUPABASE_URL = 'https://iofgzryyarqaxihemlez.supabase.co'; // Ganti dengan URL Anda
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZmd6cnl5YXJxYXhpaGVtbGV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzOTcwNzgsImV4cCI6MjA4NDk3MzA3OH0.RrkJCQaQ8KjV1SjhAGZXqXgGvqtIVdiIU20UUm5dEYs'; // Ganti dengan Anon Key Anda
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    function toggleSidebar() { sidebar.classList.toggle('show'); overlay.classList.toggle('show'); }
    menuToggle.addEventListener('click', toggleSidebar);
    closeSidebar.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);

    // Variabel Global
    let daftarSantri = [];
    let daftarKelas = [];
    const tableBody = document.getElementById('santriTableBody');
    const inputKelas = document.getElementById('inputKelas');
    const filterKelasTable = document.getElementById('filterKelasTable');

    // 1. FUNGSI AMBIL DATA KELAS (Dari Tabel Kelas)
    async function fetchKelas() {
        try {
            const { data, error } = await supabase.from('kelas').select('*');
            if (error) throw error;
            
            daftarKelas = data;
            
            // Masukkan ke dropdown Form dan Filter
            let optsForm = '<option value="">Pilih Kelas...</option>';
            let optsFilter = '<option value="semua">Semua Kelas</option>';
            
            data.forEach(k => {
                // Asumsi ID kelas berupa angka, dan namanya di nama_kelas
                optsForm += `<option value="${k.id}">${k.nama_kelas}</option>`;
                optsFilter += `<option value="${k.id}">${k.nama_kelas}</option>`;
            });
            
            inputKelas.innerHTML = optsForm;
            filterKelasTable.innerHTML = optsFilter;
        } catch (error) {
            console.error("Gagal memuat kelas:", error);
        }
    }

    // 2. FUNGSI AMBIL DATA SANTRI (Dari Tabel Santri)
    async function fetchSantri() {
        try {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Menarik data...</td></tr>';
            
            const { data, error } = await supabase.from('santri').select('*').order('nama', { ascending: true });
            if (error) throw error;
            
            daftarSantri = data;
            renderTable(daftarSantri);
        } catch (error) {
            console.error("Gagal memuat santri:", error);
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">Gagal menarik data. Periksa koneksi/kunci Supabase.</td></tr>`;
        }
    }

    // Fungsi Render Tabel
    function renderTable(dataToRender) {
        tableBody.innerHTML = '';
        if(dataToRender.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Belum ada data santri.</td></tr>';
            return;
        }

        dataToRender.forEach((s) => {
            // Cocokkan kelas_id dengan nama_kelas dari tabel kelas
            let namaKelas = "Tidak diketahui";
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

    // Panggil fungsi ambil data saat halaman dimuat
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
    document.getElementById('searchSantri').addEventListener('input', filterData);
    filterKelasTable.addEventListener('change', filterData);

    // 4. MODAL TAMBAH/EDIT
    const modal = document.getElementById('santriModal');
    const santriForm = document.getElementById('santriForm');

    document.getElementById('btnTambahSantri').onclick = () => {
        modal.style.display = "block";
        document.getElementById('modalTitle').textContent = "Tambah Santri Baru";
        document.getElementById('formMode').value = "add";
        document.getElementById('inputNis').readOnly = false; // NIS bisa diketik
        santriForm.reset();
    };

    document.getElementById('closeSantriModal').onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

    // 5. SIMPAN KE SUPABASE (INSERT / UPDATE)
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
            let errorObj = null;

            if (mode === "add") {
                // Insert Data Baru
                const { error } = await supabase.from('santri').insert([
                    { nis: nis, nama: nama, kelas_id: kelas_id, gender: gender, no_hp: no_hp, status: 'Aktif' }
                ]);
                errorObj = error;
            } else {
                // Update Data Lama berdasarkan NIS
                const { error } = await supabase.from('santri').update({
                    nama: nama, kelas_id: kelas_id, gender: gender, no_hp: no_hp
                }).eq('nis', nis);
                errorObj = error;
            }

            if (errorObj) throw errorObj;

            alert("Alhamdulillah, data berhasil disimpan di Supabase!");
            modal.style.display = "none";
            fetchSantri(); // Refresh tabel

        } catch (err) {
            console.error(err);
            alert("Gagal menyimpan data: " + (err.message || "Pastikan NIS belum dipakai sebelumnya."));
        } finally {
            btnSubmit.innerHTML = originalText;
            btnSubmit.disabled = false;
        }
    };

    // 6. EDIT & DELETE (Diekspos ke HTML)
    window.editSantri = (nis) => {
        let s = daftarSantri.find(item => item.nis == nis);
        if(!s) return;

        document.getElementById('formMode').value = "edit";
        document.getElementById('inputNis').value = s.nis;
        document.getElementById('inputNis').readOnly = true; // NIS gak boleh diubah saat edit
        document.getElementById('inputNama').value = s.nama;
        document.getElementById('inputKelas').value = s.kelas_id;
        document.getElementById('inputGender').value = s.gender;
        document.getElementById('inputNoHp').value = s.no_hp || '';
        
        document.getElementById('modalTitle').textContent = "Edit Data Santri";
        modal.style.display = "block";
    };

    window.deleteSantri = async (nis) => {
        if (confirm("Apakah Anda yakin ingin menghapus santri ini dari database?")) {
            try {
                const { error } = await supabase.from('santri').delete().eq('nis', nis);
                if (error) throw error;
                
                alert("Data berhasil dihapus.");
                fetchSantri(); // Refresh tabel
            } catch (error) {
                alert("Gagal menghapus data: " + error.message);
            }
        }
    };

});
