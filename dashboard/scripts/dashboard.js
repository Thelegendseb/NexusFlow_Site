// Import node action functions
import { getRootNode,
        getNodeData,
        getChildrenNodes,
        getParentNode,
        addNode,
        deleteNode,
        editNode,
        getStarredNodes } from './../../scripts/nodeactions.js'; 

// import user action functions
import { logoutUser,
         deleteUser } from './../../scripts/useractions.js';

// Import DOM Factory functions
import { createTreeItem,
        createStarItem,
        createItemSeparator,
        createLoadingSpinner } from './../../scripts/domfactory.js'; 

// Import Note Editor functions
import { InsertNote, GetNote } from './noteeditor.js';

// Import Models
import { NexusNodeCreationDTO } from './../../models/nexusNodeCreationDTO.js';
import { NexusNodeDataDTO } from './../../models/nexusNodeDataDTO.js';

// ========================================================  

// define dropdown containers
const noteContainer = document.getElementById('note-container');
const starredNotes = document.getElementById('starred-notes');

// define note editor and viewer
const noteEditor = document.getElementById('note-editor');
const noteViewer = document.getElementById('note-viewer');

// define dashboard controls
const backButton = document.getElementById('back-button');
const createButton = document.getElementById('create-button');
const forwardButton = document.getElementById('forward-button');

// define user action controls
const accountButton = document.getElementById('account-button');
const logoutButton = document.getElementById('logout-button');
const deleteAccountButton = document.getElementById('delete-account-button');

// define current node controls
const currentNodeContainer = document.getElementById('current-node-container');
const currentNodeName = document.getElementById('current-node-name-text');
const currentNodeCreation = document.getElementById('current-node-creation-text');
const currentNodeModified = document.getElementById('current-node-modified-text');

const parenttext = document.getElementById('parent-text');

// get access token
const accessToken = localStorage.getItem('accessToken');

/* INITIAL LOADING SPINNERS */
let spinnerViewer = createLoadingSpinner();
noteViewer.appendChild(spinnerViewer);
let spinnerEditor = createLoadingSpinner();
noteEditor.appendChild(spinnerEditor);

// get root node
const rootNode = await getRootNode(accessToken);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var currentParentNode = null;
var currentlyViewingNode = null;
var currentlyViewingNodeData = null;

// ==================== EVENT LISTENER FUNCTIONS ====================
 
async function onClick_Name(domObject, node) {
    // Get the children of the clicked node
    const childrenNodes = await getChildrenNodes(accessToken, node.Id);
    // Render the children in the note layer
    renderNoteLayer(childrenNodes);
    // Set the parent text
    parenttext.innerText = textTrailer(node.Name, 15);
    // Save the current parent node
    currentParentNode = node;
}

async function onClick_Info(domObject, node) {
    let spinnerViewer = createLoadingSpinner();
    noteViewer.appendChild(spinnerViewer);
    let spinnerEditor = createLoadingSpinner();
    noteEditor.appendChild(spinnerEditor);

    // save previous note before overriting it
    await saveCurrentlyViewingNode();
    // Handle info button click
    let myNodeData = await getNodeData(accessToken, node.Id);

    spinnerViewer.remove();
    spinnerEditor.remove();

    InsertNote(myNodeData.Data);  
    currentlyViewingNode = node;
    currentlyViewingNodeData = myNodeData;
    updateCurrentlyViewingNote();
}

async function onClick_Star(domObject, node) {
    if (IsRoot(node)) {
        alert("You cannot un-star the root node.");
        return;
    }
    // Handle star button click
    const starIcon = domObject.querySelector('i');
    starIcon.classList.toggle('fa-regular');
    starIcon.classList.toggle('fa-solid');

    if (node.IsStarred) {
        // Remove from starred section
        let starredItem = document.getElementById("star_" + node.Id);
        console.log(starredItem);
        removeStarItem(starredItem);

    } else {
        // Add to starred section
        addItemToStarred(node);
    }
    const nodeDataResponse = await getNodeData(accessToken, node.Id);
    const editedNode = new NexusNodeCreationDTO(node.Name,
                                                nodeDataResponse.Data, 
                                                !node.IsStarred);
    // Edit the node
    await editNode(accessToken, node.Id, editedNode);
    node.IsStarred = !node.IsStarred;
}

async function onClick_Delete(domObject, node) {
    // Handle delete button click
    if (IsRoot(node.Id)) {
        alert("You cannot delete the root node.");
        return;
    }

    let confirmDelete = confirm("Are you sure you want to delete this node?");
    if (!confirmDelete) {
        return;
    }

    removeNoteItem(domObject);
    if (node.IsStarred) {
        let starredItem = document.getElementById("star_" + node.Id);
        removeStarItem(starredItem);
    }
    
    await deleteNode(accessToken, node.Id);

    if (currentlyViewingNode && currentlyViewingNode.Id == node.Id) {
        await onClick_Info(null, currentParentNode);
        await goBack();
    }
    
}

//  ================== NOTE NAVIGATION BUTTONS ==================

