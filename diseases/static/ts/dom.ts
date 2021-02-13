import Feature from "./feature";
import { Disease, Diseases, Features } from "./types";

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

import { showDiseaseDetail, TABS_OPEN, DISEASE, STATES } from "./main";

export const setUpSymptoms = (symptoms: Features) => {
  new Feature(
    available_symptoms,
    chosen_symptoms,
    filter_symptoms,
    addSymptomBtn,
    rmvSymptomBtn,
    symptoms
  ).start();
};

export const setUpSigns = (signs: Features) => {
  new Feature(available_signs, chosen_signs, filter_signs, addSignBtn, rmvSignBtn, signs).start();
};

export function populateDiseases(diseases: Diseases, clear = true) {
  if (clear) {
    diseaseList.innerHTML = "";
  }

  for (const disease of diseases) {
    const item = document.createElement("li");
    const txtNode = document.createTextNode(disease.name);

    item.setAttribute("id", disease.id.toString());
    item.title = disease.about?.slice(0, 20) ?? "";
    item.appendChild(txtNode);
    item.addEventListener("click", () => {
      showDiseaseDetail(disease);
    });
    diseaseList.appendChild(item);
  }
}

export function setUpDiseases(diseases: Array<Disease>) {
  populateDiseases(diseases);

  searchInput.addEventListener("input", e => {
    const filteredDiseases = diseases.filter(
      d =>
        d.name
          .toLocaleLowerCase()
          .indexOf((e.target as HTMLInputElement).value.toLocaleLowerCase()) > -1
    );
    populateDiseases(filteredDiseases);
  });
}

export function hideDiseaseDetail() {
  tabWidget.style.display = "block";

  const diseaseDetail = document.querySelector(".disease-detail") as HTMLDivElement;
  diseaseDetail.innerHTML = "";
  diseaseDetail.style.display = "none";

  localStorage.setItem(TABS_OPEN, STATES.OPEN);
  localStorage.setItem(DISEASE, JSON.stringify(null));
}

export function editDisease(diseases, signs, symptoms) {
  const storedDisease: Disease = JSON.parse(localStorage.getItem(DISEASE) ?? "");
  const activeDisease = diseases.find(d => d.id === storedDisease?.id);

  if (activeDisease) {
    hideDiseaseDetail();

    tabWidget.style.display = "none";
    editForm.style.display = "block";

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
      new Feature(
        available_signs,
        chosen_signs,
        filter_signs,
        addSignBtn,
        rmvSignBtn,
        signs
      ).start();
    };

    const selectItems = (selectElem: HTMLSelectElement, data: Features, callback: Function) => {
      for (let i = 0; i < selectElem.options.length; i++) {
        const option = selectElem.options[i];

        if (data.map(item => item.name).includes(option.value)) {
          option?.setAttribute("selected", "selected");
        } else {
          option?.removeAttribute("selected");
        }
      }

      callback();
    };

    setUpNewDiseaseSymptoms(symptoms);
    setUpNewDiseaseSigns(signs);
    selectItems(available_symptoms, activeDisease.symptoms, () => addSymptomBtn.click());
    selectItems(available_signs, activeDisease.signs, () => addSignBtn.click());
    cancelBtn.onclick = () => showDiseaseDetail(activeDisease);
  }
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
