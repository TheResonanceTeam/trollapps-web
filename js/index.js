function addLink() {
    var link = prompt("Enter a JSON link:");
    if (link) {
      fetch(link)
        .then(response => response.json())
        .then(data => displayLink(data))
        .catch(error => console.error('Error fetching data:', error));
    }
}

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
        alert(this.getAttribute("data-repo-link"));
        this.classList.toggle('active');
    });
  
    // Adding the link-item-content for better organization
    var linkItemContent = document.createElement("div");
    linkItemContent.className = "link-item-content";
  
    // Displaying the iconURL on the left
    var iconImage = document.createElement("img");
    iconImage.src = data.iconURL;
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

  