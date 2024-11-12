// sidebarManager.js
export class SidebarManager {
  constructor() {
    this.sidebar = document.getElementById("info-sidebar");
    this.titleElement = this.sidebar.querySelector(".sidebar-title");
    this.detailsElement = this.sidebar.querySelector(".sidebar-details");

    // Close sidebar when clicking outside
    document.addEventListener("click", (e) => {
      if (!this.sidebar.contains(e.target) && !e.target.closest(".marker")) {
        this.hide();
      }
    });
  }

  show(title, content) {
    this.titleElement.textContent = title;
    this.detailsElement.innerHTML = content;
    this.sidebar.classList.add("active");
  }

  hide() {
    this.sidebar.classList.remove("active");
  }

  isVisible() {
    return this.sidebar.classList.contains("active");
  }
}
