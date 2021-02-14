"use strict";

import { SignOrSymptom, Disease, NewDiseaseData } from "./types";
import * as api from "./api";
import * as dom from "./dom";
import "./modal";
import { showSignModal, showSymptomModal } from "./modal";

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

      // Reset the form

      dom.chosen_signs.innerHTML = "";
      dom.chosen_symptoms.innerHTML = "";

      const sympsNames = Array.from(dom.chosen_symptoms.options).map(option => option.value);
      const symptomsSelected = symptoms.filter(s => sympsNames.includes(s.name));

      const signNames = Array.from(dom.chosen_signs.options).map(option => option.value);
      const signSelected = symptoms.filter(s => signNames.includes(s.name));

      dom.selectItems(dom.available_symptoms, symptomsSelected);
      dom.selectItems(dom.available_signs, signSelected);

      dom.rmvSymptomBtn.click();
      dom.rmvSignBtn.click();

      // Clear the disease name
      const name = document.querySelector("#add-disease-form #name") as HTMLInputElement;

      if (name) {
        name.value = "";
        name.focus();
        name.scrollIntoView({ behavior: "smooth" });
      }

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
      alert(`${disease.name} updated successfully! The page will refresh for changes!`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }
});

dom.regSymptomBtn.onclick = () => {
  showSymptomModal();
  dom.addModalFooterButtons("symptom", api.saveNewSymptom, (symptom: SignOrSymptom) =>
    symptoms.push(symptom)
  );
};

dom.regSignBtn.onclick = () => {
  showSignModal();
  dom.addModalFooterButtons("sign", api.saveNewSign, (sign: SignOrSymptom) => signs.push(sign));
};

const debounce = (func: Function, delay: number) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

document.addEventListener("DOMContentLoaded", async () => {
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
    dom.setDOMState(diseases, symptoms, signs);
  } catch (error) {
    dom.showErrorMessage();
  } finally {
    dom.hideSpinner();
  }

  const container = document.querySelector(".container") as HTMLDivElement;
  let resized = false;

  container.onscroll = e => {
    if (resized) return false;

    debounce(() => {
      const diff: number = (e.target as HTMLDivElement).scrollTop;
      if (diff > 100) {
        dom.header.style.padding = "0.25rem 1rem";
        dom.header.style.overflow = "hidden";
        resized = true;
      }
    }, 300);
  };
});
