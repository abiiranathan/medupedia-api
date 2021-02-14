import Feature from "./feature";
import { Disease, Diseases, Features, SignOrSymptom } from "./types";
import getDiseaseHTML from "./disease-template";
import { addFooterButtons, closeModal, showDiseaseModal } from "./modal";
import { saveNewSymptom } from "./api";

export const tabs = document.querySelectorAll(".tablinks") as NodeList;
export const tabWidget = document.querySelector(".tabWidget") as HTMLDivElement;

// symptoms
export const available_symptoms = document.getElementById(
  "available_symptoms"
) as HTMLSelectElement;
export const chosen_symptoms = document.getElementById("chosen_symptoms") as HTMLSelectElement;
export const filter_symptoms = document.getElementById("filter_symptoms") as HTMLInputElement;

export const addSymptomBtn = document.querySelector("button.arrow.right") as HTMLButtonElement;
export const rmvSymptomBtn = document.querySelector("button.arrow.left") as HTMLButtonElement;

// Signs
export const available_signs = document.getElementById("available_signs") as HTMLSelectElement;
export const chosen_signs = document.getElementById("chosen_signs") as HTMLSelectElement;
export const filter_signs = document.getElementById("filter_signs") as HTMLInputElement;

export const addSignBtn = document.querySelector("button.arrow.right.sign") as HTMLButtonElement;
export const rmvSignBtn = document.querySelector("button.arrow.left.sign") as HTMLButtonElement;

// diseases
export const searchInput = document.querySelector(".search-diseases") as HTMLInputElement;
export const diseaseList = document.querySelector("#disease_list") as HTMLUListElement;

export const addDiseaseForm = document.querySelector("#add-disease-form") as HTMLFormElement;

export const editForm = document.getElementById("edit-disease-form") as HTMLFormElement;

export const regSymptomBtn = document.querySelector(".add-symptom") as HTMLButtonElement;
export const regSignBtn = document.querySelector(".add-sign") as HTMLButtonElement;
export const header = document.querySelector("header") as HTMLDivElement;

let signs: Features, symptoms: Features, diseases: Disease[];

export const setDOMState = (newDiseases: Diseases, newSymptoms: Features, newSigns: Features) => {
  diseases = newDiseases;
  signs = newSigns;
  symptoms = newSymptoms;

  setUpSymptoms(newSymptoms);
  setUpSigns(newSigns);
  setUpDiseases(newDiseases);
};

export const setUpSymptoms = (startSymptoms: Features) => {
  new Feature(
    available_symptoms,
    chosen_symptoms,
    filter_symptoms,
    addSymptomBtn,
    rmvSymptomBtn,
    startSymptoms
  ).start();
};

export const setUpSigns = (startSigns: Features) => {
  new Feature(
    available_signs,
    chosen_signs,
    filter_signs,
    addSignBtn,
    rmvSignBtn,
    startSigns
  ).start();
};

export function setUpDiseases(startDiseases: Array<Disease>) {
  populateDiseases(startDiseases);

  searchInput.addEventListener("input", e => {
    const filteredDiseases = startDiseases.filter(
      d =>
        d.name
          .toLocaleLowerCase()
          .indexOf((e.target as HTMLInputElement).value.toLocaleLowerCase()) > -1
    );
    populateDiseases(filteredDiseases);
  });
}

export const selectItems = (
  selectElem: HTMLSelectElement,
  data: Features,
  callback: Function = () => {}
) => {
  for (let i = 0; i < selectElem.options.length; i++) {
    const option = selectElem.options[i];

    if (data.map(item => item.name).includes(option.value)) {
      option?.setAttribute("selected", "selected");
    } else {
      option?.removeAttribute("selected");
    }
  }

  if (callback) {
    callback();
  }
};

export function populateDiseases(newDiseases: Diseases, clear = true) {
  if (clear) {
    diseaseList.innerHTML = "";
  }

  for (const disease of newDiseases) {
    const item = document.createElement("li");
    const txtNode = document.createTextNode(disease.name);

    item.setAttribute("id", disease.id.toString());
    item.title = disease.about?.slice(0, 20) ?? "";
    item.appendChild(txtNode);
    diseaseList.appendChild(item);

    item.onclick = () => showDiseaseDetail(disease);
  }
}

export const hideHomePage = () => (tabWidget.style.display = "none");
export const hideDiseaseDetail = () => closeModal();

export const hideEditForm = () => (editForm.style.display = "none");
export const showEditForm = () => (editForm.style.display = "block");

export const showHomePage = () => {
  tabWidget.style.display = "block";
  hideEditForm();
  closeModal();
};

