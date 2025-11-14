// ===== VARIABEL GLOBAL =====
let video;
let canvas;
let ctx;
let modelDimuat = false;
let analisisBerjalan = false;
let intervalDeteksi;
let timerAnalisis; // NEW: Timer untuk membatasi durasi analisis

// Variabel untuk fitur terapi
let timerLatihan = null;
let waktuLatihanSaatIni = 0;
let emosiTerakhirTerdeteksi = null;
let kepercayaanEmosiTerakhir = 0;

// ===== KONFIGURASI EMOSI & TERAPI =====
const konfigurasiEmosi = {
    happy: {
        label: 'Senang',
        icon: '😊',
        color: '#f1c40f',
        wawasan: [
            "Kamu tampak ceria hari ini! Pertahankan energi positifmu.",
            "Ekspresi bahagia terpancar dari wajahmu. Bagikan kebahagiaanmu pada orang sekitar!",
            "Senang melihatmu tersenyum! Energi positifmu sangat menular."
        ],
        wawasanPascaAnalisis: [
            "Berdasarkan analisis 10 detik, kamu menunjukkan emosi bahagia. Pertahankan energi positif ini dengan melanjutkan aktivitas yang membuatmu senang!",
            "Hasil analisis 10 detik menunjukkan kamu dalam kondisi emosional yang positif. Bagikan kebahagiaanmu dengan orang terdekat!",
            "Setelah 10 detik analisis, kamu terdeteksi sedang bahagia. Ini saat yang tepat untuk mengejar goals atau memulai proyek baru!"
        ]
    },
    sad: {
        label: 'Sedih',
        icon: '😔',
        color: '#3498db',
        wawasan: [
            "Kamu terlihat murung. Coba tarik napas dalam dan istirahat sejenak.",
            "Perasaan sedih itu wajar. Beri waktu untuk dirimu sendiri dan jangan ragu mencari dukungan.",
            "Setiap perasaan memiliki waktunya. Izinkan dirimu merasakan kesedihan ini sejenak."
        ],
        wawasanPascaAnalisis: [
            "Analisis 10 detik mendeteksi kesedihan. Ingatlah bahwa perasaan ini bersifat sementara dan kamu tidak sendirian.",
            "Berdasarkan hasil deteksi 10 detik, kamu tampak sedih. Luangkan waktu untuk self-care dan bicarakan perasaanmu dengan orang terpercaya.",
            "Emosi sedih terdeteksi dalam analisis 10 detik. Cobalah teknik pernapasan dalam atau dengarkan musik yang menenangkan."
        ]
    },
    angry: {
        label: 'Marah',
        icon: '😠',
        color: '#e74c3c',
        wawasan: [
            "Kemarahan itu wajar, tapi cobalah menenangkan diri dulu.",
            "Ambil napas dalam dan hitung sampai sepuluh. Beri dirimu ruang untuk berpikir jernih.",
            "Marah adalah emosi yang valid. Cari cara sehat untuk mengekspresikannya."
        ],
        wawasanPascaAnalisis: [
            "Analisis 10 detik menunjukkan emosi marah. Cobalah teknik anger management seperti menulis jurnal atau olahraga.",
            "Berdasarkan deteksi 10 detik, kamu mengalami kemarahan. Ingat, marah itu normal tapi penting untuk mengekspresikannya dengan sehat.",
            "Emosi marah terdeteksi dalam 10 detik analisis. Coba identifikasi pemicunya dan cari solusi konstruktif."
        ]
    },
    fearful: {
        label: 'Takut',
        icon: '😨',
        color: '#9b59b6',
        wawasan: [
            "Rasa takut bisa menjadi penanda bahwa kamu peduli. Hadapi perlahan-lahan.",
            "Takut adalah respons alami. Coba identifikasi sumber ketakutanmu dan hadapi bertahap.",
            "Setiap orang merasa takut kadang-kadang. Kamu lebih kuat dari yang kamu kira."
        ],
        wawasanPascaAnalisis: [
            "Analisis 10 detik mendeteksi rasa takut. Ingatlah bahwa keberanian bukanlah tidak ada rasa takut, tapi kemampuan untuk bertindak meskipun takut.",
            "Berdasarkan hasil deteksi 10 detik, kamu mengalami ketakutan. Coba pecah masalah besar menjadi langkah-langkah kecil yang bisa dikelola.",
            "Emosi takut teridentifikasi dalam analisis 10 detik. Teknik pernapasan 4-7-8 bisa membantu menenangkan sistem saraf."
        ]
    },
    surprised: {
        label: 'Terkejut',
        icon: '😲',
        color: '#e67e22',
        wawasan: [
            "Wah, kamu terlihat terkejut! Ada hal baru yang kamu alami?",
            "Kejutan bisa membawa peluang baru. Terbuka terhadap pengalaman tidak terduga.",
            "Ekspresi terkejutmu menunjukkan kamu masih penasaran dengan dunia sekitar."
        ],
        wawasanPascaAnalisis: [
            "Analisis 10 detik menunjukkan ekspresi terkejut. Kejutan sering membawa peluang belajar baru!",
            "Berdasarkan deteksi 10 detik, kamu mengalami kejutan. Manfaatkan energi ini untuk eksplorasi dan pembelajaran.",
            "Emosi terkejut terdeteksi dalam 10 detik analisis. Ini bisa menjadi tanda bahwa kamu sedang berkembang dan menghadapi hal baru."
        ]
    },
    disgusted: {
        label: 'Jijik',
        icon: '🤢',
        color: '#1abc9c',
        wawasan: [
            "Perasaan jijik membantu kita menghindari hal yang tidak sehat.",
            "Tubuhmu memberi sinyal. Dengarkan instingmu tentang apa yang tidak nyaman.",
            "Rasa jijik adalah mekanisme perlindungan alami. Hormati perasaanmu."
        ],
        wawasanPascaAnalisis: [
            "Analisis 10 detik mendeteksi perasaan jijik. Ini adalah mekanisme pertahanan alami yang melindungi nilai-nilai personalmu.",
            "Berdasarkan deteksi 10 detik, kamu mengalami disgust. Coba identifikasi sumbernya dan tentukan batasan yang sehat.",
            "Emosi jijik teridentifikasi dalam analisis 10 detik. Perasaan ini membantu menjaga integritas personal dan nilai-nilai yang kamu pegang."
        ]
    },
    neutral: {
        label: 'Netral',
        icon: '😐',
        color: '#95a5a6',
        wawasan: [
            "Ekspresimu tenang — mungkin kamu sedang fokus atau rileks.",
            "Wajahmu yang netral menunjukkan keseimbangan emosional yang baik.",
            "Ketenangan adalah kekuatan. Kamu tampak dalam kendali dirimu."
        ],
        wawasanPascaAnalisis: [
            "Analisis 10 detik menunjukkan keadaan emosi yang netral dan seimbang. Ini adalah dasar yang baik untuk pengambilan keputusan rasional.",
            "Berdasarkan deteksi 10 detik, kamu dalam kondisi emosional yang stabil. Manfaatkan ketenangan ini untuk perencanaan dan refleksi.",
            "Emosi netral terdeteksi dalam analisis 10 detik. Kondisi ini ideal untuk belajar, bekerja, atau meditasi dengan fokus penuh."
        ]
    }
};