backButton.addEventListener('click', async function () {
    if (currentParentNode == null) {
        alert("You are already at the root node.");
        return;
    }

    await goBack();
});

async function goBack() {
    if (IsRoot(currentParentNode)) {
        noteContainer.innerHTML = '';
        addItemToDropdown(rootNode);
        parenttext.innerText = "None";
        currentParentNode = null;
        return;
    }

    const parentNode = await getParentNode(accessToken, currentParentNode.Id);
    const childrenNodes = await getChildrenNodes(accessToken, parentNode.Id);
    renderNoteLayer(childrenNodes);
    parenttext.innerText = parentNode.Name;
    currentParentNode = parentNode;
}

createButton.addEventListener('click', async function () {
    if (currentParentNode == null) {
        alert("You cannot create a node at the root level.");
        return;
    }
    let newNodeName = prompt("Enter the name of the new node:");
    if (newNodeName == null) {
        return;
    }

    let spinnerViewer = createLoadingSpinner();
    noteViewer.appendChild(spinnerViewer);
    let spinnerEditor = createLoadingSpinner();
    noteEditor.appendChild(spinnerEditor);

    saveCurrentlyViewingNode();
    let newNodeData = "# " + newNodeName;
    let newNode = new NexusNodeCreationDTO(newNodeName, newNodeData, false);
    let newNodeDTO = await addNode(accessToken, currentParentNode.Id, newNode);
    addItemToDropdown(newNodeDTO);

    spinnerViewer.remove();
    spinnerEditor.remove();

    InsertNote(newNodeData);
    currentlyViewingNode = newNodeDTO;
    currentlyViewingNodeData = new NexusNodeDataDTO(newNodeData, getCurrentDateTime(), getCurrentDateTime());
    updateCurrentlyViewingNote();
});

forwardButton.addEventListener('click', async function () {
    alert("Forward button is not available yet.");
});

// ================== CURRENT NOTE SETTINGS ==================

document.getElementById('savenote-button').addEventListener('click', async function () {
    currentlyViewingNodeData.LastModifiedDateTime = getCurrentDateTime();
    updateCurrentlyViewingNote();
    saveCurrentlyViewingNode();
});

document.getElementById('copynote-button').addEventListener('click', async function () {;
    navigator.clipboard.writeText(GetNote());
});

document.getElementById('editname-button').addEventListener('click', async function () {

    if (IsRoot(currentlyViewingNode)) {
        alert("You cannot edit the root node name.");
        return;
    }

    let newName = prompt("Enter the new name for the note:");
    if (newName == null) {
        return;
    }
    currentlyViewingNode.Name = newName;
    currentlyViewingNodeData.LastModifiedDateTime = getCurrentDateTime();
    updateCurrentlyViewingNote();
    let noteElement = document.getElementById(currentlyViewingNode.Id);
    if (noteElement) {
        noteElement.querySelector('.item-name').innerText = newName;
    }
    let starElement = document.getElementById("star_" + currentlyViewingNode.Id);
    if (starElement) {
        starElement.querySelector('.item-name').innerText = newName;
    }
    
    const nodeDataResponse = await getNodeData(accessToken, currentlyViewingNode.Id);
    const editedNode = new NexusNodeCreationDTO(newName,
                                                nodeDataResponse.Data, 
                                                currentlyViewingNode.IsStarred);
    await editNode(accessToken, currentlyViewingNode.Id, editedNode);

});

// ================== NOTE EDITOR ACTIONS ==================

document.getElementById('textsize-increase-button').addEventListener('click', function () {   
    const currentViewerFontSize = parseFloat(getComputedStyle(noteViewer).fontSize);
    if (currentViewerFontSize < 35) {
        noteViewer.style.fontSize = (currentViewerFontSize + 3) + 'px';
    }
    const currentEditorFontSize = parseFloat(getComputedStyle(noteEditor).fontSize);
    if (currentEditorFontSize < 45) {
        noteEditor.style.fontSize = (currentEditorFontSize + 3) + 'px';
    }
});

document.getElementById('textsize-decrease-button').addEventListener('click', function () {
    const currentViewerFontSize = parseFloat(getComputedStyle(noteViewer).fontSize);
    if (currentViewerFontSize > 13) {
        noteViewer.style.fontSize = (currentViewerFontSize - 3) + 'px';
    }
    const currentEditorFontSize = parseFloat(getComputedStyle(noteEditor).fontSize);
    if (currentEditorFontSize > 15) {
        noteEditor.style.fontSize = (currentEditorFontSize - 3) + 'px';
    }
});

// ================== USER ACTIONS ==================

accountButton.addEventListener('click', async function () {
    alert("Account settings are not available yet.");
});

logoutButton.addEventListener('click', async function () {
    await saveCurrentlyViewingNode();
    await logoutUser(accessToken);
    localStorage.clear();
    window.location.href = './../../login/login.html';
}
);

deleteAccountButton.addEventListener('click', async function () {
    // ask for confirmation
    let confirmDelete = confirm("Are you sure you want to delete your account? All of your notes will be lost.");
    if (!confirmDelete) {
        return;
    }
    await deleteUser(accessToken);
    localStorage.clear();
    window.location.href = './../../index.html';
});

