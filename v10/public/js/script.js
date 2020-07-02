
//NAVBAR TOGGLER


let hamburgerBar = document.querySelector('.hamburger-bar');
let navLinks = document.querySelector('.navbar-links');
let links = document.querySelectorAll('.navbar-links li');
let navbarClose = document.getElementById('exit');
let popupErrorClose = document.querySelector('.close-icon');
let warningMessage = document.querySelector('.flash-warning');



hamburgerBar.addEventListener('click', function(e){
    console.log('working');
    navLinks.classList.toggle("open");
    hamburgerBar.classList.add("hide");
    e.preventDefault();
});

navbarClose.addEventListener('click', function(e) {
    console.log('exiting nav')
    navLinks.classList.toggle("open");
    hamburgerBar.classList.remove('hide');
    e.preventDefault();
});

//Timeline header animation

const navBar = document.querySelector('.navbar');
const imageContainer = document.querySelector('.container-image');
const slider = document.querySelector('.slider-container');
const logo = document.querySelector('#logo');
const navItem = document.querySelectorAll('.item');
const liquid = document.querySelector('.liquid-image');
const firstHeader = document.querySelector('.header-primary');
const subHeader = document.querySelector('.subheading');
const checkBtn = document.querySelector('.btn-check');


const timeline = new TimelineMax();

timeline.fromTo(imageContainer, 1, {height: '0%'}, {height: '90%', ease:Power2.easeInOut})
.fromTo(imageContainer, 1.2, {width: '100%'}, {width: '100%', ease:Power2.easeInOut})
.fromTo([slider, navBar], 1.2, {x: '-100%'}, {x: '0%', ease: Power2.easeInOut}, "-=1.1")
.fromTo(logo, 0.5, {opacity: 0, x:30}, {opacity: 1, x: 0}, "-=0.5")
.fromTo(navItem, 0.5, {opacity: 0, x:30}, {opacity: 1, x: 0}, "-=0.5")
.fromTo(liquid, 0.5, {opacity: 0, x:30}, {opacity: 1, x: 0}, "-=0.5")
.fromTo(firstHeader, 0.5, {opacity: 0, x:30}, {opacity: 1, x: 0}, "-=0.5")
.fromTo(subHeader, 0.5, {opacity: 0, x:30}, {opacity: 1, x: 0}, "-=0.5")
.fromTo(checkBtn, 0.5, {opacity: 0, x:30}, {opacity: 1, x: 0}, "-=0.5");
//LIQUID IMAGE

new hoverEffect({
    parent: document.querySelector('.liquid-image'),
    intensity: .3,
    image1: '../imgs/aye-captain.png',
    image2: '../imgs/black-mirror-bee.png',
    angle: Math.PI / 4,
    displacementImage: '../imgs/heightMap.png'

});

//hover effect

//when the user scroll down 20px from the top, the button shows. if it doesn't, style.display shows "none" and the button doesn't display
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if(document.body.scrollTop > 40 ||
    document.documentElement.scrollTop > 40) {
        document.getElementById("myBtn").style.display ="block";
    } else {
        document.getElementById("myBtn").style.display ="none";
    }
}

//when the user clicks on the button, the the function topFunction() is called and the page goes back to top 
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

popupErrorClose.addEventListener('click', closeWarning = (e) => {
    console.log(e)
    warningMessage.style.display = 'none'});




/*window.addEventListener("load", function () {
const loader = document.querySelector(".loader");
loader.className += " hidden"; // class "loader hidden"
});
     

function scrollWin(x,y) {
  window.scrollBy(x,y);
}*/

/*
const form = document.querySelector('.form');
const firstNameInput = document.querySelector('.first-name__input');
const lastNameInput = document.querySelector('.last-name__input');
const email = document.querySelector('.email-input');
const password = document.querySelector('.password-input');

// const submitBtn = document.querySelector('.submit-btn');
let warningFirstName = document.querySelector('.warning-first-name');
let warningLastName = document.querySelector('.warning-last-name');
let warningEmail = document.querySelector('.warning-email');
let warningPassword = document.querySelector('.warning-password');



let firstNameValidated = false
    lastNameValidated = false
    emailValidated = false
    passwordValidated = false
   

console.log(firstNameValidated, lastNameValidated)

let flag = false;
const toggle = () => {
  flag = !flag;
  return flag;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
});
firstNameInput.addEventListener('keyup', validateName = () => {
    let regex = /^[A-Za-z0-9]{3,16}$/g
    let input = firstNameInput.value;
    if(!input.match(regex)) {
        warningFirstName.textContent = 'First name must be alphanumeric and include 3 - 16 letters';
        firstNameInput.classList.add('warning-outline');
        firstNameInput.classList.remove('thicked');
        firstNameValidated = false
        validateForm();

        

    }  else{
        warningFirstName.textContent = "";
        firstNameInput.classList.add('thicked');
        firstNameValidated = true
        validateForm();

    }
  
})

lastNameInput.addEventListener('keyup', () => {
    let regex = /[A-Za-z0-9]{3,16}$/ig
    let input = lastNameInput.value;
    let match = input.match(regex);
    console.log(match)
    if(!input.match(regex)) {
        warningLastName.textContent = 'Last name must be alphanumeric and include 3 - 16 letters';
        lastNameInput.classList.add('warning-outline');
        lastNameInput.classList.remove('thicked');
        lastNameValidated = false
        validateForm();


    }  else{
        warningLastName.textContent = "";
        lastNameInput.classList.add('thicked');
        lastNameValidated = true
        validateForm();

    }
  
})

email.addEventListener('keyup', () => {
    let regex = /^[a-z0-9.-_]+@[a-z0-9.-_]+\.[a-z]{2,}$/ig;
    let text = email.value;
    let match = text.match(regex);
    console.log(match)
    if(!email.value.match(regex)) {
        warningEmail.textContent = 'Email must be a valid address, e.g. example@example.com';
        email.classList.add('warning-outline');
        email.classList.remove('thicked');
        emailValidated = false
        validateForm();

    } else {
        warningEmail.textContent = "";
        email.classList.add('thicked');
        emailValidated = true
        validateForm();

    }
  
})

password.addEventListener('keyup', () => {
    let regex = /[A-Z-a-z0-9\/@._$--]{6,20}$/g
    let input = password.value;
    let match = input.match(regex);
    console.log(match)
    if(!input.match(regex)) {
        warningPassword.textContent = 'Passord be alphanumeric and include 6 - 20 letters';
        password.classList.add('warning-outline');
        password.classList.remove('thicked');
        passwordValidated = false;
        validateForm();


    }  else{
        warningPassword.textContent = "";
        password.classList.add('thicked');
        passwordValidated = true;
        validateForm();
    }
  
})



    
    const validateForm = () => {
       
        if(firstNameValidated === true && lastNameValidated === true && emailValidated === true && passwordValidated === true && phoneValidated === true && bioValidated === true) {
            submitBtn.classList.add('validated');
            submitBtn.addEventListener('click', sendForm);
        } else {
            console.log('not validated')
            submitBtn.classList.remove('validated');
            submitBtn.removeEventListener('click', sendForm);


        }
    }

    const removeSend = () => submitBtn.removeEventListener('click', sendForm);


*/