// ===== KONFIGURASI TERAPI MUSIK & LATIHAN =====
const konfigurasiTerapi = {
    happy: {
        pesan: "Lagu semangat untuk pertahankan energi positifmu! 🎉",
        trek: [
            {nama: "Positive Vibes", file: "music/happy1.mp3"},
            {nama: "Sunshine Melody", file: "music/happy1.mp3"}
        ],
        aktivitas: "Coba bergoyang mengikuti irama sambil tersenyum!",
        latihan: {
            judul: "Amplify Happiness",
            langkah: [
                "Tutup mata dan ingat momen bahagia",
                "Senyum lebar selama 10 detik", 
                "Tarik napas dalam, hembuskan sambil berkata 'Aku bersyukur'",
                "Buka mata dan pertahankan senyum"
            ],
            durasi: 60
        }
    },
    sad: {
        pesan: "Musik menenangkan untuk membantumu merasa lebih baik 🌊",
        trek: [
            {nama: "Healing Piano", file: "music/sad1.mp3"},
            {nama: "Calming Waves", file: "music/sad1.mp3"}
        ],
        aktivitas: "Dengarkan sambil menutup mata dan bernapas dalam",
        latihan: {
            judul: "Comfort Breathing",
            langkah: [
                "Tempatkan tangan di dada",
                "Tarik napas perlahan 4 hitungan",
                "Tahan 2 hitungan",
                "Hembuskan 6 hitungan",
                "Ulangi 5 kali"
            ],
            durasi: 120
        }
    },
    angry: {
        pesan: "Suara alam untuk meredakan ketegangan dan amarah 🌿",
        trek: [
            {nama: "Forest Calm", file: "music/angry1.mp3"},
            {nama: "Ocean Peace", file: "music/angry1.mp3"}
        ],
        aktivitas: "Fokus pada suara alam sambil menenangkan diri",
        latihan: {
            judul: "Anger Release",
            langkah: [
                "Kepalkan tangan kuat-kuat - tahan 3 detik",
                "Lepaskan perlahan sambil hembuskan napas",
                "Goyangkan tangan untuk melepas ketegangan",
                "Ulangi 3 kali dengan napas dalam"
            ],
            durasi: 90
        }
    },
    fearful: {
        pesan: "Musik grounding untuk membantumu merasa aman 🛡️",
        trek: [
            {nama: "Safe Space", file: "music/fearful1.mp3"},
            {nama: "Protective Melody", file: "music/fearful2.mp3"}
        ],
        aktivitas: "Dengarkan sambil merasakan kaki menapak lantai",
        latihan: {
            judul: "5-4-3-2-1 Grounding",
            langkah: [
                "Sebutkan 5 hal yang kamu lihat",
                "Sebutkan 4 hal yang bisa kamu sentuh",
                "Sebutkan 3 hal yang bisa kamu dengar", 
                "Sebutkan 2 hal yang bisa kamu cium",
                "Sebutkan 1 hal yang bisa kamu rasa"
            ],
            durasi: 60
        }
    },
    surprised: {
        pesan: "Musik inspiratif untuk eksplorasi hal baru! 🌟",
        trek: [
            {nama: "Adventure Theme", file: "music/surprised1.mp3"},
            {nama: "Discovery Sound", file: "music/surprised1.mp3"}
        ],
        aktivitas: "Dengarkan sambil membayangkan petualangan baru",
        latihan: {
            judul: "Curiosity Expansion",
            langkah: [
                "Pikirkan 3 hal baru yang ingin dipelajari",
                "Bayangkan menjelajahi tempat baru",
                "Tulis satu ide kreatif yang muncul",
                "Rencanakan satu langkah kecil untuk eksplorasi"
            ],
            durasi: 90
        }
    },
    disgusted: {
        pesan: "Musik pembersihan untuk menyegarkan pikiran 🍃",
        trek: [
            {nama: "Purification", file: "music/disgusted1.mp3"},
            {nama: "Renewal Melody", file: "music/disgusted2.mp3"}
        ],
        aktivitas: "Dengarkan sambil membayangkan pelepasan beban",
        latihan: {
            judul: "Emotional Cleansing",
            langkah: [
                "Tarik napas dalam, bayangkan energi negatif keluar",
                "Visualisasi membuang hal yang tidak dibutuhkan",
                "Tulis hal yang ingin dilepaskan",
                "Tarik napas, terima kedamaian"
            ],
            durasi: 120
        }
    },
    neutral: {
        pesan: "Musik fokus untuk pertahankan keseimbanganmu ⚖️",
        trek: [
            {nama: "Focus Flow", file: "music/neutral1.mp3"},
            {nama: "Mindful Moments", file: "music/neutral1.mp3"}
        ],
        aktivitas: "netral saja tidak cukup,ayo bersemangat untuk hari ini.",
        latihan: {
            judul: "Mindful Awareness", 
            langkah: [
                "Perhatikan sensasi napas masuk-keluar",
                "Nikmati musik",
                "Bayangkan hal beruntung datang kepadamu",
                "Nikmati suasana lagu"
            ],
            durasi: 180
        }
    }
};

