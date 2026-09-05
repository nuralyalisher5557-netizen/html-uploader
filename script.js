const SUPABASE_URL = "https://gwbeexfmcvoiduimbzai.supabase.co";
const SUPABASE_KEY = "sb_publishable_iBAblEIPsL3n2rj4X4oW_Q_O8FplVee";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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

const projectTitle = document.getElementById("projectTitle");    

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
    const title = projectTitle.value.trim();

if (!title) {
    alert("Введите название проекта.");
    projectTitle.focus();
    return;
}
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
                title: title,
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

const imagesNavBtn = document.getElementById("imagesNavBtn");
const imageUploader = document.getElementById("imageUploader");

imagesNavBtn.onclick = () => {
    imageUploader.style.display = "block";
    imageUploader.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
};