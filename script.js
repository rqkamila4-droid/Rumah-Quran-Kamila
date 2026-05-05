document.addEventListener("DOMContentLoaded", () => {
    // Waktu tunggu sebelum pindah halaman (dalam milidetik)
    // 4500 ms = 4.5 detik
    const splashDuration = 4500; 

    setTimeout(() => {
        // Ganti 'login.html' dengan nama file halaman login Anda nantinya
        window.location.href = "login.html";
    }, splashDuration);
});