// ===== CEK APAKAH face-api.js SUDAH LOAD =====
function waitForFaceAPI() {
    return new Promise((resolve, reject) => {
        const maxWaitTime = 10000; // 10 detik
        const startTime = Date.now();
        
        function checkFaceAPI() {
            if (typeof faceapi !== 'undefined') {
                console.log('✅ face-api.js berhasil di-load');
                resolve();
            } else if (Date.now() - startTime > maxWaitTime) {
                reject(new Error('❌ face-api.js gagal load dalam 10 detik'));
            } else {
                setTimeout(checkFaceAPI, 100);
            }
        }
        
        checkFaceAPI();
    });
}

// ===== INISIALISASI APLIKASI =====
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🧠 MindMirror - AI Mental Health Analyzer dimulai...');
    
    try {
        // Tunggu face-api.js siap
        await waitForFaceAPI();
        
        // Inisialisasi semua komponen
        inisialisasiElemen();
        setupPendengarEvent();
        inisialisasiNavigasi();
        inisialisasiAnimasiScroll();
        inisialisasiGridEmosi();
        setupMusicUpload(); // Setup upload musik
        
        // Mulai loading model AI
        muatModel();
        
    } catch (error) {
        console.error('Error inisialisasi:', error);
        updateStatus('Error: Library AI tidak terload', 'error');
        setupModeDemo();
    }
});

// ===== FUNGSI INISIALISASI =====

// Inisialisasi elemen DOM
function inisialisasiElemen() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    // Atur ukuran canvas sesuai video
    video.addEventListener('loadedmetadata', function() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        console.log('📐 Dimensi video:', video.videoWidth, 'x', video.videoHeight);
    });
}

// Setup upload musik
function setupMusicUpload() {
    // Cek apakah elemen upload sudah ada, jika belum buat
    let uploadContainer = document.getElementById('music-upload-container');
    if (!uploadContainer) {
        uploadContainer = document.createElement('div');
        uploadContainer.id = 'music-upload-container';
        uploadContainer.style.margin = '10px 0';
        uploadContainer.style.textAlign = 'center';
        
        const uploadButton = document.createElement('button');
        uploadButton.id = 'music-upload-btn';
        uploadButton.innerHTML = '🎵 Upload Musik Anda';
        uploadButton.className = 'upload-button';
        
        const uploadInput = document.createElement('input');
        uploadInput.type = 'file';
        uploadInput.id = 'music-upload';
        uploadInput.accept = 'audio/*';
        uploadInput.multiple = true;
        uploadInput.style.display = 'none';
        
        const uploadInfo = document.createElement('div');
        uploadInfo.id = 'upload-info';
        uploadInfo.style.fontSize = '12px';
        uploadInfo.style.marginTop = '5px';
        uploadInfo.style.color = '#888';
        
        uploadButton.onclick = () => uploadInput.click();
        
        uploadContainer.appendChild(uploadButton);
        uploadContainer.appendChild(uploadInput);
        uploadContainer.appendChild(uploadInfo);
        
        // Tambahkan ke music player section
        const musicPlayer = document.getElementById('music-player');
        if (musicPlayer) {
            musicPlayer.appendChild(uploadContainer);
        }
    }
    
    // Handle file selection
    const uploadInput = document.getElementById('music-upload');
    uploadInput.addEventListener('change', function(e) {
        const files = e.target.files;
        if (files.length > 0) {
            playUploadedMusic(files[0]);
        }
    });
}