export function editDisease(activeDisease: Disease) {
  hideHomePage();
  hideDiseaseDetail();
  showEditForm();

  // Set the name
  editForm.querySelector(".disease-name").innerHTML = activeDisease.name;
  editForm.querySelector("#about").innerHTML = activeDisease.about;
  editForm.setAttribute("data-id", activeDisease.id.toString());

  const cancelBtn = editForm.querySelector("#cancel-disease-edit") as HTMLButtonElement;

  // symptoms
  const available_symptoms = editForm.querySelector("#available_symptoms") as HTMLSelectElement;
  const chosen_symptoms = editForm.querySelector("#chosen_symptoms") as HTMLSelectElement;
  const filter_symptoms = editForm.querySelector("#filter_symptoms") as HTMLInputElement;

  const addSymptomBtn = editForm.querySelector("button.arrow.right") as HTMLButtonElement;
  const rmvSymptomBtn = editForm.querySelector("button.arrow.left") as HTMLButtonElement;

  // Signs
  const available_signs = editForm.querySelector("#available_signs") as HTMLSelectElement;
  const chosen_signs = editForm.querySelector("#chosen_signs") as HTMLSelectElement;
  const filter_signs = editForm.querySelector("#filter_signs") as HTMLInputElement;

  const addSignBtn = editForm.querySelector("button.arrow.right.sign") as HTMLButtonElement;
  const rmvSignBtn = editForm.querySelector("button.arrow.left.sign") as HTMLButtonElement;

  const setUpNewDiseaseSymptoms = (symptoms: Features) => {
    new Feature(
      available_symptoms,
      chosen_symptoms,
      filter_symptoms,
      addSymptomBtn,
      rmvSymptomBtn,
      symptoms
    ).start();
  };

  const setUpNewDiseaseSigns = (signs: Features) => {
    new Feature(available_signs, chosen_signs, filter_signs, addSignBtn, rmvSignBtn, signs).start();
  };

  setUpNewDiseaseSymptoms(symptoms);
  setUpNewDiseaseSigns(signs);
  selectItems(available_symptoms, activeDisease.symptoms, () => addSymptomBtn.click());
  selectItems(available_signs, activeDisease.signs, () => addSignBtn.click());

  cancelBtn.onclick = () => {
    hideEditForm();
    showHomePage();
    showDiseaseDetail(activeDisease);
  };
}

export function openTab(evt: Event, tabName: string) {
  let i, tabcontent, tablinks;

  tabcontent = document.querySelectorAll(".tabcontent") as NodeList;

  for (i = 0; i < tabcontent.length; i++) {
    (tabcontent[i] as HTMLDivElement).style.display = "none";
  }

  tablinks = document.querySelectorAll(".tablinks") as NodeList;

  for (i = 0; i < tablinks.length; i++) {
    (tablinks[i] as HTMLButtonElement).className = (tablinks[
      i
    ] as HTMLButtonElement).className.replace(" active", "");
  }

  (document.getElementById(tabName) as HTMLButtonElement).style.display = "block";

  (evt.currentTarget as HTMLButtonElement).className += " active";
}

export function showNameExists(err: string) {
  const errorResponses = document.querySelectorAll(".error-response") as NodeList;

  for (let i = 0; i < errorResponses.length; i++) {
    const elem = errorResponses[i] as HTMLParagraphElement;
    elem.innerHTML = err;
    elem.style.visibility = "visible";
  }
}

export const hideNameExists = () => {
  const errorResponses = document.querySelectorAll(".error-response") as NodeList;

  for (let i = 0; i < errorResponses.length; i++) {
    const elem = errorResponses[i] as HTMLParagraphElement;
    elem.style.visibility = "hidden";
  }
};

export const showErrorMessage = () => {
  const parag = document.querySelector(".no-connection") as HTMLParagraphElement;
  parag.style.display = "block";
};

export const hideErrorMessage = () => {
  const parag = document.querySelector(".no-connection") as HTMLParagraphElement;
  parag.style.display = "none";
};

export const showSpinner = () => {
  const parag = document.querySelector(".loading") as HTMLParagraphElement;
  parag.style.display = "block";
};

export const hideSpinner = () => {
  const parag = document.querySelector(".loading") as HTMLParagraphElement;
  parag.style.display = "none";
};

export function showDiseaseDetail(disease: Disease) {
  hideEditForm();

  const html = getDiseaseHTML(disease);
  showDiseaseModal(disease.name, html);

  const backButton = document.createElement("button");
  backButton.id = "backButton";
  backButton.className = "btn";
  backButton.innerHTML = "Back";

  const editButton = document.createElement("button");
  editButton.id = "editButton";
  editButton.className = "btn";
  editButton.innerHTML = "Edit";

  backButton.onclick = () => showHomePage();
  editButton.onclick = () => editDisease(disease);

  addFooterButtons([backButton, editButton]);
}

export function addModalFooterButtons(
  type: string,
  onSaveCallback: typeof saveNewSymptom,
  sandFeatureToMain: (feature: SignOrSymptom) => {}
) {
  const backButton = document.createElement("button");
  backButton.id = "cancelButton";
  backButton.className = "btn";
  backButton.innerHTML = "Cancel";

  const saveButton = document.createElement("button");
  saveButton.id = "saveButton";
  saveButton.className = "btn";
  saveButton.innerHTML = "Save";
  addFooterButtons([saveButton, backButton]);

  const modal = document.querySelector(".modal") as HTMLDivElement;
  const form = modal.querySelector(`#${type}-form`) as HTMLFormElement;

  function submitForm() {
    const name = (form.querySelector("#name") as HTMLInputElement).value;
    const description = (form.querySelector("#desc") as HTMLInputElement).value;

    if (name.trim() !== "" && name.length < 200) {
      onSaveCallback(name, description)
        .then(feature => {
          closeModal();
          showHomePage();

          // Add to available data
          if (type === "symptom") {
            const opt = document.createElement("option");
            opt.value = feature.name;
            opt.innerHTML = feature.name;
            available_symptoms.appendChild(opt);
          } else if (type === "sign") {
            const opt = document.createElement("option");
            opt.value = feature.name;
            opt.innerHTML = feature.name;
            available_signs.appendChild(opt);
          }

          sandFeatureToMain(feature);
          alert(`${type} saved successfully!`);
        })
        .catch(err => {
          console.log(err);

          alert("Something went wrong...");
        });
    }
  }

  backButton.onclick = () => showHomePage();
  saveButton.onclick = () => submitForm();
  form.onsubmit = e => {
    e.preventDefault();
    submitForm();
  };
}
