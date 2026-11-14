/**
 * Yayasan Pendidikan Islam Al Mukhlisin
 * External JavaScript for isiFormulir.html
 * File: src/js/page2.js
 */

document.addEventListener('DOMContentLoaded', () => {
  const paperForm = document.getElementById('ppdbPaperForm');

  // =========================================================================
  // 1. Interaktivitas Pilihan "Sudah / belum" pada Bagian D. Persyaratan
  // =========================================================================
  const statusGroups = document.querySelectorAll('.syarat-status-group');

  statusGroups.forEach((group) => {
    const targetId = group.getAttribute('data-target');
    const hiddenInput = document.getElementById(targetId);
    const choices = group.querySelectorAll('.status-choice');

    choices.forEach((choice) => {
      choice.addEventListener('click', () => {
        const selectedVal = choice.getAttribute('data-val');

        // Update tampilan status aktif
        choices.forEach((c) => c.classList.remove('active'));
        choice.classList.add('active');

        // Update nilai pada input tersembunyi
        if (hiddenInput) {
          hiddenInput.value = selectedVal;
        }
      });
    });
  });

  // =========================================================================
  // 2. Tanggal Otomatis pada Kolom Tanda Tangan Sukabumi
  // =========================================================================
  const ttdTanggal = document.getElementById('ttdTanggal');
  if (ttdTanggal && !ttdTanggal.value) {
    const now = new Date();
    const bulanIndo = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const tgl = now.getDate();
    const bln = bulanIndo[now.getMonth()];
    const thn = now.getFullYear();
    ttdTanggal.placeholder = `${tgl} ${bln} ${thn}`;
  }

  // =========================================================================
  // 3. Penanganan Pengiriman Formulir (Form Submit)
  // =========================================================================
  if (paperForm) {
    paperForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const noPendaftaran = document.getElementById('noPendaftaran')?.value || '001/PPDB/2026';
      const namaSiswa = document.getElementById('namaSiswa')?.value || 'Calon Santri';

      // Mengambil jenjang yang dipilih
      const checkedJenjang = Array.from(
        document.querySelectorAll('input[name="jenjang[]"]:checked')
      ).map((el) => el.value);

      const jenjangTeks = checkedJenjang.length > 0 ? checkedJenjang.join(', ') : 'Belum dipilih';

      const pesanKonfirmasi = 
        `Alhamdulillah!\n\n` +
        `Data Formulir Pendaftaran Berhasil Disimpan:\n` +
        `----------------------------------------\n` +
        `No. Pendaftaran : ${noPendaftaran}\n` +
        `Nama Calon Santri : ${namaSiswa}\n` +
        `Jenjang Dituju   : ${jenjangTeks}\n` +
        `----------------------------------------\n\n` +
        `Apakah Anda ingin langsung mencetak / menyimpan PDF formulir ini sekarang?`;

      if (confirm(pesanKonfirmasi)) {
        window.print();
      }
    });
  }
});