// Fungsi untuk memutar musik yang diupload
function playUploadedMusic(file) {
    const elemenAudio = document.getElementById('therapy-audio');
    const uploadInfo = document.getElementById('upload-info');
    
    // Validasi file audio
    if (!file.type.startsWith('audio/')) {
        uploadInfo.textContent = '❌ File harus berupa audio (MP3, WAV, etc.)';
        uploadInfo.style.color = '#e74c3c';
        return;
    }
    
    const objectURL = URL.createObjectURL(file);
    
    elemenAudio.src = objectURL;
    elemenAudio.volume = 0.7;
    
    // Update UI
    document.getElementById('therapy-message').textContent = `Memutar: ${file.name}`;
    document.getElementById('activity-suggestion').textContent = "Musik custom Anda sedang diputar";
    document.getElementById('music-player').style.display = 'block';
    
    uploadInfo.textContent = `✅ Loaded: ${file.name}`;
    uploadInfo.style.color = '#2ecc71';
    
    // Coba auto-play
    const janjiPutar = elemenAudio.play();
    if (janjiPutar !== undefined) {
        janjiPutar.catch(error => {
            console.log("Auto-play dicegah:", error);
            document.getElementById('activity-suggestion').textContent = "Klik play untuk memulai musik yang diupload.";
        });
    }
}

// Setup event listeners untuk tombol
function setupPendengarEvent() {
    const tombolMulai = document.getElementById('start-btn');
    const tombolHentikan = document.getElementById('stop-btn');
    const tombolCobaKamera = document.getElementById('retry-camera');
    const tombolModeDemo = document.getElementById('demo-mode');
    
    tombolMulai.addEventListener('click', mulaiAnalisis);
    tombolHentikan.addEventListener('click', hentikanAnalisis);
    
    // Event listeners untuk tombol fallback
    if (tombolCobaKamera) {
        tombolCobaKamera.addEventListener('click', cobaAksesKamera);
    }
    
    if (tombolModeDemo) {
        tombolModeDemo.addEventListener('click', mulaiModeDemo);
    }
    
    // Smooth scrolling untuk CTA button
    document.querySelector('.cta-button')?.addEventListener('click', function(e) {
        e.preventDefault();
        const sectionAnalisis = document.querySelector('#analyzer');
        if (sectionAnalisis) {
            const offsetTop = sectionAnalisis.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
}

// Inisialisasi grid emosi
function inisialisasiGridEmosi() {
    const gridEmosi = document.getElementById('emotions-grid');
    const emosi = ['happy', 'sad', 'angry', 'neutral', 'surprised', 'fearful', 'disgusted'];
    
    gridEmosi.innerHTML = emosi.map(emosi => `
        <div class="emotion-item">
            <span class="emotion-label">${konfigurasiEmosi[emosi].label}</span>
            <div class="emotion-bar">
                <div class="emotion-fill" data-emotion="${emosi}" style="width: 0%"></div>
            </div>
            <span class="emotion-percent">0%</span>
        </div>
    `).join('');
}

// Coba akses kamera ulang
function cobaAksesKamera() {
    console.log('📷 Mencoba akses kamera lagi...');
    tampilkanOverlayVideo(true, 'Mencoba mengakses kamera...');
    mulaiAnalisis();
}

// Fungsi navigasi
function inisialisasiNavigasi() {
    const toggleNav = document.getElementById('nav-toggle');
    const menuNav = document.getElementById('nav-menu');
    
    if (toggleNav) {
        toggleNav.addEventListener('click', function() {
            menuNav.classList.toggle('active');
            toggleNav.classList.toggle('active');
            
            // Update aria-expanded
            const isExpanded = menuNav.classList.contains('active');
            toggleNav.setAttribute('aria-expanded', isExpanded);
            
            // Animasi hamburger icon
            const bars = document.querySelectorAll('.bar');
            if (menuNav.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }
    
    // Smooth scrolling untuk navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Tutup menu mobile jika terbuka
                if (menuNav.classList.contains('active')) {
                    menuNav.classList.remove('active');
                    toggleNav.classList.remove('active');
                    toggleNav.setAttribute('aria-expanded', 'false');
                    
                    // Reset hamburger icon
                    const bars = document.querySelectorAll('.bar');
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                }
            }
        });
    });
    
    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 26, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(10, 10, 26, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
    
    // Tutup menu ketika klik di luar
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-container') && menuNav.classList.contains('active')) {
            menuNav.classList.remove('active');
            toggleNav.classList.remove('active');
            toggleNav.setAttribute('aria-expanded', 'false');
            
            const bars = document.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });
}

// Animasi scroll
function inisialisasiAnimasiScroll() {
    const opsiObserver = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, opsiObserver);
    
    // Observe elements for animation
    document.querySelectorAll('.article-card, .team-member, .feature-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== FUNGSI DETEKSI WAJAH AI =====

// Memuat model face-api.js
async function muatModel() {
    try {
        updateStatus('Memuat model AI...', 'loading');
        tampilkanOverlayVideo(true, 'Memuat model AI...');
        
        console.log('🔄 Memulai loading model...');
        
        // Load model yang diperlukan - PATH SUDAH DIPERBAIKI
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
            faceapi.nets.faceExpressionNet.loadFromUri('./models')
        ]);
        
        modelDimuat = true;
        console.log('✅ Semua model berhasil dimuat');
        
        updateStatus('Model siap. Klik "Mulai Analisis"', 'ready');
        tampilkanOverlayVideo(false);
        
        // Enable tombol mulai
        document.getElementById('start-btn').disabled = false;
        
    } catch (error) {
        console.error('❌ Error loading models:', error);
        updateStatus('Error memuat model. Cek console untuk detail.', 'error');
        tampilkanOverlayVideo(true, 'Error: Model tidak ditemukan. Pastikan folder /models ada.');
        
        // Fallback untuk demo tanpa model
        setupModeDemo();
    }
}

// Setup demo mode jika model tidak tersedia
function setupModeDemo() {
    console.log('🔄 Setting up demo mode...');
    modelDimuat = true;
    updateStatus('Demo Mode: Klik "Mulai Analisis"', 'ready');
    tampilkanOverlayVideo(false);
    document.getElementById('start-btn').disabled = false;
}

