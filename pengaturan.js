document.addEventListener("DOMContentLoaded", () => {
    
    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    function toggleSidebar() { sidebar.classList.toggle('show'); overlay.classList.toggle('show'); }
    if(menuToggle) menuToggle.addEventListener('click', toggleSidebar);
    if(closeSidebar) closeSidebar.addEventListener('click', toggleSidebar);
    if(overlay) overlay.addEventListener('click', toggleSidebar);

    // ==========================================
    // 1. INISIALISASI DATA (Load dari LocalStorage/Simulasi Backend)
    // ==========================================
    
    // Muat Hari Efektif
    const savedHariEfektif = localStorage.getItem('rq_hari_efektif') || "24";
    document.getElementById('inputHariEfektif').value = savedHariEfektif;

    // Muat Data Profil (Simulasi)
    const savedNama = localStorage.getItem('rq_nama_ustadz') || "Reyndi Alafasy";
    const savedWa = localStorage.getItem('rq_wa_ustadz') || "";
    document.getElementById('inputNamaUstadz').value = savedNama;
    document.getElementById('inputWaUstadz').value = savedWa;

    // ==========================================
    // 2. SIMPAN PROFIL
    // ==========================================
    document.getElementById('formProfil').addEventListener('submit', (e) => {
        e.preventDefault();
        const nama = document.getElementById('inputNamaUstadz').value;
        const wa = document.getElementById('inputWaUstadz').value;
        const btn = document.getElementById('btnSimpanProfil');
        const textAsli = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
        btn.disabled = true;

        // Simulasi proses ke Database
        setTimeout(() => {
            localStorage.setItem('rq_nama_ustadz', nama);
            localStorage.setItem('rq_wa_ustadz', wa);
            
            alert("Alhamdulillah, Profil berhasil diperbarui!");
            btn.innerHTML = textAsli;
            btn.disabled = false;
        }, 800);
    });

    // ==========================================
    // 3. SIMPAN PENGATURAN AKADEMIK (HARI EFEKTIF)
    // ==========================================
    document.getElementById('formAkademik').addEventListener('submit', (e) => {
        e.preventDefault();
        const hariEfektif = document.getElementById('inputHariEfektif').value;
        const btn = document.getElementById('btnSimpanAkademik');
        const textAsli = btn.innerHTML;

        if (hariEfektif < 1 || hariEfektif > 31) {
            alert("Jumlah hari efektif harus antara 1 sampai 31 hari.");
            return;
        }

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
        btn.disabled = true;

        setTimeout(() => {
            // Simpan secara global agar bisa dibaca oleh halaman Dashboard nanti
            localStorage.setItem('rq_hari_efektif', hariEfektif);
            
            alert(`Berhasil! Jumlah hari efektif disetel menjadi ${hariEfektif} hari per bulan.`);
            btn.innerHTML = textAsli;
            btn.disabled = false;
        }, 800);
    });

    // ==========================================
    // 4. GANTI PASSWORD (Simulasi)
    // ==========================================
    document.getElementById('btnGantiPassword').addEventListener('click', () => {
        alert("Fitur ini akan terhubung langsung ke sistem Autentikasi Supabase saat aplikasi di-online-kan sepenuhnya.");
    });

    // ==========================================
    // 5. LOGOUT APLIKASI
    // ==========================================
    document.getElementById('btnLogoutAsli').addEventListener('click', () => {
        const konfirmasi = confirm("Apakah Anda yakin ingin keluar dari aplikasi?");
        
        if (konfirmasi) {
            // Hapus session ID ustadz
            localStorage.removeItem('ustadz_id');
            
            // Nantinya di sini ada fungsi: await supabase.auth.signOut();
            
            alert("Anda telah berhasil keluar.");
            // Lempar kembali ke halaman Login
            window.location.href = "login.html";
        }
    });

});
