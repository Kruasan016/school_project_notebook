document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("noteForm");
    const input = document.getElementById("noteInput");
    const categorySelect = document.getElementById("category");
    const notesList = document.getElementById("notesList");
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const filterButtons = document.querySelectorAll(".filters button");

    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    function saveNotes() {
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    function renderNotes(filter = "all") {
        notesList.innerHTML = "";
        notes.forEach((note, index) => {
            if (filter !== "all" && filter !== note.category && !(filter === "important" && note.important)) {
                return;
            }

            const li = document.createElement("li");
            li.classList.add("note");
            if (note.important) li.classList.add("important");

            li.innerHTML = `
                <div class="note-text-container" style="max-height: 50px;">
                    <span contenteditable="false" class="note-text">${note.text}</span>
                    <span contenteditable="false" class="note-text1"> (${note.category})</span>
                </div>

                <div>
                    <button class="edit"><img style='width: 16px;' src='img/Pencil.png'></button>
                    <button class="mark">${note.important ? "<img style='width: 16px;' src='img/GlowingStar.png'>" : "<img style='width: 16px;' src='img/Star.png'>"}</button>
                    <button class="delete"><img style='width: 16px;' src='img/Wastebasket.png'></button>
                </div>
            `;

            const textSpan = li.querySelector(".note-text");
            li.querySelector(".edit").addEventListener("click", () => {
                textSpan.contentEditable = textSpan.isContentEditable ? "false" : "true";
                textSpan.classList.toggle("editable");
                textSpan.focus();
            });

            textSpan.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    textSpan.contentEditable = textSpan.isContentEditable ? "false" : "true";
                    textSpan.classList.toggle("editable");
                    textSpan.focus();
                }
            });

            const MAX_CHAR_COUNT = 90;
            textSpan.addEventListener("input", () => {
                const textContent = textSpan.textContent;
                if (textContent.length > MAX_CHAR_COUNT) {
                    textSpan.textContent = textContent.substring(0, MAX_CHAR_COUNT);
                }
            });

            textSpan.addEventListener("blur", () => {
                note.text = textSpan.textContent.replace(` (${note.category})`, "");
                saveNotes();
            });

            li.querySelector(".mark").addEventListener("click", () => {
                note.important = !note.important;
                saveNotes();
                renderNotes(filter);
            });

            li.querySelector(".delete").addEventListener("click", () => {
                notes.splice(index, 1);
                saveNotes();
                renderNotes(filter);
            });

            notesList.appendChild(li);
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        notes.push({ text, category: categorySelect.value, important: false });
        saveNotes();
        renderNotes();
        input.value = "";
    });

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("filter-active"));
            button.classList.add("filter-active");
            renderNotes(button.dataset.filter);
        });
    });

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            themeIcon.src = "img/Moon1.png";
            localStorage.setItem("theme", "dark");
        } else {
            themeIcon.src = "img/Moon.png";
            localStorage.setItem("theme", "light");
        }
    });

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        themeIcon.src = "img/Moon1.png";
    }

    renderNotes();
});
