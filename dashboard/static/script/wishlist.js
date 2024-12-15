let inputCounter;
let friendsCounter;

let inviteCode;

document.addEventListener("DOMContentLoaded", function(){
    
    inputCounter = 0;
    inviteCode = getInviteCode();
    document.cookie = `invite_link=${inviteCode}; path=/; SameSite=Lax`
    copyButton_init();
    giftsInput_innit();
    form_init();
})

function copyButton_init()
{
    let copyButton = document.querySelector(".copyButton");
    copyButton.addEventListener('click', function(){
        navigator.clipboard.writeText(inviteCode);
        let img = document.querySelector('#copyImg');
        img.setAttribute('src', '/static/img/check_box.svg');
        setTimeout(restoreCopyButton, 1000);
    })
}


function giftsInput_innit()
{
    let firstInput = document.querySelector('#firstGift');
    firstInput.addEventListener('input', handleInput);
    firstInput.addEventListener('blur', handleBlur);
}


function form_init()
{
    let form = document.querySelector(".wishListForm");
    let randomIndex = Math.floor(Math.random() * 6) + 1;
    form.classList.add(`gradient${randomIndex}`);

    let colorPickers = document.querySelectorAll(".colorCircle");
    colorPickers.forEach((element, index) => {
        if (element.classList.contains(`gradient${randomIndex}`))
        {
            element.children[0].checked = true;
        }
        element.addEventListener("click", function(){
            form.setAttribute("class", "wishListForm");
            form.classList.add(`gradient${index+1}`);
        })
    });

    let submitBtn = document.querySelector("#createWishListBtn");
    submitBtn.addEventListener('click', function(){
        if(form.checkValidity()){
            form.submit();
        }
        else {
            form.reportValidity();
        }
    })
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
    return source.innerHTML;
}