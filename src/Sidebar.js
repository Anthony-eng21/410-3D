export class SidebarManager {
  constructor() {
    this.sidebar = document.getElementById("info-sidebar");
    this.content = this.sidebar.querySelector(".sidebar-content");
    this.closeButton = this.sidebar.querySelector(".close-button");

    this.closeButton.addEventListener("click", () => this.hide());

    // Close on click outside
    document.addEventListener("click", (e) => {
      if (
        !this.sidebar.contains(e.target) &&
        !e.target.closest(".marker") &&
        this.isVisible()
      ) {
        this.hide();
      }
    });
  }

  show(annotationData) {
    const { heading, sidebar } = annotationData;

    this.content.innerHTML = `
          <div class="sidebar-section">
              <h2 style="margin-bottom: 13px;">${sidebar.sidebarHeading}</h2>
              <span style="font-size: 15px;">${sidebar.subHeading ? sidebar.subHeading : ""}</span>
              <div style="margin-top: 20px;" class="specs-container">
                  <h2 style="margin-bottom: 10px;">${sidebar.specsHeading}</h2>
                  <ul class="specs-list">
                      ${sidebar.specs
                        .map(
                          (spec) => `
                          <li style="list-style-type: circle; margin: 0 0 5px 15px; line-height: 1.4em;">
                              <b><span>${spec.label}</span></b>
                              <span>${spec.value}</span>
                          </li>
                      `
                        )
                        .join("")}
                  </ul>
              </div>

              <div style="margin-top: 20px;" class="details-container">
                  <h2 style="margin: 0 0 10px 0;">${sidebar.details.title}</h2>
                  <blockquote style="margin: 15px 0 10px 0;">${sidebar.details.description}</blockquote>
                  
                  <ul class="features-list">
                      ${sidebar.details.features
                        .map(
                          (feature) => `
                          <li style="list-style-type: circle; margin: 0 0 8px 15px; line-height: 1.4em;">${feature}</li>
                      `
                        )
                        .join("")}
                  </ul>
                  <div class="consultation-btn-container">
                  <a class="consultation-btn" href="https://controlbyweb.com/custom-recommendation-2/" target="_blank" rel="noopener noreferrer">Schedule a Consultation</a>
                  </div>
              </div>
          </div>
      `;

    this.sidebar.classList.add("active");
  }

  hide() {
    this.sidebar.classList.remove("active");
  }

  isVisible() {
    return this.sidebar.classList.contains("active");
  }
}
