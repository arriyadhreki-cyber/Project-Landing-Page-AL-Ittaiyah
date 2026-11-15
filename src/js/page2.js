/**
 * Yayasan Pendidikan Islam Al Mukhlisin
 * External JavaScript for isiFormulir.html
 * File: src/js/page2.js
 */

// =========================================================================
// KONFIGURASI GOOGLE APPS SCRIPT WEB APP
// Tempelkan Web App URL dari Google Apps Script Anda di sini.
// Contoh: 'https://script.google.com/macros/s/AKfycbx.../exec'
// =========================================================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyARA4q0BYPIpfS9qjPKFJAStvp4OQrEqy1U7Dw1igOIfZ400sArIemiyi7V53AWg9yMQ/exec';

document.addEventListener('DOMContentLoaded', () => {
  const paperForm = document.getElementById('ppdbPaperForm');

  // =========================================================================
  // 1. Interaktivitas Pilihan Jenis Kelamin (Radio)
  // =========================================================================
  const jkRadios = document.querySelectorAll('input[name="jkRadio"]');
  const jkSiswaInput = document.getElementById('jkSiswa');

  jkRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.checked && jkSiswaInput) {
        jkSiswaInput.value = radio.value;
      }
    });
  });

  // =========================================================================
  // 2. Tombol Bantu Cepat Salin Alamat
  // =========================================================================
  const btnCopySiswaKeAyah = document.getElementById('btnCopySiswaKeAyah');
  if (btnCopySiswaKeAyah) {
    btnCopySiswaKeAyah.addEventListener('click', () => {
      const kpJln = document.getElementById('alamatKpJln')?.value.trim() || '';
      const rtRw = document.getElementById('alamatRtRw')?.value.trim() || '';
      const desa = document.getElementById('alamatDesa')?.value.trim() || '';
      const kec = document.getElementById('alamatKec')?.value.trim() || '';

      const parts = [];
      if (kpJln) parts.push(kpJln);
      if (rtRw) parts.push(`RT/RW ${rtRw}`);
      if (desa) parts.push(`Desa ${desa}`);
      if (kec) parts.push(`Kec. ${kec}`);

      const alamatLengkap = parts.join(', ');
      const alamatAyahInput = document.getElementById('alamatAyah');
      if (alamatAyahInput) {
        alamatAyahInput.value = alamatLengkap || 'Sama dengan alamat siswa';
        alamatAyahInput.focus();
      }
    });
  }

  const btnCopyAyahKeIbu = document.getElementById('btnCopyAyahKeIbu');
  if (btnCopyAyahKeIbu) {
    btnCopyAyahKeIbu.addEventListener('click', () => {
      const alamatAyah = document.getElementById('alamatAyah')?.value.trim() || '';
      const alamatIbuInput = document.getElementById('alamatIbu');
      if (alamatIbuInput) {
        alamatIbuInput.value = alamatAyah || 'Sama dengan alamat Ayah';
        alamatIbuInput.focus();
      }
    });
  }

  // =========================================================================
  // 3. Interaktivitas Pilihan "Sudah / belum" pada Bagian D. Persyaratan
  // =========================================================================
  const statusGroups = document.querySelectorAll('.syarat-status-group');

  statusGroups.forEach((group) => {
    const targetId = group.getAttribute('data-target');
    const hiddenInput = document.getElementById(targetId);
    const buttons = group.querySelectorAll('.btn-toggle-status');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selectedVal = btn.getAttribute('data-val');

        // Update tampilan status aktif
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        // Update nilai pada input tersembunyi
        if (hiddenInput) {
          hiddenInput.value = selectedVal;
        }
      });
    });
  });

  // =========================================================================
  // 4. Interaktivitas Upload File Tanda Tangan Orang Tua/Wali (Formalitas)
  // File hanya divalidasi status "Terisi / Belum" dan tidak disimpan ke server
  // =========================================================================
  const fileTandaTangan = document.getElementById('fileTandaTangan');
  const ttdUploadContainer = document.getElementById('ttdUploadContainer');
  const ttdUploadLabel = document.getElementById('ttdUploadLabel');
  const ttdPreviewBox = document.getElementById('ttdPreviewBox');
  const ttdPreviewImg = document.getElementById('ttdPreviewImg');
  const ttdFileNameDisplay = document.getElementById('ttdFileNameDisplay');
  const btnHapusFileTtd = document.getElementById('btnHapusFileTtd');

  function handleFileSelect(file) {
    if (!file) return;

    // Batasan ukuran 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal adalah 2MB. Silakan pilih file yang lebih kecil.');
      if (fileTandaTangan) fileTandaTangan.value = '';
      return;
    }

    if (ttdFileNameDisplay) {
      ttdFileNameDisplay.textContent = file.name;
    }

    // Jika file gambar, tampilkan thumbnail preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (ttdPreviewImg) {
          ttdPreviewImg.src = e.target.result;
          ttdPreviewImg.style.display = 'block';
        }
      };
      reader.readAsDataURL(file);
    } else {
      if (ttdPreviewImg) {
        ttdPreviewImg.style.display = 'none';
      }
    }

    // Tampilkan box preview dan sembunyikan label upload
    if (ttdUploadLabel) ttdUploadLabel.style.display = 'none';
    if (ttdPreviewBox) ttdPreviewBox.style.display = 'flex';
  }

  if (fileTandaTangan) {
    fileTandaTangan.addEventListener('change', (e) => {
      const file = e.target.files[0];
      handleFileSelect(file);
    });
  }

  // Tombol Hapus / Ganti File Tanda Tangan
  if (btnHapusFileTtd) {
    btnHapusFileTtd.addEventListener('click', (e) => {
      e.stopPropagation();
      if (fileTandaTangan) fileTandaTangan.value = '';
      if (ttdPreviewImg) {
        ttdPreviewImg.src = '';
        ttdPreviewImg.style.display = 'none';
      }
      if (ttdFileNameDisplay) ttdFileNameDisplay.textContent = '';
      if (ttdPreviewBox) ttdPreviewBox.style.display = 'none';
      if (ttdUploadLabel) ttdUploadLabel.style.display = 'flex';
    });
  }

  // Dukungan Drag & Drop pada Area Upload
  if (ttdUploadContainer) {
    ['dragenter', 'dragover'].forEach((eventName) => {
      ttdUploadContainer.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        ttdUploadContainer.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      ttdUploadContainer.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        ttdUploadContainer.classList.remove('drag-over');
      });
    });

    ttdUploadContainer.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const file = dt.files[0];
      if (file && fileTandaTangan) {
        fileTandaTangan.files = dt.files;
        handleFileSelect(file);
      }
    });
  }

  // =========================================================================
  // 5. Tanggal Otomatis pada Kolom Tanda Tangan Sukabumi
  // =========================================================================
  const ttdTanggal = document.getElementById('ttdTanggal');
  const bulanIndo = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  if (ttdTanggal && !ttdTanggal.value) {
    const now = new Date();
    const tgl = now.getDate();
    const bln = bulanIndo[now.getMonth()];
    const thn = now.getFullYear();
    const tglOtomatis = `${tgl} ${bln} ${thn}`;
    ttdTanggal.value = tglOtomatis;
    ttdTanggal.placeholder = tglOtomatis;
  }

  // =========================================================================
  // 6. Modal Dialog Sukses & Pengiriman Formulir ke Google Spreadsheet
  // =========================================================================
  const successModal = document.getElementById('successModal');
  const btnModalPrint = document.getElementById('btnModalPrint');
  const btnModalClose = document.getElementById('btnModalClose');

  if (btnModalPrint) {
    btnModalPrint.addEventListener('click', () => {
      if (successModal && successModal.open) {
        successModal.close();
      }
      setTimeout(() => {
        window.print();
      }, 300);
    });
  }

  if (btnModalClose && successModal) {
    btnModalClose.addEventListener('click', () => {
      successModal.close();
    });
  }

  if (paperForm) {
    paperForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validasi sederhana nama siswa
      const namaSiswa = document.getElementById('namaSiswa')?.value.trim();
      if (!namaSiswa) {
        alert('Mohon masukkan Nama Lengkap Calon Siswa terlebih dahulu.');
        document.getElementById('namaSiswa')?.focus();
        return;
      }

      const noPendaftaran = document.getElementById('noPendaftaran')?.value || '001/PPDB/2027';
      const checkedJenjang = Array.from(
        document.querySelectorAll('input[name="jenjang[]"]:checked')
      ).map((el) => el.value);
      const jenjangTeks = checkedJenjang.length > 0 ? checkedJenjang.join(', ') : 'Belum dipilih';

      // Ambil nilai Tempat & Tanggal Lahir Siswa
      let tempatLahir = (document.getElementById('tempatLahirSiswa')?.value || '').trim();
      let tanggalLahir = (document.getElementById('tanggalLahirSiswa')?.value || '').trim();
      if (!tempatLahir && !tanggalLahir) {
        const ttlVal = (document.getElementById('ttlSiswa')?.value || '').trim();
        if (ttlVal.includes(',')) {
          const parts = ttlVal.split(',');
          tempatLahir = parts[0].trim();
          tanggalLahir = parts.slice(1).join(',').trim();
        } else {
          tempatLahir = ttlVal;
          tanggalLahir = '-';
        }
      }

      // Status tanda tangan formalitas: Sudah / Belum
      const hasUploadedFile = fileTandaTangan && fileTandaTangan.files && fileTandaTangan.files.length > 0;
      const statusTtd = hasUploadedFile ? 'Sudah' : 'Belum';

      // 9 Persyaratan Dokumen Terpisah Sesuai Kolom Spreadsheet AD - AL
      const getSyaratVal = (id, defaultVal = 'Belum') => {
        const el = document.getElementById(id);
        const val = el ? (el.value || '').trim().toLowerCase() : defaultVal.toLowerCase();
        return val === 'sudah' ? 'Sudah' : 'Belum';
      };

      const syarat1 = getSyaratVal('syarat_1', 'Sudah');
      const syarat2 = getSyaratVal('syarat_2', 'Belum');
      const syarat3 = getSyaratVal('syarat_3', 'Belum');
      const syarat4 = getSyaratVal('syarat_4', 'Belum');
      const syarat5 = getSyaratVal('syarat_5', 'Belum');
      const syarat6 = getSyaratVal('syarat_6', 'Belum');
      const syarat7 = getSyaratVal('syarat_7', 'Belum');
      const syarat8 = getSyaratVal('syarat_8', 'Belum');
      const syarat9 = getSyaratVal('syarat_9', 'Belum');

      // Payload JSON yang dikirim ke Google Spreadsheet
      const payload = {
        noPendaftaran: noPendaftaran,
        namaSiswa: namaSiswa,
        tempatLahirSiswa: tempatLahir || '-',
        tanggalLahirSiswa: tanggalLahir || '-',
        jkSiswa: document.getElementById('jkSiswa')?.value || 'Laki-laki',
        agamaSiswa: 'ISLAM',
        nisnSiswa: document.getElementById('nisnSiswa')?.value || '-',
        anakKe: document.getElementById('anakKe')?.value || '-',
        jmlSaudara: document.getElementById('jmlSaudara')?.value || '-',
        telpSiswa: document.getElementById('telpSiswa')?.value || '-',
        alamatKpJln: document.getElementById('alamatKpJln')?.value || '',
        alamatRtRw: document.getElementById('alamatRtRw')?.value || '',
        alamatDesa: document.getElementById('alamatDesa')?.value || '',
        alamatKec: document.getElementById('alamatKec')?.value || '',
        asalSekolahNama: document.getElementById('asalSekolahNama')?.value || '-',
        asalSekolahAlamat: document.getElementById('asalSekolahAlamat')?.value || '-',
        namaAyah: document.getElementById('namaAyah')?.value || '-',
        ttlAyah: document.getElementById('ttlAyah')?.value || '-',
        pendidikanAyah: document.getElementById('pendidikanAyah')?.value || '-',
        pekerjaanAyah: document.getElementById('pekerjaanAyah')?.value || '-',
        telpAyah: document.getElementById('telpAyah')?.value || '-',
        alamatAyah: document.getElementById('alamatAyah')?.value || '-',
        namaIbu: document.getElementById('namaIbu')?.value || '-',
        ttlIbu: document.getElementById('ttlIbu')?.value || '-',
        pendidikanIbu: document.getElementById('pendidikanIbu')?.value || '-',
        pekerjaanIbu: document.getElementById('pekerjaanIbu')?.value || '-',
        telpIbu: document.getElementById('telpIbu')?.value || '-',
        alamatIbu: document.getElementById('alamatIbu')?.value || '-',
        jenjang: jenjangTeks,
        syarat1: syarat1,
        syarat2: syarat2,
        syarat3: syarat3,
        syarat4: syarat4,
        syarat5: syarat5,
        syarat6: syarat6,
        syarat7: syarat7,
        syarat8: syarat8,
        syarat9: syarat9,
        statusTtd: statusTtd, // Validasi formalitas: "Sudah" / "Belum"
        ttdNamaOrtu: document.getElementById('ttdNamaOrtu')?.value || '-'
      };

      // Efek tombol saat proses kirim
      const submitBtn = paperForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Menyimpan ke Spreadsheet...</span>';
      }

      // Kirim ke Google Apps Script jika URL sudah diisi
      if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.trim() !== '') {
        try {
          await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        } catch (error) {
          console.warn('Gagal sinkronisasi otomatis ke Google Spreadsheet:', error);
        }
      }

      // Kembalikan tombol submit
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }

      // Tampilkan ringkasan pada modal sukses
      const modalNoReg = document.getElementById('modalNoReg');
      const modalNamaSiswa = document.getElementById('modalNamaSiswa');
      const modalJenjang = document.getElementById('modalJenjang');

      if (modalNoReg) modalNoReg.textContent = noPendaftaran;
      if (modalNamaSiswa) modalNamaSiswa.textContent = namaSiswa;
      if (modalJenjang) modalJenjang.textContent = jenjangTeks;

      // Buka modal dialog sukses
      if (successModal) {
        if (typeof successModal.showModal === 'function') {
          successModal.showModal();
        } else {
          successModal.setAttribute('open', '');
        }
      }
    });
  }
});
