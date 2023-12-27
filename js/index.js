function addLink() {
    var link = prompt("Enter a JSON link:");
    if (link) {
        // Check if the link starts with "https://"
        if (!link.startsWith("https://")) {
            // If not, add "https://" to the beginning of the link
            link = "https://" + link;
        }

        // Check if the link is in the default repos
        if (defaultRepos.includes(link)) {
            alert("This repo already exists in the default repos. Skipping.");
            return;
        }
        const savedLinks = getSavedLinksFromCookie() || new Set();

        // Check if the link is already in the set
        if (savedLinks.has(link)) {
            alert("This repo is already added.");
            return;
        }


        fetch(link)
            .then(response => response.json())
            .then(data => {
                // Save the link as a cookie
                saveLinkAsCookie(link);

                // Display the link
                displayLink(data, link);
            })
            .catch(error => console.error('Error fetching data:', error));
    }
}


function saveLinkAsCookie(link) {
    const savedLinks = getSavedLinksFromCookie() || new Set();
    savedLinks.add(link);

    // Set the cookie with the links array
    document.cookie = `jsonLinks=${encodeURIComponent(JSON.stringify(Array.from(savedLinks)))}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

function getSavedLinksFromCookie() {
    // Retrieve saved links from the cookie
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'jsonLinks') {
            return new Set(JSON.parse(decodeURIComponent(value)));
        }
    }
    return null;
}

// Load saved links when the page is loaded
document.addEventListener('DOMContentLoaded', function () {
    const savedLinks = getSavedLinksFromCookie();
    if (savedLinks) {
        savedLinks.forEach(link => {
            if(!defaultRepos.includes(link)) {
                fetch(link)
                .then(response => response.json())
                .then(data => displayLink(data, link))
                .catch(error => console.error('Error fetching data:', error));
            }
        });
    }
});

function loadRepo(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => displayLink(data, url))
        .catch(error => console.error('Error fetching data:', error));
}

function displayLink(data, url) {
    var linksContainer = document.getElementById("links-container");
    var linkItem = document.createElement("div");
    linkItem.className = "link-item";

    // Set custom data attribute to store the repo link
    linkItem.setAttribute("data-repo-link", url);

    linkItem.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default behavior for click event
        this.classList.toggle('active');
        var link = this.getAttribute('data-repo-link');
        window.location.href = `https://theresonanceteam.github.io/trollapps-web/repo/index.html?url=${encodeURIComponent(link)}`;
    });

    // Adding the link-item-content for better organization
    var linkItemContent = document.createElement("div");
    linkItemContent.className = "link-item-content";

    // Displaying the iconURL on the left
    var iconImage = document.createElement("img");
    if(data.name == "UTM Repository") {
        iconImage.src = "https://raw.githubusercontent.com/utmapp/UTM/main/Platform/Assets.xcassets/AppIcon.appiconset/Icon.png";
    } else if (data.name == "Provenance EMU") {
        iconImage.src = "https://provenance-emu.com/images/icons/icon.512x512.png";
    } else if (data.name == "Flyinghead") {
        iconImage.src = "https://github.com/flyinghead/flycast/raw/master/shell/linux/flycast.png";
    } else {
        iconImage.src = data.iconURL;
    }
    iconImage.alt = "Source Icon";
    linkItemContent.appendChild(iconImage);

    // Displaying the name of the source
    var sourceName = document.createElement("span");
    sourceName.textContent = data.name;
    sourceName.style.fontWeight = "bold";
    sourceName.style.marginLeft = "10px";
    sourceName.style.fontSize = "16px";
    sourceName.style.verticalAlign = "middle";
    linkItemContent.appendChild(sourceName);

    linkItem.appendChild(linkItemContent);

    // Adding the link-item-button
    var linkItemButton = document.createElement("div");
    linkItemButton.className = "link-item-button";
    linkItem.appendChild(linkItemButton);

    linksContainer.appendChild(linkItem);
}
