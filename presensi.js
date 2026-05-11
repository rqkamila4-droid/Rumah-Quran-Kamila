document.addEventListener("DOMContentLoaded", async () => {
    
    // Konfigurasi Supabase
    const SUPABASE_URL = 'https://ucsfssukcrkmguhizbbj.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjc2Zzc3VrY3JrbWd1aGl6YmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMjkxOTksImV4cCI6MjA5MzkwNTE5OX0.2rSwfgAhzyeSb_ru-6K9hDKSMtFbSK1vgiBpopqM9NY';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const overlay = document.getElementById('sidebarOverlay');
    if(menuToggle) menuToggle.onclick = () => { sidebar.classList.toggle('show'); overlay.classList.toggle('show'); };

    // Set Tanggal Hari Ini Otomatis
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('filterTanggal').value = today;
    document.getElementById('inputTglLibur').value = today;

    // Data Simulasi
    let daftarKelasBinaan = [
        { id: 1, nama_kelas: "Abu Bakr" },
        { id: 2, nama_kelas: "Umar Bin Khattab" }
    ];
    let daftarSantri = [
        { nis: "202601", nama: "Ahmad Hanif", kelas_id: 1 },
        { nis: "202602", nama: "Fatimah", kelas_id: 1 },
        { nis: "202603", nama: "Dika", kelas_id: 2 }
    ];
    
    // JANTUNG FITUR: Penyimpan Status Libur
    // Format: { tanggal: '2026-05-10', kelas_id: 'semua' / 1, alasan: 'Sakit' }
    let dataLibur = []; 

    // Elemen DOM
    const filterKelas = document.getElementById('filterKelas');
    const filterTanggal = document.getElementById('filterTanggal');
    const areaFormJurnal = document.getElementById('areaFormJurnal');
    const pesanAwal = document.getElementById('pesanAwal');
    const pesanLibur = document.getElementById('pesanLibur');
    const formInputTable = document.getElementById('formInputTable');
    const tbodySantriAbsen = document.getElementById('tbodySantriAbsen');

    // 1. INISIALISASI TAMPILAN AWAL
    function initApp() {
        let opts = '<option value="">-- Pilih Kelas Anda --</option>';
        let chkOpts = '';
        daftarKelasBinaan.forEach(k => {
            opts += `<option value="${k.id}">${k.nama_kelas}</option>`;
            chkOpts += `<label style="display:block; margin-bottom:5px; font-size:0.85rem;"><input type="checkbox" class="chk-kelas-libur" value="${k.id}"> ${k.nama_kelas}</label>`;
        });
        filterKelas.innerHTML = opts;
        document.getElementById('containerPilihKelas').innerHTML = chkOpts;
    }
    initApp();

    // ==========================================
    // 2. LOGIKA MODAL ATUR LIBUR
    // ==========================================
    const modalLibur = document.getElementById('modalLibur');
    document.getElementById('btnBukaModalLibur').onclick = () => modalLibur.style.display = 'block';
    document.getElementById('closeModalLibur').onclick = () => modalLibur.style.display = 'none';

    // Toggle tampilan list checkbox kelas
    const radioLiburSemua = document.getElementById('libur_semua');
    const radioLiburSebagian = document.getElementById('libur_sebagian');
    const containerPilihKelas = document.getElementById('containerPilihKelas');

    radioLiburSemua.onchange = () => containerPilihKelas.style.display = 'none';
    radioLiburSebagian.onchange = () => containerPilihKelas.style.display = 'block';

    // Proses Simpan Libur
    document.getElementById('btnSimpanLibur').onclick = () => {
        const tgl = document.getElementById('inputTglLibur').value;
        const alasan = document.getElementById('selectAlasanLibur').value;
        const isSemua = radioLiburSemua.checked;

        if (isSemua) {
            dataLibur.push({ tanggal: tgl, kelas_id: 'semua', alasan: alasan });
        } else {
            const checkedKelas = document.querySelectorAll('.chk-kelas-libur:checked');
            if(checkedKelas.length === 0) { alert("Pilih minimal 1 kelas yang libur!"); return; }
            
            checkedKelas.forEach(cb => {
                dataLibur.push({ tanggal: tgl, kelas_id: parseInt(cb.value), alasan: alasan });
            });
        }

        alert(`Alhamdulillah, status libur tanggal ${tgl} berhasil disimpan.`);
        modalLibur.style.display = 'none';
        
        // Refresh form jika tanggal yang sedang dibuka sama dengan yang diliburkan
        if(filterTanggal.value === tgl) {
            renderFormInput();
        }
    };

    // ==========================================
    // 3. LOGIKA RENDER FORM INPUT HARIAN
    // ==========================================
    function renderFormInput() {
        const tglDipilih = filterTanggal.value;
        const idKelasDipilih = filterKelas.value;

        if (!idKelasDipilih || !tglDipilih) {
            pesanAwal.style.display = 'block';
            pesanLibur.style.display = 'none';
            formInputTable.style.display = 'none';
            return;
        }

        // CEK APAKAH KELAS INI LIBUR DI TANGGAL TERSEBUT?
        const isLibur = dataLibur.find(d => 
            d.tanggal === tglDipilih && 
            (d.kelas_id === 'semua' || d.kelas_id === parseInt(idKelasDipilih))
        );

        pesanAwal.style.display = 'none';

        if (isLibur) {
            // JIKA LIBUR: Sembunyikan tabel, munculkan banner
            pesanLibur.innerHTML = `
                <div class="libur-banner">
                    <i class="fas fa-info-circle fa-2x" style="margin-bottom:10px;"></i><br>
                    Kelas diliburkan pada tanggal ini.<br>
                    Alasan: <strong>${isLibur.alasan}</strong><br>
                    <span style="font-size:0.75rem; font-weight:normal; color:#555;">(Sistem tidak akan menghitung hari ini sebagai target kehadiran)</span>
                </div>
                <div style="text-align:center;">
                    <button onclick="batalLibur('${tglDipilih}', ${idKelasDipilih})" style="padding: 8px 15px; background: white; border: 1px solid #ddd; border-radius: 5px; cursor: pointer; font-size:0.8rem;">
                        <i class="fas fa-undo"></i> Buka Kembali Kelas Ini
                    </button>
                </div>
            `;
            pesanLibur.style.display = 'block';
            formInputTable.style.display = 'none';
        } else {
            // JIKA AKTIF: Munculkan tabel form
            pesanLibur.style.display = 'none';
            formInputTable.style.display = 'block';

            // Tarik anak-anak di kelas tersebut
            const muridDiKelas = daftarSantri.filter(s => s.kelas_id == idKelasDipilih);
            tbodySantriAbsen.innerHTML = '';
            
            if(muridDiKelas.length === 0) {
                tbodySantriAbsen.innerHTML = '<tr><td colspan="6">Belum ada santri di kelas ini.</td></tr>';
                return;
            }

            muridDiKelas.forEach(s => {
                let row = `
                    <tr>
                        <td style="font-weight:600;">${s.nama} <br><span style="font-size:0.7rem; color:#999; font-weight:normal;">NIS: ${s.nis}</span></td>
                        <td>
                            <div class="radio-absen">
                                <input type="radio" name="absen_${s.nis}" id="h_${s.nis}" value="H" checked><label for="h_${s.nis}">H</label>
                                <input type="radio" name="absen_${s.nis}" id="i_${s.nis}" value="I"><label for="i_${s.nis}">I</label>
                                <input type="radio" name="absen_${s.nis}" id="s_${s.nis}" value="S"><label for="s_${s.nis}">S</label>
                                <input type="radio" name="absen_${s.nis}" id="a_${s.nis}" value="A"><label for="a_${s.nis}">A</label>
                            </div>
                        </td>
                        <td><input type="text" class="input-text" placeholder="Srt"></td>
                        <td><input type="text" class="input-mini" placeholder="Ayt"></td>
                        <td><input type="text" class="input-text" placeholder="Jilid"></td>
                        <td><input type="text" class="input-mini" placeholder="Hal"></td>
                    </tr>
                `;
                tbodySantriAbsen.innerHTML += row;
            });
        }
    }

    // Eksekusi render saat kelas atau tanggal diubah
    filterKelas.addEventListener('change', renderFormInput);
    filterTanggal.addEventListener('change', renderFormInput);

    // Fungsi untuk membatalkan libur (Buka kelas lagi)
    window.batalLibur = (tgl, idKelas) => {
        if(confirm("Yakin ingin membatalkan status libur dan membuka absen untuk kelas ini?")) {
            // Hapus data libur dari array
            dataLibur = dataLibur.filter(d => !(d.tanggal === tgl && (d.kelas_id === 'semua' || d.kelas_id === idKelas)));
            renderFormInput(); // Refresh tampilan
        }
    };

    // Tombol Simpan Jurnal
    document.getElementById('btnSimpanJurnal').onclick = () => {
        let btn = document.getElementById('btnSimpanJurnal');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
        
        setTimeout(() => {
            alert("Alhamdulillah, Data Jurnal Harian & Absensi berhasil disimpan ke Supabase!");
            btn.innerHTML = '<i class="fas fa-save"></i> Simpan Semua Data';
        }, 1000);
    };

});
