const SUPABASE_URL = "https://gwbeexfmcvoiduimbzai.supabase.co";
const SUPABASE_KEY = "sb_publishable_iBAblEIPsL3n2rj4X4oW_Q_O8FplVee";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== CLOUDFLARE TURNSTILE =====
let turnstileToken = "";

function turnstileSuccess(token) {
    turnstileToken = token;
    console.log("Turnstile: проверка пройдена");
}

function turnstileExpired() {
    turnstileToken = "";
    console.log("Turnstile: срок проверки истёк");
}
async function verifyTurnstile() {
    if (!turnstileToken) {
        alert("Пожалуйста, пройдите проверку безопасности.");
        return false;
    }

    try {
        const response = await fetch(
            `${SUPABASE_URL}/functions/v1/verify-turnstile`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token: turnstileToken
                })
            }
        );

        const result = await response.json();

        if (!response.ok || result.success !== true) {
            alert("Проверка безопасности не пройдена. Попробуйте ещё раз.");
            return false;
        }

        return true;
    } catch (error) {
        console.error("Turnstile error:", error);
        alert("Не удалось выполнить проверку безопасности.");
        return false;
    }
}
const htmlCode =
    document.getElementById("htmlCode");

const pasteBtn =
    document.getElementById("pasteBtn");

const previewBtn =
    document.getElementById("previewBtn");

const downloadBtn =
    document.getElementById("downloadBtn");

const publishBtn =
    document.getElementById("publishBtn");

const previewSection =
    document.getElementById("previewSection");

const previewFrame =
    document.getElementById("previewFrame");
    
const publishResult =
    document.getElementById("publishResult");

const publishedUrl =
    document.getElementById("publishedUrl");

const openPublishedBtn =
    document.getElementById("openPublishedBtn");

const copyPublishedBtn =
    document.getElementById("copyPublishedBtn");

const htmlNavBtn = document.getElementById("htmlNavBtn");
const imagesNavBtn = document.getElementById("imagesNavBtn");
const modelsNavBtn = document.getElementById("modelsNavBtn");
const audioNavBtn = document.getElementById("audioNavBtn");

const navButtons = [
    htmlNavBtn,
    imagesNavBtn,
    modelsNavBtn,
    audioNavBtn
];

navButtons.forEach(button => {
    button.addEventListener("click", () => {
        navButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
    });
});

pasteBtn.addEventListener("click", async () => {

    try {

        const text =
            await navigator.clipboard.readText();

        htmlCode.value = text;

    } catch {

        alert(
            "Нажмите Ctrl + V, чтобы вставить код."
        );

    }

});



previewBtn.addEventListener("click", () => {

    const code =
        htmlCode.value.trim();

    if (!code) {

        alert(
            "Сначала вставьте HTML-код."
        );

        return;

    }

    previewSection.style.display =
        "block";

    previewFrame.srcdoc =
        code;

});



