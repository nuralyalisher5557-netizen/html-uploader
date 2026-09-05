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



publishBtn.addEventListener("click", () => {

    const code =
        htmlCode.value.trim();

    if (!code) {

        alert(
            "Сначала вставьте HTML-код."
        );

        return;

    }

    alert(
        "Следующим шагом подключим настоящую публикацию в интернет."
    );

});