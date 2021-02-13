"use strict";

import { SignOrSymptom, Disease, NewDiseaseData } from "./types";
import * as api from "./api";
import * as dom from "./dom";
import getDiseaseHTML from "./disease-template";
export const TABS_OPEN = "tabs-open";
export const DISEASE = "disease";

export const STATES = {
  OPEN: "yes",
  NOT_OPEN: "no",
};

let signs: SignOrSymptom[], symptoms: SignOrSymptom[], diseases: Disease[];

const getFormData = (): NewDiseaseData => {
  const name = (dom.addDiseaseForm.querySelector("#name") as HTMLInputElement).value;
  const about = (dom.addDiseaseForm.querySelector("#about") as HTMLTextAreaElement).value;

  const selectedSymptoms = symptoms.filter(s =>
    Array.from(dom.chosen_symptoms.options)
      .map(option => option.value)
      .includes(s.name)
  );

  const selectedSigns = signs.filter(s =>
    Array.from(dom.chosen_signs.options)
      .map(option => option.value)
      .includes(s.name)
  );

  return {
    name,
    symptoms: selectedSymptoms,
    signs: selectedSigns,
    about,
  };
};

dom.addDiseaseForm.addEventListener("submit", e => {
  e.preventDefault();

  if (!symptoms || !signs || !diseases) return;

  api
    .handleSaveNewDisease(getFormData())
    .then(savedDisease => {
      dom.populateDiseases([savedDisease], false);
      dom.hideDiseaseDetail();
      alert(`${savedDisease.name} registered successfully!`);
    })
    .catch(err => {
      dom.showNameExists(err);
    });
});

dom.addDiseaseForm.querySelector("#name").addEventListener("input", e => {
  const input = e.target as HTMLInputElement;
  const name = input.value.trim();
  const msg = `${name} is already registered`;

  if (diseases.map(d => d.name).includes(name)) {
    input.style.borderColor = "tomato";
    dom.showNameExists(msg);
  } else {
    input.style.borderColor = "lightblue";
    dom.hideNameExists();
  }
});

dom.editForm.addEventListener("submit", async e => {
  e.preventDefault();

  const form = e.currentTarget as HTMLFormElement;
  const chosen_symptoms = form.querySelector("#chosen_symptoms") as HTMLSelectElement;
  const chosen_signs = form.querySelector("#chosen_signs") as HTMLSelectElement;

  const id = form.getAttribute("data-id");

  if (id) {
    const about = (form.querySelector("#about") as HTMLSelectElement).value;

    const selectedSymptoms = symptoms.filter(s =>
      Array.from(chosen_symptoms.options)
        .map(option => option.value)
        .includes(s.name)
    );

    const selectedSigns = signs.filter(s =>
      Array.from(chosen_signs.options)
        .map(option => option.value)
        .includes(s.name)
    );

    const data = {
      symptoms: selectedSymptoms,
      signs: selectedSigns,
      about,
    };

    try {
      const disease = await api.handleUpdateDisease(id, data);
      diseases = diseases.map(d => (d.id === disease.id ? disease : d));
      dom.populateDiseases(diseases, true);
      dom.hideDiseaseDetail();
      dom.editForm.style.display = "none";

      alert(`${disease.name} updated successfully!`);
    } catch (error) {
      console.log(error);
    }
  }
});

async function initializePage() {
  for (let i = 0; i < dom.tabs.length; i++) {
    const element = dom.tabs[i] as HTMLButtonElement;

    element.addEventListener("click", e => {
      dom.openTab(e, element.getAttribute("data-target"));
    });

    (document.querySelector("button[defaultOpen]") as HTMLButtonElement).click();
  }

  try {
    dom.showSpinner();
    let [diseasesList, symptomsList, signsList] = await Promise.all([
      api.fetchDiseases(),
      api.fetchSymptoms(),
      api.fetchSigns(),
    ]);

    dom.hideErrorMessage();

    symptoms = symptomsList;
    signs = signsList;
    diseases = diseasesList;

    dom.setUpSymptoms(symptoms);
    dom.setUpSigns(signs);
    dom.setUpDiseases(diseases);
  } catch (error) {
    dom.showErrorMessage();
  } finally {
    dom.hideSpinner();
  }

  const activeDisease: Disease = JSON.parse(localStorage.getItem(DISEASE));

  if (activeDisease != null && localStorage.getItem(TABS_OPEN) === STATES.NOT_OPEN) {
    const match = diseases.find(d => d.id === activeDisease?.id);

    if (match) {
      showDiseaseDetail(match);
    } else {
      localStorage.removeItem(DISEASE);
      dom.hideDiseaseDetail();
    }
  } else {
    dom.hideDiseaseDetail();
  }
}

export function showDiseaseDetail(disease: Disease) {
  dom.tabWidget.style.display = "none";
  dom.editForm.style.display = "none";

  const diseaseDetail = document.querySelector(".disease-detail") as HTMLDivElement;
  diseaseDetail.innerHTML = "";

  diseaseDetail.innerHTML = getDiseaseHTML(disease);
  diseaseDetail.style.display = "block";

  localStorage.setItem(TABS_OPEN, STATES.NOT_OPEN);
  localStorage.setItem(DISEASE, JSON.stringify(disease));

  const spanClose = document.querySelector("#disease__name > span") as HTMLSpanElement;
  const backButton = document.getElementById("backButton") as HTMLButtonElement;
  const editButton = document.getElementById("editButton") as HTMLButtonElement;

  if (backButton && spanClose) {
    backButton.onclick = () => dom.hideDiseaseDetail();
    spanClose.onclick = () => dom.hideDiseaseDetail();
  }

  if (editButton) {
    editButton.onclick = () => dom.editDisease(diseases, signs, symptoms);
  }
}

document.addEventListener("DOMContentLoaded", initializePage);
