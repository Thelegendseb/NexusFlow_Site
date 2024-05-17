/* <div id="XXXXXXXXXXXXXXXX" class="item">
    <div class="item-name">name</div>
    <div class="item-stretcher"></div>
    <div class="item-buttons">
        <button class="info-button">
            <i class="fa-solid fa-info-circle"></i>
        </button>
        <button class="star-button">
            <i class="fa fa-solid fa-star"></i> <!-- or <i class="fa fa-regular fa-star"></i> depending on the value of isStarred -->
        </button>
        <button class="delete-button">
            <i class="fa-solid fa-trash-alt"></i>
        </button>
    </div>
</div> */

export function createTreeItem(node) {
    const id = node.Id;
    const name = node.Name;
    const isStarred = node.IsStarred;
    // Create main div element with class "item"
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');
    itemDiv.id = id;

    // Create div element for item name with class "item-name"
    const nameDiv = document.createElement('div');
    nameDiv.classList.add('item-name');
    nameDiv.textContent = name;

    // Create div element for stretching with class "item-stretcher"
    const stretcherDiv = document.createElement('div');
    stretcherDiv.classList.add('item-stretcher');


    // Create div element for buttons with class "item-buttons"
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('item-buttons');

    // Create button for info with class "info-button"
    const infoButton = document.createElement('button');
    infoButton.classList.add('info-button');
    const infoIcon = document.createElement('i');
    infoIcon.classList.add('fa-solid', 'fa-info-circle');
    infoButton.appendChild(infoIcon);

    // Create button for star with class "star-button"
    const starButton = document.createElement('button');
    starButton.classList.add('star-button');
    const starIcon = document.createElement('i');
    starIcon.classList.add('fa', isStarred ? 'fa-solid' : 'fa-regular', 'fa-star');
    starButton.appendChild(starIcon);

    // Create button for delete with class "delete-button"
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa-solid', 'fa-trash-alt');
    deleteButton.appendChild(deleteIcon);

    // Append elements to buttonsDiv
    buttonsDiv.appendChild(infoButton);
    buttonsDiv.appendChild(starButton);
    buttonsDiv.appendChild(deleteButton);

    // Append elements to itemDiv
    itemDiv.appendChild(nameDiv);
    itemDiv.appendChild(stretcherDiv);
    itemDiv.appendChild(buttonsDiv);

    return itemDiv;
}

/* <div id="XXXXXXXXXXXXXXXX" class="item">
    <div class="item-name">name</div>
    <div class="item-stretcher"></div>
    <div class="item-buttons">
        <button class="info-button">
            <i class="fa-solid fa-info-circle"></i>
        </button>
    </div>
</div> */

export function createStarItem(node) {
    const id = "star_" + node.Id;
    const name = node.Name;
    // Create main div element with class "item"
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');
    itemDiv.id = id;

    // Create div element for item name with class "item-name"
    const nameDiv = document.createElement('div');
    nameDiv.classList.add('item-name');
    nameDiv.textContent = name;

    // Create div element for stretching with class "item-stretcher"
    const stretcherDiv = document.createElement('div');
    stretcherDiv.classList.add('item-stretcher');

    // Create div element for buttons with class "item-buttons"
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('item-buttons');

    // Create button for info with class "info-button"
    const infoButton = document.createElement('button');
    infoButton.classList.add('info-button');
    const infoIcon = document.createElement('i');
    infoIcon.classList.add('fa-solid', 'fa-info-circle');
    infoButton.appendChild(infoIcon);

    // Append elements to buttonsDiv
    buttonsDiv.appendChild(infoButton);

    // Append elements to itemDiv
    itemDiv.appendChild(nameDiv);
    itemDiv.appendChild(stretcherDiv);
    itemDiv.appendChild(buttonsDiv);

    return itemDiv;
}

/* <div class="item-separator"></div> */

export function createItemSeparator() {
    const separatorDiv = document.createElement('div');
    separatorDiv.classList.add('item-separator');
    return separatorDiv;
}

/*<div class="loading">
     <div class="loading-spinner"></div>
</div>*/
export function createLoadingSpinner(spinnerSize = 55) {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('loading');
    const spinnerDiv = document.createElement('div');
    spinnerDiv.style.width = `${spinnerSize}px`;
    spinnerDiv.style.height = `${spinnerSize}px`;
    spinnerDiv.classList.add('loading-spinner');
    loadingDiv.appendChild(spinnerDiv);
    return loadingDiv;
}
