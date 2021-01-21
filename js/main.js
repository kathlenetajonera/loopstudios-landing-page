const navicon = document.querySelector(".toggle-btn");
const mobileNav = document.querySelector(".mobile-menu");
const overlay = document.querySelector(".overlay");
const creationsContainer = document.querySelector("#creations-container");
let screenWidth = window.innerWidth;
const footerLogo = document.querySelector(".footer-logo");

createCreationsGrid();

navicon.addEventListener("click", toggleMobileNav);

function getData() {
    return new Promise((resolve, reject) => {
        fetch("/js/creations-data.json")
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(err => reject("could not fetch data", err));
    })
}

async function createCreationsGrid() {
    const creations = await getData();

    creations.map(creation => {
        creationsContainer.innerHTML += `
        <div class="card">
            <img src="${screenWidth < 768 ? creation.mobileImg : creation.desktopImg}" alt="${creation.imageTitle}">
            <h2>${creation.imageTitle}</h2>
            <div class="overlay"></div>
        </div>
        `
    }).join("");
}

function toggleMobileNav() {
    const toggleState = navicon.getAttribute("aria-expanded");

    if (toggleState == "false") {
        attrSetToTrue([navicon, mobileNav]);
        overlay.classList.add("active");
        disableBodyScroll();
    } else {
        attrSetToFalse([navicon, mobileNav]);
        overlay.classList.remove("active");
        enableBodyScroll();
    }
}

function attrSetToTrue(elem) {
    elem.forEach(el => el.setAttribute("aria-expanded", true));
}

function attrSetToFalse(elem) {
    elem.forEach(el => el.setAttribute("aria-expanded", false));
}

function disableBodyScroll() {
    const body = document.body;

    body.style.position = "fixed";
}

function enableBodyScroll() {
    const body = document.body;

    body.style.position = "";
}

window.addEventListener("resize", refresh);
window.addEventListener("scroll", () => {
	let scrollPosition = window.pageYOffset;

    sessionStorage.setItem("yPosition", scrollPosition)
})

function refresh() {
	const storage = sessionStorage.getItem("yPosition")

	if (storage) {
		document.location.reload();
		window.scrollTo(0, storage)
	} else {
		document.location.reload();
		window.scrollTo(0, 0)
    }
}


footerLogo.addEventListener("click", e => {
    e.preventDefault();
    smoothScroll(".hero")
})

function smoothScroll(target) {
    const targetElem = document.querySelector(target);
    const targetPosition = targetElem.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance =  targetPosition - startPosition;
    let duration = 800;
    let startTime;

    function animation(currentTime) {
        if (startTime === undefined) startTime = currentTime;
        
        const timeElapsed = currentTime - startTime;
        let animate = ease(timeElapsed, startPosition, distance, duration)
        window.scrollTo(0, animate);
      
        if (timeElapsed < duration) {
            requestAnimationFrame(animation)
        }
    }

    function ease(t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t*t + b;
        t -= 2;
        return c/2*(t*t*t + 2) + b;
    };

    requestAnimationFrame(animation)
}