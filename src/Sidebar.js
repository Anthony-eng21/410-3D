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
              <h2 style="margin-bottom: 15px;">${sidebar.sidebarHeading}</h2>
              
              <div class="specs-container">
                  <h3 style="margin-bottom: 10px;">Specifications</h3>
                  <ul class="specs-list">
                      ${sidebar.specs
                        .map(
                          (spec) => `
                          <li style="margin-bottom: 5px;">
                              <b><span>${spec.label}</span></b>
                              <span>${spec.value}</span>
                          </li>
                      `,
                        )
                        .join("")}
                  </ul>
              </div>

              <div class="details-container">
                  <h3 style="margin: 10px 0 15px 0;">${sidebar.details.title}</h3>
                  <p style="margin-bottom: 15px;">${sidebar.details.description}</p>
                  
                  <ul class="features-list">
                      ${sidebar.details.features
                        .map(
                          (feature) => `
                          <li style="margin-bottom: 8px;">${feature}</li>
                      `,
                        )
                        .join("")}
                  </ul>
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