downloadBtn.addEventListener("click", () => {

    const code =
        htmlCode.value.trim();

    if (!code) {

        alert(
            "Сначала вставьте HTML-код."
        );

        return;

    }


    const blob =
        new Blob(
            [code],
            {
                type: "text/html;charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href =
        url;

    link.download =
        "project.html";


    document.body.appendChild(link);

    link.click();

    link.remove();


    URL.revokeObjectURL(url);

});



publishBtn.addEventListener("click", async () => {
    if (!(await verifyTurnstile())) return;
   
    const code = htmlCode.value.trim();

    if (!code) {
        alert("Сначала вставьте HTML-код.");
        return;
    }

    const slug =
        Date.now().toString(36) +
        Math.random().toString(36).substring(2, 8);

    const { data, error } = await supabaseClient
        .from("projects")
        .insert([
    {
        title: "HTML проект",
        html_code: code,
        slug: slug
    }
])
        .select();

    if (error) {
        console.error(error);
        alert("Ошибка публикации: " + error.message);
        return;
    }

 const publishedSlug = data[0].slug;

const publicUrl =
    `https://nuralyalisher5557-netizen.github.io/html-uploader/view.html?s=${publishedSlug}`;
publishResult.style.display = "block";
publishedUrl.value = publicUrl;

openPublishedBtn.onclick = () => {
    window.open(publicUrl, "_blank");
};

copyPublishedBtn.onclick = async () => {
    await navigator.clipboard.writeText(publicUrl);
    copyPublishedBtn.textContent = "✅ Ссылка скопирована";
};

});

// ================================
// ЗАГРУЗКА ИЗОБРАЖЕНИЙ
// ================================

const imageFile = document.getElementById("imageFile");
const uploadImageBtn = document.getElementById("uploadImageBtn");
const imageUploadStatus = document.getElementById("imageUploadStatus");
const imageResult = document.getElementById("imageResult");
const imageUrl = document.getElementById("imageUrl");
const copyImageUrlBtn = document.getElementById("copyImageUrlBtn");

uploadImageBtn.onclick = async () => {

   const file = imageFile.files[0];

if (!file) {
    alert("Выберите изображение");
    return;
}

// Максимальный размер изображения — 5 МБ
const maxImageSize = 5 * 1024 * 1024;

if (file.size > maxImageSize) {
    imageUploadStatus.textContent =
        "❌ Файл слишком большой. Максимальный размер изображения — 5 МБ.";
    return;
}

    imageUploadStatus.textContent = "⏳ Загружаем изображение...";

    const fileExt = file.name.split(".").pop();
    const fileName =
        Date.now() + "-" +
        Math.random().toString(36).substring(2) +
        "." + fileExt;

    const { data, error } = await supabaseClient
        .storage
        .from("images")
        .upload(fileName, file);

    if (error) {
        console.error(error);
        imageUploadStatus.textContent =
            "❌ Ошибка: " + error.message;
        return;
    }

    const { data: publicData } = supabaseClient
        .storage
        .from("images")
        .getPublicUrl(fileName);

    const publicUrl = publicData.publicUrl;

    imageUrl.value = publicUrl;
    imageResult.style.display = "block";

    imageUploadStatus.textContent =
        "✅ Изображение успешно загружено!";
};

copyImageUrlBtn.onclick = async () => {

    await navigator.clipboard.writeText(imageUrl.value);

    copyImageUrlBtn.textContent =
        "✅ Ссылка скопирована";

    setTimeout(() => {
        copyImageUrlBtn.textContent =
            "📋 Копировать ссылку";
    }, 2000);
};

// ================================
// КНОПКА "ИЗОБРАЖЕНИЯ"
// ================================

const imageUploader = document.getElementById("imageUploader");

imagesNavBtn.onclick = () => {
    imageUploader.style.display = "block";
    imageUploader.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
};
// ==============================
// АУДИО
// ==============================

const audioUploader = document.getElementById("audioUploader");

const audioFile = document.getElementById("audioFile");
const uploadAudioBtn = document.getElementById("uploadAudioBtn");
const audioUploadStatus = document.getElementById("audioUploadStatus");

const audioResult = document.getElementById("audioResult");
const audioUrl = document.getElementById("audioUrl");
const audioPlayer = document.getElementById("audioPlayer");
const copyAudioUrlBtn = document.getElementById("copyAudioUrlBtn");


// Открываем раздел "Аудио"
audioNavBtn.onclick = () => {

    audioUploader.style.display = "block";

    audioUploader.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
};


// ЗАГРУЗКА АУДИО В SUPABASE
uploadAudioBtn.onclick = async () => {

    const file = audioFile.files[0];

    const file = audioFile.files[0];

if (!file) {
    audioUploadStatus.textContent =
        "❌ Сначала выберите аудиофайл";
    return;
}

// Максимальный размер аудио — 10 МБ
const maxAudioSize = 10 * 1024 * 1024;

if (file.size > maxAudioSize) {
    audioUploadStatus.textContent =
        "❌ Файл слишком большой. Максимальный размер аудио — 10 МБ.";
    return;
}

audioUploadStatus.textContent =
    "⌛ Загружаем аудио...";

const extension = file.name.split(".").pop().toLowerCase();

const fileName =
    Date.now() + "-" +
    Math.random().toString(36).substring(2, 8) +
    "." + extension;

console.log("НОВОЕ ИМЯ АУДИО:", fileName);


    const { data, error } = await supabaseClient
        .storage
        .from("audio")
        .upload(fileName, file);


    if (error) {

        console.error(error);

        audioUploadStatus.textContent =
            "❌ Ошибка загрузки: " + error.message;

        return;
    }


    const { data: publicData } = supabaseClient
        .storage
        .from("audio")
        .getPublicUrl(fileName);


    const publicUrl = publicData.publicUrl;


    audioUrl.value = publicUrl;

    audioPlayer.src = publicUrl;

    audioResult.style.display = "block";

    audioUploadStatus.textContent =
        "✅ Аудио успешно загружено!";
};


// КОПИРОВАНИЕ ССЫЛКИ
copyAudioUrlBtn.onclick = async () => {

    await navigator.clipboard.writeText(
        audioUrl.value
    );

    copyAudioUrlBtn.textContent =
        "✅ Ссылка скопирована";

    setTimeout(() => {

        copyAudioUrlBtn.textContent =
            "📋 Копировать ссылку";

    }, 2000);
};
// ==============================
// 3D-МОДЕЛИ
// ==============================

const modelUploader = document.getElementById("modelUploader");

const modelFile = document.getElementById("modelFile");
const uploadModelBtn = document.getElementById("uploadModelBtn");
const modelUploadStatus = document.getElementById("modelUploadStatus");

const modelResult = document.getElementById("modelResult");
const modelUrl = document.getElementById("modelUrl");
const copyModelUrlBtn = document.getElementById("copyModelUrlBtn");

// Открываем раздел 3D-моделей
modelsNavBtn.onclick = () => {

    modelUploader.style.display = "block";

    modelUploader.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
};

// Загрузка 3D-модели
uploadModelBtn.onclick = async () => {

    const file = modelFile.files[0];

    if (!file) {
        modelUploadStatus.textContent =
            "❌ Сначала выберите файл 3D-модели";
        return;
    }

    // Максимальный размер 3D-модели — 20 МБ
    const maxModelSize = 20 * 1024 * 1024;

    if (file.size > maxModelSize) {
        modelUploadStatus.textContent =
            "❌ Файл слишком большой. Максимальный размер 3D-модели — 20 МБ.";
        return;
    }

    modelUploadStatus.textContent =
        "⌛ Загружаем 3D-модель...";

    const extension =
        file.name.split(".").pop().toLowerCase();

    const fileName =
        Date.now() + "-" +
        Math.random().toString(36).substring(2, 8) +
        "." + extension;

    console.log("НОВОЕ ИМЯ 3D:", fileName);

    const { data, error } = await supabaseClient
        .storage
        .from("models")
        .upload(fileName, file);

    if (error) {

        console.error(error);

        modelUploadStatus.textContent =
            "❌ Ошибка загрузки: " + error.message;

        return;
    }

    const { data: publicData } = supabaseClient
        .storage
        .from("models")
        .getPublicUrl(fileName);

    const publicUrl = publicData.publicUrl;

    modelUrl.value = publicUrl;

    modelResult.style.display = "block";

    modelUploadStatus.textContent =
        "✅ 3D-модель успешно загружена!";
};

// Копирование ссылки
copyModelUrlBtn.onclick = async () => {

    await navigator.clipboard.writeText(
        modelUrl.value
    );

    copyModelUrlBtn.textContent =
        "✅ Ссылка скопирована";

    setTimeout(() => {

        copyModelUrlBtn.textContent =
            "📋 Копировать ссылку";

    }, 2000);
};