let isAnimating = false;
/*************
 *  Section  *
 *************/
// Function to hide all sections except the one with the given ID
function hideSectionsExcept(sectionId) {
    if (isAnimating) return; // Exit if an animation is already in progress
    isAnimating = true;

    const sections = document.querySelectorAll(".content-section");

    // Wait for all fade-out animations to complete before showing the target section
    Promise.all(
        Array.from(sections).map((section) => {
            if (section.id === sectionId) {
                return fadeIn(section);
            } else if (section.style.display !== "none") {
                return fadeOut(section);
            }
        })
    ).then(() => {
        sections.forEach((section) => {
            if (section.id !== sectionId) {
                section.style.display = "none";
            }
        });
        const targetSection = document.getElementById(sectionId);
        targetSection.style.display = "block";
        isAnimating = false;
    });
}

// Function to show the selected section with fade-in and fade-out animations
function showSection(sectionId) {
    window.scrollTo(0, 0);
    hideSectionsExcept(sectionId);
}

function showCurrentSectionFromHash() {
    const currentHash = window.location.hash;
    const sectionId = currentHash ? currentHash.substring(1) : "home";

    // Remove the 'active' class from all menu links
    document.querySelectorAll("nav a").forEach((link) => {
        link.classList.remove("active");
    });

    // Add the 'active' class to the menu link corresponding to the current section
    const activeLink = document.querySelector(`nav a[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add("active");
    }

    showSection(sectionId);
}

// Function to handle menu link clicks
function handleMenuLinkClick(event) {
    event.preventDefault();
    const sectionId = this.getAttribute("href").substring(1);
    const targetSection = document.getElementById(sectionId);
    targetSection.scrollIntoView({ behavior: "smooth" });

    // Update the URL without reloading the page
    window.history.pushState(null, null, "#" + sectionId);

    // Show the corresponding section with animation
    showSection(sectionId);

    // Add the 'active' class to the clicked menu link
    document.querySelectorAll("nav a").forEach((link) => {
        link.classList.remove("active");
    });
    this.classList.add("active");
}

// Close the menu when a menu item is clicked
document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", () => {
        const nav = document.querySelector("nav");
        menuBtn.innerHTML = "☰";
        nav.classList.remove("menu-visible");
    });
});

// Show the current section from the URL hash on initial load
showCurrentSectionFromHash();

// Update the content when the URL hash changes (e.g., when switching to another tab)
window.addEventListener("hashchange", showCurrentSectionFromHash);

/*****************
 *  Fade In/Out  *
 *****************/
function fadeIn(element) {
    element.style.opacity = 0;
    element.style.display = "block";
    let opacity = 0;
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsedTime = currentTime - startTime;
        opacity = Math.min(1, elapsedTime / 500); // 500ms animation duration
        element.style.opacity = opacity;

        if (opacity < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

function fadeOut(element) {
    element.style.opacity = 1;
    let opacity = 1;
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsedTime = currentTime - startTime;
        opacity = Math.max(0, 1 - elapsedTime / 500); // 500ms animation duration
        element.style.opacity = opacity;

        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = "none";
        }
    }

    requestAnimationFrame(animate);
}

/*****************
 *  Menu Button  *
 *****************/
// Toggle the menu button
document.getElementById("menuBtn").addEventListener("click", () => {
    const nav = document.querySelector("nav");
    const overlay = document.querySelector(".overlay");

    nav.classList.toggle("menu-visible");
    overlay.classList.toggle("overlay-visible");
});

const menuBtn = document.getElementById("menuBtn");

menuBtn.addEventListener("click", function() {
    if (menuBtn.innerHTML === "☰") {
        menuBtn.innerHTML = "✕";
    } else {
        menuBtn.innerHTML = "☰";
    }
});

/************************
 *  Head Color Changer  *
 ************************/
function handleHeaderColorChange() {
    const header = document.querySelector("header");
    const menuBtn = document.querySelector("#menuBtn");
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Define the scroll threshold at which the color change occurs
    const scrollThreshold = 30;

    // Define colors for light mode and dark mode
    const lightModeColors = {
        bright: "rgb(245,245,245)",
        dark: "#1288F8",
        name: "rgb(245,245,245)"
    };

    const darkModeColors = {
        bright: "#051094",
        dark: "#022d36",
        name: "rgb(245,245,245)"
    };

    // Check if the body element has the "dark-mode" class
    const isDarkModeEnabled = document.body.classList.contains("dark-mode");

    // Calculate target colors based on scroll position and dark mode state
    const targetHeaderColor = scrollTop > scrollThreshold
        ? (isDarkModeEnabled ? darkModeColors.bright : lightModeColors.dark)
        : (isDarkModeEnabled ? darkModeColors.dark : lightModeColors.bright);

    const targetBtnBgColor = scrollTop > scrollThreshold
        ? (isDarkModeEnabled ? darkModeColors.bright : lightModeColors.dark)
        : (isDarkModeEnabled ? darkModeColors.dark : lightModeColors.bright);

    const targetBtnTextColor = scrollTop > scrollThreshold
        ? (isDarkModeEnabled ? darkModeColors.name : lightModeColors.bright)
        : (isDarkModeEnabled ? darkModeColors.name : lightModeColors.dark);

    const targetLinkColor = scrollTop > scrollThreshold
        ? (isDarkModeEnabled ? darkModeColors.name : lightModeColors.bright)
        : (isDarkModeEnabled ? darkModeColors.name : lightModeColors.dark);

    // Apply transitions and colors to elements
    header.style.transition = "background-color 0.3s ease, box-shadow 0.3s ease"; // Add box-shadow transition
    menuBtn.style.transition = "background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease"; // Add box-shadow transition
    document.querySelectorAll("name a").forEach(link => {
        link.style.transition = "color 0.3s ease";
    });

    header.style.backgroundColor = targetHeaderColor;
    menuBtn.style.backgroundColor = targetBtnBgColor;
    menuBtn.style.color = targetBtnTextColor;

    document.querySelectorAll("name a").forEach(link => {
        link.style.color = targetLinkColor;
    });

    // Add shadow to the header when scrolling down
    if (scrollTop > scrollThreshold) {
        header.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    } else {
        header.style.boxShadow = "none"; // Remove the shadow when at the top
    }
}

// Call the function initially and add a scroll event listener
handleHeaderColorChange();
window.addEventListener("scroll", handleHeaderColorChange);

/***************
 *  Scroll up  *
 ***************/
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

const backToTopButton = document.getElementById("backToTopBtn");

backToTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

/***************
 *  Dark Mode  *
 ***************/
function darkmode() {
    document.body.classList.toggle("dark-mode");
    // Call header color change function after toggling dark mode
    handleHeaderColorChange();
} 