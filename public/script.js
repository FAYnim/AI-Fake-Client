document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('client-generator-form');
    const generateButton = form.querySelector('button');
    const projectBriefTextarea = document.getElementById('project-brief');
    const dialogClientTextarea = document.getElementById('dialog-client');
    const copyButtons = document.querySelectorAll('.copy-btn');

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('nama').value;
        const bio = document.getElementById('bio').value;
        const skill = document.getElementById('keahlian').value;
        const preference = document.getElementById('preferensi').value;

        if (!name || !bio || !skill || !preference) {
            alert('Mohon isi semua data Anda.');
            return;
        }

        // --- Mulai Logika Fetch ke Backend ---

        // 1. Set state ke "Loading"
        const originalButtonText = generateButton.innerHTML;
        generateButton.disabled = true;
        generateButton.innerHTML = 'Generating... <i class="fas fa-spinner fa-spin"></i>';
        projectBriefTextarea.value = 'Sedang meminta ide project dari AI...';
        dialogClientTextarea.value = 'Sedang membuat simulasi dialog client...';

        try {
            // 2. Kirim request ke server
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nama: name,
                    bio: bio,
                    keahlian: skill,
                    preferensi: preference
                }),
            });

            if (!response.ok) {
                // Tangani error dari server
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal terhubung ke server.');
            }

            // 3. Terima dan tampilkan hasil
            const result = await response.json();
            projectBriefTextarea.value = result.projectBrief.trim();
            dialogClientTextarea.value = result.clientMessage.trim();

        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan: ' + error.message);
            projectBriefTextarea.value = 'Gagal memuat data. Silakan coba lagi.';
            dialogClientTextarea.value = 'Gagal memuat data. Silakan coba lagi.';
        } finally {
            // 4. Kembalikan state button seperti semula
            generateButton.disabled = false;
            generateButton.innerHTML = originalButtonText;
        }
    });

    // Handle copy button clicks (tidak ada perubahan di sini)
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const textarea = document.getElementById(targetId);

            if (textarea.value && !textarea.value.startsWith('Sedang') && !textarea.value.startsWith('Gagal')) {
                navigator.clipboard.writeText(textarea.value)
                    .then(() => {
                        const originalText = button.querySelector('span').textContent;
                        button.querySelector('i').className = 'fa-solid fa-check';
                        button.querySelector('span').textContent = 'Copied!';
                        button.classList.add('copied');

                        setTimeout(() => {
                            button.querySelector('i').className = 'fa-regular fa-copy';
                            button.querySelector('span').textContent = originalText;
                            button.classList.remove('copied');
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Gagal menyalin teks: ', err);
                        alert('Maaf, gagal menyalin teks.');
                    });
            } else {
                alert('Tidak ada teks untuk disalin.');
            }
        });
    });
});
