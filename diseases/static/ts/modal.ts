const modal = document.querySelector(".modal") as HTMLDListElement;
const overlay = document.querySelector(".overlay") as HTMLDivElement;

const modalTitle = modal.querySelector(".modal-header .modal-title");
const closeButtons = modal.querySelectorAll(".modal-close") as NodeList;
const modalBody = modal.querySelector(".modal-body .modal-content");
const modalFooter = modal.querySelector(".modal-footer .action-buttons") as HTMLDivElement;

export const closeModal = (callback = () => {}) => {
  document.body.classList.remove("modal-open");
  overlay.classList.remove("modal-open");
  modal.classList.remove("open");

  callback();
};

const openModal = () => {
  document.body.classList.add("modal-open");
  overlay.classList.add("modal-open");
  modal.classList.add("open");
};

closeButtons.forEach(btn => {
  (btn as HTMLButtonElement).addEventListener("click", () => closeModal());
});

export const addFooterButtons = (buttons: Array<HTMLButtonElement>) => {
  modalFooter.innerHTML = "";
  buttons.forEach(btn => modalFooter.appendChild(btn));
};

export const showDiseaseModal = (title: string, html: string) => {
  modalTitle.innerHTML = title;
  modalBody.innerHTML = html;
  openModal();
};

export const showSymptomModal = () => {
  modalTitle.innerHTML = "New symptom";
  const html = `
  <form id="symptom-form"  class="feature-form">
    <fieldset>
      <legend>Register new medical symptom</legend>
      <div className="form-group">
        <label for="name">Name: </label>
        <input id="name" name="name" class="form-input" autocomplete="off" required/>
      </div>
      <div className="form-group">
        <label for="desc">Description: </label>
        <textarea id="desc" name="description" cols="30" rows="5"></textarea>
      </div>
    </fieldset>
  </form>
  `;
  modalBody.innerHTML = html;
  openModal();
};

export const showSignModal = () => {
  modalTitle.innerHTML = "New medical sign";
  const html = `
  <form id="sign-form" class="feature-form">
    <fieldset>
      <legend>Register new medical sign</legend>
      <div class="form-group">
        <label for="name">Name: </label>
        <input id="name" name="name" class="form-input" autocomplete="off" required/>
      </div>
      <div class="form-group">
        <label for="desc">Description: </label>
        <textarea id="desc" name="description"  cols="30" rows="5"></textarea>
      </div>
    </fieldset>
  </form>
  `;
  modalBody.innerHTML = html;
  openModal();
};
