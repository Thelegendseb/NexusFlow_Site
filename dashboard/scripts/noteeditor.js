const nodeEditor = document.getElementById("note-editor");
const nodeViewer = document.getElementById("note-viewer");
const viewButton = document.getElementById("view-button");
const editButton = document.getElementById("edit-button");

// ============= MARKDOWN INJECTOR =============

new MutationObserver(function (mutations, observer) {
    observer.disconnect();
    nodeViewer.mdContent = markdownString;
    renderView();
  }).observe(nodeViewer, { attributes: true, attributeFilter: ['rendered'] });

// ============= PRISM LOADER =============

function renderView() {
    const mdBlock = nodeViewer;

    function setupCodeBlock(element) {
        element.style.width = 'max-content';
        element.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
        addCopyButton(element);
    }

    function addCopyButton(codeBlock) {
        const copyButton = document.createElement('button');
        copyButton.classList.add('copy-button', 'hidden');
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.title = 'Copy Code'; // Add tooltip text
        codeBlock.appendChild(copyButton);

        codeBlock.addEventListener('mouseenter', () => {
            copyButton.classList.remove('hidden');
        });

        codeBlock.addEventListener('mouseleave', () => {
            copyButton.classList.add('hidden');
        });

        copyButton.addEventListener('click', () => {
            const codeText = codeBlock.textContent.trim();
            navigator.clipboard.writeText(codeText);
            var originalText = copyButton.innerHTML;
            copyButton.innerHTML = 'Copied!';
            setTimeout(() => {
                copyButton.innerHTML = originalText;
            }, 1000);
        });
    }

    // setup MutationObserver to catch newly loaded elements
    new MutationObserver(function (mutations, observer) {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node instanceof HTMLElement) {
                    if (node.matches('pre')) {
                        setupCodeBlock(node);
                    }
                    for (const child of node.querySelectorAll('pre')) {
                        if (child instanceof HTMLElement) {
                            setupCodeBlock(child);
                        }
                    }
                }
            }
        }
    }).observe(mdBlock, { subtree: true, childList: true });

}

// ============= NOTE EDITOR SETTINGS =============

const settingsButton = document.getElementById("node-editor-settings-button");
const settingsMenu = document.getElementById("node-editor-settings-menu");

settingsButton.addEventListener("click", function() {
    if (settingsMenu.style.visibility === "visible") {
        settingsMenu.style.opacity = 0;
        setTimeout(() => {
            settingsMenu.style.visibility = "hidden";
        }, 500);
    } else {
        settingsMenu.style.visibility = "visible";
        settingsMenu.style.opacity = 1;
    }
});

var markdownString;

var viewMode = true;

viewButton.addEventListener("click", function() {
    // Code to handle the click event of view-button

    switchToViewMode();

});

editButton.addEventListener("click", function() {
    // Code to handle the click event of edit-button

    switchToEditMode();

});

function switchToViewMode() {
    if (viewMode) {
        return;
    }

    viewMode = true;

    markdownString = nodeEditor.innerText;

    editButton.style.backgroundColor = "transparent";
    viewButton.style.backgroundColor = "var(--light-blue)";

    nodeViewer.mdContent = nodeEditor.innerText;

    nodeEditor.style.display = "none";
    nodeViewer.style.display = "block";

}

function switchToEditMode() {
    if (!viewMode) {
        return;
    }

    viewMode = false;

    viewButton.style.backgroundColor = "transparent";
    editButton.style.backgroundColor = "var(--light-blue)";

    nodeEditor.innerText = markdownString;

    nodeEditor.style.display = "block";
    nodeViewer.style.display = "none";
}

export function InsertNote(text) {
    if (viewMode) {
        markdownString = text;
        nodeViewer.mdContent = text;
    } else {
        nodeEditor.innerText = text;
    }
    switchToEditMode();
    switchToViewMode();
}

export function GetNote() {
    if (viewMode) {
        return markdownString;
    } else {
        return nodeEditor.innerText;
    }
}