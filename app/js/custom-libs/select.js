class Select {
  constructor(parent) {
    this.parent = parent;
    this.button = this.parent.querySelector("[data-select-btn]");
    this.list = this.parent.querySelector("[data-select-list]");
    this.inputs = this.list.querySelectorAll("[data-select-input]");
    this.placeInsert = this.parent.querySelector("[data-select-changing]");
    this.isDefaultText = this.button.hasAttribute("data-select-default");
    this.isClosing = this.parent.hasAttribute("data-close-on-select");
    this.choosenArray = [];
    this.insertText = "";
    this.optionText = null;
    this.init();
  }

  init() {
    this.getSelected();
    this.button.addEventListener("click", () => this.showSelectList());
    document.addEventListener("mouseup", (e) => this.hideOpenSelect(e));
    this.inputs.forEach((input) => {
      input.addEventListener("change", () => this.getSelected());
    });
  }

  getSelected() {
    this.choosenArray = [];
    this.inputs.forEach((option) => {
      this.optionText = option.closest("[data-select-option]");
      if (option.checked) {
        this.optionText.classList.add("active");
        this.choosenArray.push(this.optionText.textContent.trim());
      } else {
        this.optionText.classList.remove("active");
      }
    });

    if (this.choosenArray.length) {
      this.insertText = this.choosenArray.join("; ");
    } else if (this.isDefaultText) {
      this.insertText = this.button.getAttribute("data-select-default");
    }

    this.placeInsert.textContent = this.insertText;

    if (this.isClosing) {
      this.toggleSelect("remove");
    }
  }

  showSelectList() {
    if (this.button.classList.contains("open")) {
      this.toggleSelect("remove");
    } else {
      this.toggleSelect("add");
    }
  }

  hideOpenSelect(e) {
    if (this.button.classList.contains("open")) {
      const isSelect =
        e.target == this.parent || this.parent.contains(e.target);
      if (!isSelect) {
        this.toggleSelect("remove");
      }
    }
  }

  toggleSelect(status) {
    this.button.classList[status]("open");
    if (status === "add") {
      fadeIn({
        el: this.list,
        timeout: 350,
      });
    } else {
      fadeOut({
        el: this.list,
        timeout: 350,
      });
    }
  }
}
