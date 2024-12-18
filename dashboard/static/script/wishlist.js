let inputCounter;
let friendsCounter;

let inviteCode;
const BASE_URL = "http://127.0.0.1:8000/dashboard/list/";

document.addEventListener("DOMContentLoaded", function(){
    
    inputCounter = 0;
    inviteCode = getInviteCode();
    document.cookie = `invite_link=${inviteCode}; path=/; SameSite=Lax`
    copyButton_init();
    giftsInput_init();
    form_init();
    tabBtns_init();
})

function tabBtns_init(){
    try {
        let createTabBtn = document.querySelector(".createTabBtn")
        let joinTabBtn = document.querySelector(".joinTabBtn")
        createTabBtn.addEventListener("click", toggleCreateTab)
        joinTabBtn.addEventListener("click", toggleJoinTab)
        
    } catch {
        return
    }
    
}

function toggleCreateTab(event) {
    let isActive = event.target.classList.contains("activeTab");
    let joinTabBtn = document.querySelector(".joinTabBtn");
    let createTab = document.querySelector(".createTab");
    let joinTab = document.querySelector(".joinTab");
    console.log(isActive)
    event.target.classList.add("activeTab");
    joinTabBtn.classList.remove("activeTab")
    createTab.classList.remove("hidden")
    joinTab.classList.add("hidden")


}

function toggleJoinTab(event) {
    let isActive = event.target.classList.contains("activeTab");
    let createTabBtn = document.querySelector(".createTabBtn");
    let createTab = document.querySelector(".createTab");
    let joinTab = document.querySelector(".joinTab");
    event.target.classList.add("activeTab");
    createTabBtn.classList.remove("activeTab")
    createTab.classList.add("hidden")
    joinTab.classList.remove("hidden")
}


function copyButton_init()
{
    let copyButton = document.querySelector(".copyButton");
    try {
        copyButton.addEventListener('click', function(){
            navigator.clipboard.writeText(`${BASE_URL}${inviteCode}/`);
            let img = document.querySelector('#copyImg');
            img.setAttribute('src', '/static/img/check_box.svg');
            setTimeout(restoreCopyButton, 1000);
        })
    } catch {
        
    }
    
}


function giftsInput_init()
{
    let existingInputs = document.querySelectorAll(".giftInput");
    existingInputs.forEach(element => {
        element.addEventListener('input', handleInput);
        element.addEventListener('blur', handleBlur);
    });
}


function form_init()
{
    let form = document.querySelector(".wishListForm");
    let randomIndex = Math.floor(Math.random() * 6) + 1;
    
    let colorPickers = document.querySelectorAll(".colorCircle");
    let colorPickersInputs = document.querySelectorAll(".colorRadio");
    let is_colored = false;
    let colored;

    for(let i = 0; i < colorPickersInputs.length; i++){
        if (colorPickersInputs[i].getAttribute("checked") === "") {
            is_colored = true;
            colored = i;
        }
    }
    if (is_colored) 
        form.classList.add(`gradient${colored+1}`);
    colorPickers.forEach((element, index) => {
        element.addEventListener("click", function(){
            form.setAttribute("class", "wishListForm");
            form.classList.add(`gradient${index+1}`);
            colorPickersInputs[colored].removeAttribute("checked");
            colorPickersInputs[index].setAttribute("checked", true); 
        })
        if (!is_colored) {
                form.classList.add(`gradient${randomIndex}`);
                if (element.classList.contains(`gradient${randomIndex}`)) {
                    element.children[0].checked = true;
                }
            }        
    });

    let submitBtn = document.querySelector("#createWishListBtn");
    try {
        submitBtn.addEventListener('click', function(){
            if(form.checkValidity()){
                form.submit();
            }
            else {
                form.reportValidity();
            }
        })
    } catch  {
        
    }
    
}

function generateRandomBg(form, element)
{
    
}


function restoreCopyButton() 
{
    let img = document.querySelector('#copyImg');
    img.setAttribute('src', '/static/img/copy.svg');
}

function createNewInput() {
    inputCounter++;
    let newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.className = 'giftInput';
    newInput.name = `gift_${inputCounter}`;
    newInput.addEventListener('input', handleInput);
    newInput.addEventListener('blur', handleBlur);
    return newInput;
}

function handleInput(event) 
{
    let currentInput = event.target;
    let inputs = document.querySelectorAll('.giftInput');
    const giftForm = document.querySelector('.giftListForm');

    if (currentInput !== inputs[inputs.length - 1] || currentInput.value.trim() === '') {
        return;
    }

    if (currentInput.value.trim() !== '') {
        giftForm.appendChild(createNewInput());
    }
}

function handleBlur(event) {
    let currentInput = event.target;
    let inputs = document.querySelectorAll('.giftInput');

    if (currentInput.value.trim() === '' && inputs.length > 1) {
        currentInput.remove();
    }
}

function createFriendInput() {
    let container = document.createElement('div');
    container.className = 'friendContainer';

    let input = document.createElement('input');
    input.type = 'text';
    input.className = 'friendHolder'
    input.name = `friend_${friendsCounter}`
    input.readOnly = true;

    let button = document.createElement('button');
    button.className = `deleteFriendButton_${friendsCounter}`
    button.type = 'button';

    let img = document.createElement('img');
    img.src = '/static/img/delete.svg';
    img.class = 'deleteFriendImg';

    button.appendChild(img);

    container.appendChild(input);
    container.appendChild(button);

    friendsCounter++;
    
    return container;
}


function getInviteCode()
{
    let source = document.querySelector("#inviteCode");
    try {
        return source.innerHTML;
    } catch {
        return "";
    }       
}