// NEW: Timer untuk membatasi durasi analisis
function mulaiTimerAnalisis() {
    let waktuTersisa = 10;
    updateStatus(`Analisis berjalan: ${waktuTersisa} detik tersisa`, 'active');
    
    timerAnalisis = setInterval(() => {
        waktuTersisa--;
        updateStatus(`Analisis berjalan: ${waktuTersisa} detik tersisa`, 'active');
        
        if (waktuTersisa <= 0) {
            clearInterval(timerAnalisis);
            hentikanAnalisis();
            updateStatus('Analisis selesai (10 detik)', 'ready');
        }
    }, 1000);
}

// Memulai analisis
async function mulaiAnalisis() {
    if (!modelDimuat) {
        alert('Model AI belum siap. Tunggu hingga loading selesai.');
        return;
    }
    
    try {
        updateStatus('Mengakses kamera...', 'loading');
        tampilkanOverlayVideo(true, 'Mengakses kamera...');
        sembunyikanFallbackVideo();
        
        // Minta akses kamera
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            } 
        });
        
        video.srcObject = stream;
        
        // Tunggu video siap
        video.addEventListener('loadeddata', () => {
            console.log('📹 Kamera siap, memulai deteksi...');
            tampilkanOverlayVideo(false);
            mulaiDeteksi();
            
            // NEW: Mulai timer 10 detik
            mulaiTimerAnalisis();
            
            // Update UI
            document.getElementById('start-btn').disabled = true;
            document.getElementById('stop-btn').disabled = false;
        });
        
    } catch (error) {
        console.error('❌ Error accessing camera:', error);
        
        // Fallback untuk demo tanpa kamera
        if (error.name === 'NotAllowedError' || error.name === 'NotFoundError') {
            tampilkanFallbackVideo();
            updateStatus('Akses kamera ditolak', 'error');
        } else {
            handleErrorKamera(error);
        }
    }
}

// Demo mode tanpa kamera
function mulaiModeDemo() {
    console.log('🎮 Starting demo mode without camera...');
    updateStatus('Demo Mode: Simulasi Deteksi Emosi', 'active');
    tampilkanOverlayVideo(false);
    sembunyikanFallbackVideo();
    
    // Update UI
    document.getElementById('start-btn').disabled = true;
    document.getElementById('stop-btn').disabled = false;
    
    // NEW: Mulai timer 10 detik untuk demo juga
    mulaiTimerAnalisis();
    
    // Start simulated detection
    mulaiDeteksiSimulasi();
}

// Simulasi deteksi untuk demo
function mulaiDeteksiSimulasi() {
    if (analisisBerjalan) return;
    
    analisisBerjalan = true;
    console.log('🎭 Memulai simulasi deteksi emosi...');
    
    const emosi = ['happy', 'sad', 'angry', 'neutral', 'surprised'];
    let indexEmosiSaatIni = 0;
    
    intervalDeteksi = setInterval(() => {
        if (!analisisBerjalan) return;
        
        const emosiSaatIni = emosi[indexEmosiSaatIni];
        const emosi = konfigurasiEmosi[emosiSaatIni];
        
        // Update jumlah wajah
        updateJumlahWajah(1);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Gambar wajah simulasi
        gambarWajahSimulasi(emosiSaatIni);
        
        // Proses emosi
        const ekspresiSimulasi = {
            happy: Math.random() * 0.8 + 0.2,
            sad: Math.random() * 0.3,
            angry: Math.random() * 0.2,
            neutral: Math.random() * 0.4,
            surprised: Math.random() * 0.3,
            fearful: Math.random() * 0.2,
            disgusted: Math.random() * 0.1
        };
        
        // Normalisasi
        const total = Object.values(ekspresiSimulasi).reduce((a, b) => a + b, 0);
        for (let key in ekspresiSimulasi) {
            ekspresiSimulasi[key] /= total;
        }
        
        prosesEmosi([{ expressions: ekspresiSimulasi }]);
        
        // Cycle through emotions
        indexEmosiSaatIni = (indexEmosiSaatIni + 1) % emosi.length;
        
    }, 2000); // NEW: Lebih cepat untuk demo (2 detik per perubahan)
}

// Gambar wajah simulasi untuk demo
function gambarWajahSimulasi(emosi) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radiusWajah = 100;
    
    // Gambar lingkaran wajah
    ctx.beginPath();
    ctx.arc(centerX, centerY, radiusWajah, 0, 2 * Math.PI);
    ctx.strokeStyle = konfigurasiEmosi[emosi].color;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Gambar mata
    ctx.beginPath();
    ctx.arc(centerX - 30, centerY - 20, 15, 0, 2 * Math.PI);
    ctx.arc(centerX + 30, centerY - 20, 15, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Gambar mulut berdasarkan emosi
    ctx.beginPath();
    if (emosi === 'happy') {
        ctx.arc(centerX, centerY + 20, 30, 0, Math.PI);
    } else if (emosi === 'sad') {
        ctx.arc(centerX, centerY + 40, 30, Math.PI, 2 * Math.PI);
    } else if (emosi === 'angry') {
        ctx.moveTo(centerX - 25, centerY + 20);
        ctx.lineTo(centerX + 25, centerY + 20);
    } else {
        ctx.moveTo(centerX - 25, centerY + 20);
        ctx.lineTo(centerX + 25, centerY + 20);
    }
    ctx.stroke();
    
    // Gambar label emosi
    ctx.fillStyle = konfigurasiEmosi[emosi].color;
    ctx.font = 'bold 16px Poppins';
    ctx.fillText(konfigurasiEmosi[emosi].label, centerX - 30, centerY - 120);
}

