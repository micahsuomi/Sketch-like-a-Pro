

//NAVBAR TOGGLER


let hamburgerBar = document.querySelector('.hamburger-bar');
let navLinks = document.querySelector('.navbar-links');
let links = document.querySelectorAll('.navbar-links li');
let navbarClose = document.getElementById('exit');



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


/*window.addEventListener("load", function () {
const loader = document.querySelector(".loader");
loader.className += " hidden"; // class "loader hidden"
});
     

function scrollWin(x,y) {
  window.scrollBy(x,y);
}*/