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
              <h2>${heading}</h2>
              
              <div class="specs-container">
                  <h3>Specifications</h3>
                  <ul class="specs-list">
                      ${sidebar.specs
                        .map(
                          (spec) => `
                          <li>
                              <span>${spec.label}</span>
                              <span>${spec.value}</span>
                          </li>
                      `,
                        )
                        .join("")}
                  </ul>
              </div>

              <div class="details-container">
                  <h3>${sidebar.details.title}</h3>
                  <p>${sidebar.details.description}</p>
                  
                  <h3>Features</h3>
                  <ul class="features-list">
                      ${sidebar.details.features
                        .map(
                          (feature) => `
                          <li>${feature}</li>
                      `,
                        )
                        .join("")}
                  </ul>
              </div>

              <div class="diagrams-container">
                  <h3>Connection Details</h3>
                  <p>${sidebar.diagrams.connection}</p>
                  <h3>Wiring Information</h3>
                  <p>${sidebar.diagrams.wiring}</p>
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