// ================== UI  ACTIONS ==================

function renderNoteLayer(nodes) {
    noteContainer.innerHTML = '';
    nodes.forEach(node => {
        addItemToDropdown(node);
    });
}

function addItemToDropdown(node) {

    const maindropdown_item = createTreeItem(node);

    let itemName = maindropdown_item.querySelector('.item-name');

    itemName.textContent = textTrailer(node.Name, 17);

    let infoButton = maindropdown_item.querySelector('.info-button');
    let starButton = maindropdown_item.querySelector('.star-button');
    let deleteButton = maindropdown_item.querySelector('.delete-button');

    // ================== EVENT LISTENERS ==================

    itemName.addEventListener('click', async function () {
        await onClick_Name(this, node);
    });

    infoButton.addEventListener('click', async function () {
        await onClick_Info(this, node);
    });

    starButton.addEventListener('click', async function () {
        await onClick_Star(this, node);
    });

    deleteButton.addEventListener('click', async function () {
        await onClick_Delete(this, node);
    });

    if (noteContainer.childElementCount > 0) {
        noteContainer.appendChild(createItemSeparator());
    }
    noteContainer.appendChild(maindropdown_item);
    
}

function addItemToStarred(node) {
    const starred_item = createStarItem(node);

    let itemName = starred_item.querySelector('.item-name');

    itemName.textContent = textTrailer(node.Name, 18);

    let infoButton = starred_item.querySelector('.info-button');

    // ================== EVENT LISTENERS ==================

    itemName.addEventListener('click', async function () {
        await onClick_Name(this, node);
    }
    );

    infoButton.addEventListener('click', async function () {
        await onClick_Info(this, node);
    }
    );

    if (starredNotes.childElementCount > 0) {
        starredNotes.appendChild(createItemSeparator());
    }
    starredNotes.appendChild(starred_item);
}

function updateCurrentlyViewingNote() {
    currentNodeName.innerText = textTrailer(currentlyViewingNode.Name, 16);
    currentNodeCreation.innerText = currentlyViewingNodeData.CreatedDateTime;
    currentNodeModified.innerText = currentlyViewingNodeData.LastModifiedDateTime;
}

function removeNoteItem(domObject) {
    let parentElement = domObject.parentElement.parentElement;
    let grandParentElement = parentElement.parentElement;
    
    if (parentElement === grandParentElement.lastElementChild) {
        if (parentElement.previousElementSibling && 
            parentElement.previousElementSibling.classList.contains('item-separator')) {
            parentElement.previousElementSibling.remove();
        }
    } else {
        if (parentElement.nextElementSibling && 
            parentElement.nextElementSibling.classList.contains('item-separator')) {
            parentElement.nextElementSibling.remove();
        }
    }
    parentElement.remove();
}

function removeStarItem(domObject) {
    let parentElement = domObject;
    if (parentElement === starredNotes.lastElementChild) {
        if (parentElement.previousElementSibling && 
            parentElement.previousElementSibling.classList.contains('item-separator')) {
            parentElement.previousElementSibling.remove();
        }
    } else {
        if (parentElement.nextElementSibling && 
            parentElement.nextElementSibling.classList.contains('item-separator')) {
            parentElement.nextElementSibling.remove();
        }
    }
    parentElement.remove();
}

// ================== HELPERS ==================

// function disableBackButton() {
//     backButton.disabled = true;
//     let parent = backButton.parentElement;
//     for (let i = 0; i < parent.children.length; i++) {
//         const child = parent.children[i];
//         child.style.color = 'var(--dark-bone)';
//     }
// }

function IsRoot(node) {
    return node.Id == rootNode.Id;
}

async function saveCurrentlyViewingNode() {
    if (currentlyViewingNode) {
        let editedText = GetNote();
        let editedNode = new NexusNodeCreationDTO(currentlyViewingNode.Name, editedText, currentlyViewingNode.IsStarred);
        await editNode(accessToken, currentlyViewingNode.Id, editedNode);
    }
}

function getCurrentDateTime() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = dd + '/' + mm + '/' + yyyy;

    const hh = today.getHours();
    const min = today.getMinutes();
    const formattedTime = hh + ':' + min;

    return formattedToday + ' ' + formattedTime;
}

function textTrailer(text, length) {
    if (text.length > length) {
        return text.substring(0, length) + '...';
    }
    return text;
}

// ----------------- MAIN -----------------

/* INITIAL LOADING SPINNERS */
spinnerViewer.remove();
spinnerEditor.remove();

// Add the root node to the dropdown
addItemToDropdown(rootNode);

// Add the starred nodes to the starred section
const starredNodesArray = await getStarredNodes(accessToken);
starredNodesArray.forEach(node => {
    addItemToStarred(node);
});

let firsttime = localStorage.getItem('firsttimelogin');
firsttime = true; // for testing
if (firsttime) {
    await onClick_Info(null, rootNode);
    // Usage GUide
    localStorage.removeItem('firsttimelogin');
}

// ================== EXIT ==================

window.onbeforeunload = async function () {
    await saveCurrentlyViewingNode();
}