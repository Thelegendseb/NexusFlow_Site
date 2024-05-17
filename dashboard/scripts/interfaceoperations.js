// ======= SCROLL ENABLER =======

function makeScrollable(elementId, bottomOffset = 0) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id '${elementId}' not found.`);
        return;
    }

    // Get the parent element's height
    const parentHeight = element.parentElement.clientHeight;
    // Set the max-height of the element
    element.style.maxHeight = (parentHeight - bottomOffset) + 'px';

    // Apply custom scrollbar styles
    element.classList.add('custom-scrollbar');

    // Set overflow-y to auto
    element.style.overflowY = 'auto';

    // Set overflow-x to hidden
    element.style.overflowX = 'hidden';

    // when text is pasted into the element make it plain text
    // element.addEventListener('paste', function (e) {
    //     e.preventDefault();
    //     const text = e.clipboardData.getData('text/plain');
    //     element.innerText += text;
        
    //     const range = document.createRange();
    //     const selection = window.getSelection();
    //     range.setStart(element, element.childNodes.length);
    //     range.collapse(true);
    //     selection.removeAllRanges();
    //     selection.addRange(range);

    //     element.scrollTop = element.scrollHeight;

    // });
}

makeScrollable('note-editor', 50);
makeScrollable('note-viewer', 50);
makeScrollable('note-container', 30);
makeScrollable('starred-notes', 30);

// ======= STAR GROW EFFECT =======

const starleft = document.getElementById('star-left');
const starright = document.getElementById('star-right');

// event listener for hovering on element with id "starred-notes"
document.getElementById('starred-notes').addEventListener('mouseover', function (e) {
    starleft.style.transform = "translateX(-5px) translateY(-5px) scale(1.2) rotate(-25deg)"
    starright.style.transform = "translateX(5px) translateY(5px) scale(1.2) rotate(25deg)"
});

// event listener for moving mouse out of element with id "starred-notes"
document.getElementById('starred-notes').addEventListener('mouseout', function (e) {
    starleft.style.transform = "translateX(0) translateY(0) scale(1) rotate(-10deg)"
    starright.style.transform = "translateX(0) translateY(0) scale(1) rotate(10deg)"
});