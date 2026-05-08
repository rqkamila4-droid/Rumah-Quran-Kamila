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

    // 2. Data Santri (Simulasi Database Lokal)
    let daftarSantri = [
        { id: 1, nama: "Ahmad Hanif", kelas: "Said Bin Zaid" },
        { id: 2, nama: "Budi Santoso", kelas: "Said Bin Zaid" },
        { id: 3, nama: "Faisal Rahman", kelas: "Umar Bin Khattab" },
        { id: 4, nama: "Jihan Fahira", kelas: "Utsman Bin Affan" }
    ];

    const tableBody = document.getElementById('santriTableBody');
    const searchInput = document.getElementById('searchSantri');
    const filterKelas = document.getElementById('filterKelasTable');

    // 3. Fungsi Render Tabel
    function renderTable(data = daftarSantri) {
        tableBody.innerHTML = '';
        data.forEach((s, index) => {
            let row = `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${s.nama}</strong></td>
                    <td><span class="class-badge">${s.kelas}</span></td>
                    <td style="text-align: center;">
                        <button class="btn-edit" onclick="editSantri(${s.id})"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" onclick="deleteSantri(${s.id})"><i class="fas fa-trash-alt"></i></button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    renderTable();

    // 4. Fitur Pencarian & Filter
    function filterData() {
        let keyword = searchInput.value.toLowerCase();
        let kelas = filterKelas.value;

        let filtered = daftarSantri.filter(s => {
            let matchSearch = s.nama.toLowerCase().includes(keyword);
            let matchKelas = (kelas === 'semua' || s.kelas === kelas);
            return matchSearch && matchKelas;
        });

        renderTable(filtered);
    }

    searchInput.addEventListener('input', filterData);
    filterKelas.addEventListener('change', filterData);

    // 5. Modal Tambah/Edit
    const modal = document.getElementById('santriModal');
    const btnTambah = document.getElementById('btnTambahSantri');
    const closeModal = document.getElementById('closeSantriModal');
    const santriForm = document.getElementById('santriForm');

    btnTambah.onclick = () => {
        modal.style.display = "block";
        document.getElementById('modalTitle').textContent = "Tambah Santri Baru";
        santriForm.reset();
        document.getElementById('santriId').value = "";
    };

    closeModal.onclick = () => { modal.style.display = "none"; };
    window.onclick = (e) => { if (event.target == modal) modal.style.display = "none"; };

    // 6. Simpan Data (Tambah/Edit)
    santriForm.onsubmit = (e) => {
        e.preventDefault();
        let id = document.getElementById('santriId').value;
        let nama = document.getElementById('inputNama').value;
        let kelas = document.getElementById('inputKelas').value;

        if (id) {
            // Logika Edit
            let index = daftarSantri.findIndex(s => s.id == id);
            daftarSantri[index].nama = nama;
            daftarSantri[index].kelas = kelas;
        } else {
            // Logika Tambah
            daftarSantri.push({ id: Date.now(), nama: nama, kelas: kelas });
        }

        renderTable();
        modal.style.display = "none";
        alert("Alhamdulillah, data berhasil diperbarui.");
    };

    // 7. Fungsi Edit & Delete (Diekspos ke window)
    window.editSantri = (id) => {
        let s = daftarSantri.find(item => item.id == id);
        document.getElementById('santriId').value = s.id;
        document.getElementById('inputNama').value = s.nama;
        document.getElementById('inputKelas').value = s.kelas;
        
        document.getElementById('modalTitle').textContent = "Edit Data Santri";
        modal.style.display = "block";
    };

    window.deleteSantri = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus data santri ini?")) {
            daftarSantri = daftarSantri.filter(s => s.id != id);
            renderTable();
        }
    };

});