// Menghentikan analisis
function hentikanAnalisis() {
    // NEW: Hentikan timer analisis
    if (timerAnalisis) {
        clearInterval(timerAnalisis);
        timerAnalisis = null;
    }
    
    if (intervalDeteksi) {
        clearInterval(intervalDeteksi);
        intervalDeteksi = null;
    }
    
    analisisBerjalan = false;
    
    // Stop video stream
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.srcObject = null;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Tampilkan wawasan psikologis setelah analisis dihentikan
    if (emosiTerakhirTerdeteksi) {
        tampilkanWawasanPascaAnalisis(emosiTerakhirTerdeteksi, kepercayaanEmosiTerakhir);
    }
    
    // Reset UI
    updateStatus('Analisis selesai (10 detik)', 'ready');
    tampilkanOverlayVideo(true, 'Analisis selesai (10 detik)');
    
    // Update tombol
    document.getElementById('start-btn').disabled = false;
    document.getElementById('stop-btn').disabled = true;
}

// Tampilkan wawasan psikologis setelah analisis dihentikan
function tampilkanWawasanPascaAnalisis(jenisEmosi, kepercayaan) {
    const emosi = konfigurasiEmosi[jenisEmosi];
    if (!emosi) return;
    
    const persenKepercayaan = Math.round(kepercayaan * 100);
    const wawasanAcak = emosi.wawasanPascaAnalisis[Math.floor(Math.random() * emosi.wawasanPascaAnalisis.length)];
    
    const teksWawasan = document.getElementById('insight-text');
    teksWawasan.innerHTML = `
        <div class="post-analysis-result">
            <div class="result-header">
                <strong>Hasil Analisis 10 Detik:</strong>
                <span class="emotion-badge" style="background: ${emosi.color}20; color: ${emosi.color}; border: 1px solid ${emosi.color}40;">
                    ${emosi.icon} ${emosi.label} (${persenKepercayaan}%)
                </span>
            </div>
            <div class="result-insight">
                ${wawasanAcak}
            </div>
            <div class="result-suggestion">
                <i class="fas fa-lightbulb" style="color: var(--primary-color);"></i>
                <strong>Saran:</strong> ${dapatkanSaranPascaAnalisis(jenisEmosi)}
            </div>
        </div>
    `;
    
    // Animasi teks
    teksWawasan.style.opacity = '0';
    setTimeout(() => {
        teksWawasan.style.opacity = '1';
        teksWawasan.style.transition = 'opacity 0.5s ease';
    }, 10);
}

// Dapatkan saran berdasarkan emosi
function dapatkanSaranPascaAnalisis(jenisEmosi) {
    const saran = {
        happy: "Lanjutkan aktivitas yang membahagiakan dan bagikan energi positifmu!",
        sad: "Luangkan waktu untuk self-care dan pertimbangkan untuk berbicara dengan teman atau profesional.",
        angry: "Coba teknik relaksasi atau olahraga untuk menyalurkan energi dengan sehat.",
        fearful: "Hadapi ketakutan secara bertahap dan ingat bahwa kamu lebih kuat dari yang kamu kira.",
        surprised: "Manfaatkan energi kejutan ini untuk eksplorasi dan pembelajaran baru.",
        disgusted: "Hormati batasan personalmu dan cari lingkungan yang mendukung nilai-nilaimu.",
        neutral: "Gunakan ketenangan ini untuk perencanaan dan refleksi yang produktif."
    };
    
    return saran[jenisEmosi] || "Terus lanjutkan praktik mindfulness dan perawatan diri.";
}

// Memulai deteksi wajah
function mulaiDeteksi() {
    if (analisisBerjalan) return;
    
    analisisBerjalan = true;
    console.log('🔍 Memulai deteksi wajah real-time...');
    
    intervalDeteksi = setInterval(async () => {
        if (!analisisBerjalan) return;
        
        try {
            // Deteksi wajah dengan ekspresi dan landmark
            const deteksi = await faceapi
                .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions();
            
            // Update jumlah wajah
            updateJumlahWajah(deteksi.length);
            
            // Bersihkan canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Gambar hasil deteksi
            if (deteksi.length > 0) {
                gambarDeteksi(deteksi);
                prosesEmosi(deteksi);
            } else {
                tampilkanTidakAdaWajah();
            }
            
        } catch (error) {
            console.error('❌ Error dalam deteksi:', error);
        }
    }, 100);
}

// Menggambar deteksi di canvas
function gambarDeteksi(deteksi) {
    // Resize detections ke ukuran canvas
    const deteksiDiubah = faceapi.resizeResults(deteksi, {
        width: canvas.width,
        height: canvas.height
    });
    
    // Gambar bounding box dan landmarks
    faceapi.draw.drawDetections(canvas, deteksiDiubah);
    faceapi.draw.drawFaceLandmarks(canvas, deteksiDiubah);
    
    // Gambar ekspresi untuk setiap wajah
    deteksiDiubah.forEach(detection => {
        const { expressions } = detection;
        const ekspresiDominan = dapatkanEkspresiDominan(expressions);
        const emosi = konfigurasiEmosi[ekspresiDominan];
        
        if (emosi) {
            const box = detection.detection.box;
            
            // Gambar label ekspresi
            ctx.fillStyle = emosi.color;
            ctx.font = 'bold 16px Poppins';
            ctx.fillText(emosi.label, box.x, box.y - 10);
        }
    });
}

