 /* =========================================================
       CONFIGURATION
       ========================================================= */

    // Change this number whenever you need more or fewer links.
    const MAX_NUMBER = 31;

    // Base URL
    const BASE_URL = window.location.origin;


    /* =========================================================
       GENERATE LINKS
       ========================================================= */

    const linksContainer = document.getElementById("links");
    const countElement = document.getElementById("count");

    for (let number = MAX_NUMBER; number >= 1; number--) {

      const url = `${BASE_URL}/${number}/`;

      const link = document.createElement("a");

      link.className = "link-card";
      link.href = url;

      link.innerHTML = `
        <div class="number">
          ${number}
        </div>

        <div class="content">
          <div class="title">
            Crop Grid ${number}
          </div>

          <div class="url">
            ${url}
          </div>
        </div>

        <div class="arrow">
          ?
        </div>
      `;

      linksContainer.appendChild(link);
    }

    countElement.textContent =
      `${MAX_NUMBER} available ${MAX_NUMBER === 1 ? "link" : "links"}`;