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

const previewSection =
    document.getElementById("previewSection");

const previewFrame =
    document.getElementById("previewFrame");



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

    alert("Проект успешно сохранён в Supabase!");
    console.log("Опубликовано:", data);
});