// ===== FUNGSI PEMROSESAN EMOSI =====

// Memproses dan menampilkan hasil emosi
function prosesEmosi(deteksi) {
    if (deteksi.length === 0) return;
    
    // Ambil deteksi pertama (asumsi satu wajah)
    const detection = deteksi[0];
    const expressions = detection.expressions;
    
    // Dapatkan emosi dominan
    const ekspresiDominan = dapatkanEkspresiDominan(expressions);
    const emosi = konfigurasiEmosi[ekspresiDominan];
    
    if (emosi) {
        // Simpan emosi terakhir
        emosiTerakhirTerdeteksi = ekspresiDominan;
        kepercayaanEmosiTerakhir = expressions[ekspresiDominan];
        
        // Update emosi dominan
        updateEmosiDominan(emosi, expressions[ekspresiDominan]);
        
        // Update detail semua emosi
        updateDetailEmosi(expressions);
        
        // Berikan interpretasi psikologis
        berikanWawasanPsikologis(emosi);
        
        // Mulai fitur terapi
        mulaiTerapiMusik(ekspresiDominan);
        setupLatihan(ekspresiDominan);
    }
}

// Mendapatkan emosi dominan
function dapatkanEkspresiDominan(expressions) {
    let probabilitasMaksimal = 0;
    let ekspresiDominan = 'neutral';
    
    for (const expression in expressions) {
        if (expressions[expression] > probabilitasMaksimal) {
            probabilitasMaksimal = expressions[expression];
            ekspresiDominan = expression;
        }
    }
    
    return ekspresiDominan;
}

// Update emosi dominan di UI
function updateEmosiDominan(emosi, kepercayaan) {
    const persenKepercayaan = Math.round(kepercayaan * 100);
    
    document.getElementById('emotion-icon').textContent = emosi.icon;
    document.getElementById('emotion-name').textContent = emosi.label;
    document.getElementById('emotion-confidence').textContent = `${persenKepercayaan}% confidence`;
    
    // Animasi perubahan
    const iconEmosi = document.getElementById('emotion-icon');
    iconEmosi.style.animation = 'none';
    setTimeout(() => {
        iconEmosi.style.animation = 'bounce 2s infinite';
    }, 10);
}

// Update detail semua emosi
function updateDetailEmosi(expressions) {
    for (const expression in expressions) {
        const emosi = konfigurasiEmosi[expression];
        if (!emosi) continue;
        
        const kepercayaan = expressions[expression];
        const persen = Math.round(kepercayaan * 100);
        
        const elemenFill = document.querySelector(`[data-emotion="${expression}"]`);
        const elemenPersen = elemenFill.parentElement.nextElementSibling;
        
        // Animate percentage change
        elemenFill.style.width = `${persen}%`;
        elemenPersen.textContent = `${persen}%`;
        
        // Add color animation
        elemenFill.style.background = `linear-gradient(90deg, ${emosi.color}, ${emosi.color}dd)`;
    }
}

// Memberikan interpretasi psikologis
function berikanWawasanPsikologis(emosi) {
    const teksWawasan = document.getElementById('insight-text');
    const wawasanAcak = emosi.wawasan[Math.floor(Math.random() * emosi.wawasan.length)];
    
    teksWawasan.textContent = wawasanAcak;
    
    // Animasi teks
    teksWawasan.style.opacity = '0';
    setTimeout(() => {
        teksWawasan.style.opacity = '1';
        teksWawasan.style.transition = 'opacity 0.5s ease';
    }, 10);
}

// ===== FUNGSI TERAPI MUSIK & LATIHAN =====

// Memulai terapi musik
function mulaiTerapiMusik(emosi) {
    const terapi = konfigurasiTerapi[emosi];
    if (!terapi) return;
    
    // Update pesan
    document.getElementById('therapy-message').textContent = terapi.pesan;
    document.getElementById('activity-suggestion').textContent = terapi.aktivitas;
    
    // Setup music player
    const pemutarMusik = document.getElementById('music-player');
    const elemenAudio = document.getElementById('therapy-audio');
    
    // Pilih track random
    const trekAcak = terapi.trek[Math.floor(Math.random() * terapi.trek.length)];
    
    // Gunakan file lokal (path relatif)
    elemenAudio.src = trekAcak.file;
    elemenAudio.volume = 0.7;
    
    pemutarMusik.style.display = 'block';
    
    // Coba auto-play
    const janjiPutar = elemenAudio.play();
    if (janjiPutar !== undefined) {
        janjiPutar.catch(error => {
            console.log("Auto-play dicegah:", error);
            document.getElementById('activity-suggestion').textContent += " Klik play untuk memulai musik.";
        });
    }
}

// Setup latihan
function setupLatihan(emosi) {
    const terapi = konfigurasiTerapi[emosi];
    if (!terapi || !terapi.latihan) return;
    
    const sectionLatihan = document.getElementById('quick-exercise');
    const langkahLatihan = document.getElementById('exercise-steps');
    
    // Tampilkan section latihan
    sectionLatihan.style.display = 'block';
    
    // Isi langkah-langkah
    langkahLatihan.innerHTML = terapi.latihan.langkah
        .map((langkah, index) => `<p>${index + 1}. ${langkah}</p>`)
        .join('');
    
    // Setup timer
    waktuLatihanSaatIni = terapi.latihan.durasi;
    updateDisplayTimer();
    
    // Event listener untuk start exercise
    const tombolMulai = document.getElementById('start-exercise');
    tombolMulai.onclick = mulaiTimerLatihan;
    tombolMulai.disabled = false;
    tombolMulai.textContent = 'Mulai Latihan';
}

