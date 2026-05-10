document.addEventListener("DOMContentLoaded", () => {
    
    // Sidebar Toggle (Standar UI)
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    function toggleSidebar() { sidebar.classList.toggle('show'); overlay.classList.toggle('show'); }
    if(menuToggle) menuToggle.addEventListener('click', toggleSidebar);
    if(closeSidebar) closeSidebar.addEventListener('click', toggleSidebar);
    if(overlay) overlay.addEventListener('click', toggleSidebar);

    // Fungsi Switch Tab (Kelas vs Individu)
    window.switchTab = (tabName) => {
        // Ganti warna tombol
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        // Sembunyikan semua tab, tampilkan yang dipilih
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        if(tabName === 'kelas') {
            document.getElementById('tabKelas').classList.add('active');
            document.getElementById('pilihSantri').style.display = 'none'; // Sembunyikan filter santri
        } else {
            document.getElementById('tabIndividu').classList.add('active');
            document.getElementById('pilihSantri').style.display = 'block'; // Tampilkan filter santri
        }
    };

    // ========================================================
    // FITUR 1: CETAK KE WORD (.DOC)
    // ========================================================
    document.getElementById('btnCetakDoc').addEventListener('click', () => {
        // Tentukan area mana yang sedang aktif (Kelas atau Individu)
        let isKelas = document.getElementById('tabKelas').classList.contains('active');
        let elementId = isKelas ? 'areaCetakKelas' : 'areaCetakIndividu';
        let fileName = isKelas ? 'Laporan_Rekap_Kelas.doc' : 'Laporan_ASTS_Santri.doc';

        let preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
        let postHtml = "</body></html>";
        
        let html = preHtml + document.getElementById(elementId).innerHTML + postHtml;

        // Buat file Blob tipe Msword
        let blob = new Blob(['\ufeff', html], { type: 'application/msword' });
        
        // Eksekusi download
        let url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
        let downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);
        
        if(navigator.msSaveOrOpenBlob ){
            navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
            downloadLink.href = url;
            downloadLink.download = fileName;
            downloadLink.click();
        }
        
        document.body.removeChild(downloadLink);
        alert("Alhamdulillah, Dokumen Word berhasil diunduh!");
    });

    // ========================================================
    // FITUR 2: EXPORT KE GAMBAR (.JPG) & KIRIM WA
    // ========================================================
    document.getElementById('btnKirimWA').addEventListener('click', () => {
        let isKelas = document.getElementById('tabKelas').classList.contains('active');
        let elementId = isKelas ? 'areaCetakKelas' : 'areaCetakIndividu';
        let areaCetak = document.getElementById(elementId);
        
        let btnTextAsli = document.getElementById('btnKirimWA').innerHTML;
        document.getElementById('btnKirimWA').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';

        // Gunakan html2canvas untuk 'memotret' layar
        html2canvas(areaCetak, {
            scale: 2, // Kualitas gambar HD
            backgroundColor: "#ffffff",
            useCORS: true // Izinkan render gambar eksternal (logo)
        }).then(canvas => {
            // Ubah canvas jadi file JPG
            let imgData = canvas.toDataURL("image/jpeg", 0.9);
            
            // Auto Download Gambar ke perangkat (iPad/HP)
            let link = document.createElement('a');
            link.download = isKelas ? 'Laporan_Kelas.jpg' : 'Laporan_Santri.jpg';
            link.href = imgData;
            link.click();
            
            // Buka link WhatsApp untuk mengirim pesan pengantar
            // Catatan: WA Web/App tidak bisa langsung menangkap file gambar dari link,
            // Jadi ustadz harus melampirkan gambar yang baru saja otomatis terdownload.
            let pesan = isKelas 
                ? "Assalamu'alaikum, berikut terlampir rekapitulasi laporan Kelas Said Bin Zaid bulan ini. Tafaddhol gambar laporannya dilampirkan." 
                : "Assalamu'alaikum Bapak/Ibu Wali Santri, berikut adalah Laporan Evaluasi ASTS ananda. Tafaddhol gambar laporannya dilampirkan.";
            
            let waUrl = `https://wa.me/?text=${encodeURIComponent(pesan)}`;
            
            // Jeda sedikit agar download selesai sebelum buka tab WA
            setTimeout(() => {
                alert("Gambar JPG telah tersimpan di perangkat Anda. Anda akan dialihkan ke WhatsApp, silakan lampirkan gambar tersebut di kolom obrolan.");
                window.open(waUrl, '_blank');
                document.getElementById('btnKirimWA').innerHTML = btnTextAsli;
            }, 1000);

        }).catch(err => {
            alert("Terjadi kesalahan saat membuat gambar: " + err);
            document.getElementById('btnKirimWA').innerHTML = btnTextAsli;
        });
    });

});
