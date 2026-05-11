document.addEventListener("DOMContentLoaded", () => {
    
    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const overlay = document.getElementById('sidebarOverlay');
    if(menuToggle) menuToggle.onclick = () => { sidebar.classList.toggle('show'); overlay.classList.toggle('show'); };

    // Switch Tab
    window.switchTab = (tabName) => {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        if(tabName === 'kelas') {
            document.getElementById('tabKelas').classList.add('active');
            document.getElementById('pilihSantri').style.display = 'none';
        } else {
            document.getElementById('tabIndividu').classList.add('active');
            document.getElementById('pilihSantri').style.display = 'block';
        }
    };

    // FUNGSI TOGGLE EDIT (ContentEditable)
    window.toggleEdit = (containerId) => {
        const container = document.getElementById(containerId);
        const isEditing = container.getAttribute('data-editing') === 'true';
        
        if (isEditing) {
            container.setAttribute('data-editing', 'false');
            alert("Mode Edit Dimatikan. Data siap dicetak.");
        } else {
            container.setAttribute('data-editing', 'true');
            alert("Mode Edit Aktif. Silakan klik teks mana saja untuk merubah isi laporan.");
        }
    };

    // KIRIM WA (JPG HD)
    document.getElementById('btnKirimWA').onclick = () => {
        const activeTab = document.querySelector('.tab-content.active');
        const area = activeTab.querySelector('.kertas-print');
        
        // Tambahkan class khusus untuk menyembunyikan tombol edit saat difoto
        activeTab.classList.add('exporting');

        html2canvas(area, { scale: 2, backgroundColor: "#ffffff" }).then(canvas => {
            const imgData = canvas.toDataURL("image/jpeg", 0.9);
            const link = document.createElement('a');
            link.download = `Laporan_RQ_Kamila.jpg`;
            link.href = imgData;
            link.click();
            
            activeTab.classList.remove('exporting');
            alert("Gambar JPG Tersimpan. Silakan lampirkan ke WhatsApp Wali Santri.");
            window.open("https://wa.me/", "_blank");
        });
    };

    // CETAK DOC
    document.getElementById('btnCetakDoc').onclick = () => {
        const activeTab = document.querySelector('.tab-content.active');
        const areaHtml = activeTab.querySelector('.kertas-print').innerHTML;
        
        const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>";
        const postHtml = "</body></html>";
        const fullHtml = preHtml + areaHtml + postHtml;

        const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Laporan_RQ_Kamila.doc";
        link.click();
    };

});