// Memulai timer latihan
function mulaiTimerLatihan() {
    const tombolMulai = document.getElementById('start-exercise');
    const displayTimer = document.getElementById('timer-display');
    
    tombolMulai.disabled = true;
    tombolMulai.textContent = 'Sedang Berjalan...';
    
    timerLatihan = setInterval(() => {
        waktuLatihanSaatIni--;
        updateDisplayTimer();
        
        if (waktuLatihanSaatIni <= 0) {
            clearInterval(timerLatihan);
            tombolMulai.disabled = false;
            tombolMulai.textContent = 'Selesai! Mulai Ulang?';
            displayTimer.textContent = "Selesai! 🎉";
        }
    }, 1000);
}

// Update display timer
function updateDisplayTimer() {
    const menit = Math.floor(waktuLatihanSaatIni / 60);
    const detik = waktuLatihanSaatIni % 60;
    document.getElementById('timer-display').textContent = 
        `${menit.toString().padStart(2, '0')}:${detik.toString().padStart(2, '0')}`;
}

// ===== FUNGSI UTILITAS =====

// Menampilkan pesan ketika tidak ada wajah terdeteksi
function tampilkanTidakAdaWajah() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '18px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText('Wajah belum terdeteksi', canvas.width / 2, canvas.height / 2);
    ctx.fillText('Pastikan pencahayaan cukup', canvas.width / 2, canvas.height / 2 + 30);
    ctx.textAlign = 'left';
}

// Reset hasil analisis
function resetHasil() {
    document.getElementById('emotion-icon').textContent = '😊';
    document.getElementById('emotion-name').textContent = '-';
    document.getElementById('emotion-confidence').textContent = '-';
    document.getElementById('insight-text').textContent = 'Mulai analisis untuk mendapatkan wawasan tentang kondisi emosional Anda.';
    
    // Reset emotion bars
    document.querySelectorAll('.emotion-fill').forEach(fill => {
        fill.style.width = '0%';
    });
    document.querySelectorAll('.emotion-percent').forEach(percent => {
        percent.textContent = '0%';
    });
    
    // Reset therapy sections
    document.getElementById('music-player').style.display = 'none';
    document.getElementById('quick-exercise').style.display = 'none';
    document.getElementById('therapy-message').textContent = 
        'Mulai analisis untuk mendapatkan saran terapi personal';
    
    if (timerLatihan) {
        clearInterval(timerLatihan);
        timerLatihan = null;
    }
}

// Update status sistem
function updateStatus(pesan, status) {
    const teksStatus = document.getElementById('status-text');
    const titikStatus = document.getElementById('status-dot');
    
    teksStatus.textContent = pesan;
    
    // Update status dot color
    titikStatus.className = 'indicator-dot';
    if (status === 'loading') {
        titikStatus.classList.add('active');
    } else if (status === 'active') {
        titikStatus.classList.add('active');
    } else if (status === 'error') {
        titikStatus.style.background = '#e74c3c';
    }
}

// Update jumlah wajah terdeteksi
function updateJumlahWajah(jumlah) {
    const angkaJumlah = document.querySelector('.count-number');
    const labelJumlah = document.querySelector('.count-label');
    
    angkaJumlah.textContent = jumlah;
    labelJumlah.textContent = jumlah === 1 ? 'wajah terdeteksi' : 'wajah terdeteksi';
    
    // Animation
    angkaJumlah.style.transform = 'scale(1.2)';
    setTimeout(() => {
        angkaJumlah.style.transform = 'scale(1)';
    }, 200);
}

// Menampilkan/sembunyikan video overlay
function tampilkanOverlayVideo(tampilkan, pesan = '') {
    const overlay = document.getElementById('video-overlay');
    const teksLoading = document.getElementById('loading-text');
    
    if (tampilkan) {
        overlay.style.display = 'flex';
        teksLoading.textContent = pesan;
    } else {
        overlay.style.display = 'none';
    }
}

// Menampilkan video fallback
function tampilkanFallbackVideo() {
    const fallback = document.getElementById('video-fallback');
    fallback.style.display = 'flex';
}

// Menyembunyikan video fallback
function sembunyikanFallbackVideo() {
    const fallback = document.getElementById('video-fallback');
    fallback.style.display = 'none';
}

// Menangani error kamera
function handleErrorKamera(error) {
    let pesanError = 'Tidak dapat mengakses kamera. ';
    
    if (error.name === 'NotAllowedError') {
        pesanError = 'Akses kamera ditolak. Izinkan akses kamera untuk analisis.';
    } else if (error.name === 'NotFoundError') {
        pesanError = 'Tidak ada kamera yang ditemukan.';
    } else if (error.name === 'NotSupportedError') {
        pesanError = 'Browser tidak mendukung akses kamera.';
    }
    
    updateStatus(pesanError, 'error');
    tampilkanOverlayVideo(true, pesanError);
    
    // Reset UI
    document.getElementById('start-btn').disabled = false;
    document.getElementById('stop-btn').disabled = true;
}

// Cleanup ketika halaman ditutup
window.addEventListener('beforeunload', function() {
    hentikanAnalisis();
});