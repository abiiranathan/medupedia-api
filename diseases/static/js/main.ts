"use strict";
// ts-check

const TABS_OPEN = "tabs-open";
const DISEASE = "disease";

const States = {
  OPEN: "yes",
  NOT_OPEN: "no",
};

const tabs = document.querySelectorAll(".tablinks") as NodeList;
const available_symptoms = document.getElementById("available_symptoms") as HTMLSelectElement;
const chosen_symptoms = document.getElementById("chosen_symptoms") as HTMLSelectElement;
const filter_symptoms = document.getElementById("filter_symptoms") as HTMLInputElement;

const addSymptomBtn = document.querySelector("button.arrow.right") as HTMLButtonElement;
const rmvSymptomBtn = document.querySelector("button.arrow.left") as HTMLButtonElement;

// Signs
const available_signs = document.getElementById("available_signs") as HTMLSelectElement;
const chosen_signs = document.getElementById("chosen_signs") as HTMLSelectElement;
const filter_signs = document.getElementById("filter_signs") as HTMLSelectElement;

const addSignBtn = document.querySelector("button.arrow.right.sign") as HTMLButtonElement;
const rmvSignBtn = document.querySelector("button.arrow.left.sign") as HTMLButtonElement;

// diseases
const searchInput = document.querySelector(".search-diseases") as HTMLInputElement;
const diseaseList = document.querySelector("#disease_list") as HTMLUListElement;

const addDiseaseForm = document.querySelector("#add-disease-form") as HTMLFormElement;

async function fetchData<T>(url: string): Promise<Array<T>> {
  const response = await fetch(url);

  if (response.status == 200) {
    const data = await response.json();
    return data;
  } else {
    throw new Error(response.statusText);
  }
}

const fetchSymptoms = async (): Promise<Array<SignOrSymptom>> => {
  const url = "/api/symptoms/?query={id, name}";
  return await fetchData(url);
};

const fetchSigns = async (): Promise<Array<SignOrSymptom>> => {
  const url = "/api/signs/?query={id, name}";
  return await fetchData(url);
};

const fetchDiseases = async (): Promise<Array<Disease>> => {
  const url = "/api/diseases/?query={id, name, signs, symptoms, about}";
  return await fetchData(url);
};

interface SignOrSymptom {
  id: number;
  name: string;
  description: string;
}

interface Disease {
  id: number;
  name: string;
  about: string;
  symptoms: SignOrSymptom[];
  signs: SignOrSymptom[];
}

interface NewDiseasData {
  name: string;
  about: string;
  symptoms: SignOrSymptom[];
  signs: SignOrSymptom[];
}

class Feature {
  available: HTMLSelectElement;
  chosen: HTMLSelectElement;
  filter: HTMLInputElement;
  addBtn: HTMLButtonElement;
  removeBtn: HTMLButtonElement;
  initialData: Array<SignOrSymptom>;

  constructor(available, chosen, filter, addBtn, removeBtn, initialData) {
    this.available = available;
    this.chosen = chosen;
    this.filter = filter;
    this.addBtn = addBtn;
    this.removeBtn = removeBtn;
    this.initialData = initialData;
  }

  start = () => {
    this.addBtn.addEventListener("click", () => {
      const selected = Array.from(this.available.selectedOptions).map(o => o.value);
      const alreadySelected = Array.from(this.chosen.options).map(o => o.value);

      for (const name of selected) {
        if (!alreadySelected.includes(name)) {
          this.addToChosenData(name);
        }
      }
    });

    this.removeBtn.addEventListener("click", () => {
      const optionsToRemove = Array.from(this.chosen.selectedOptions).map(o => o.value);

      for (const option of optionsToRemove) {
        this.chosen.querySelector(`option[value="${option}"]`).remove();
        this.addToAvailable(option);
      }
    });

    this.filter.addEventListener("input", e =>
      this.filterData((e.target as HTMLInputElement).value, this.initialData)
    );

    this.setData(this.initialData);
  };

  setData = (data: Array<SignOrSymptom>) => {
    this.available.innerHTML = "";
    const alreadySelected = Array.from(this.chosen.options).map(o => o.value);

    data
      .filter(s => !alreadySelected.includes(s.name))
      .forEach(({ name }) => {
        const option = document.createElement("option");
        option.value = name;
        option.appendChild(document.createTextNode(name));
        this.available.appendChild(option);
      });
  };

  filterData = (query: string, data: Array<SignOrSymptom>) => {
    if (query !== "") {
      const filtered_data = data.filter(
        s => s.name.toLowerCase().indexOf(query.toLowerCase()) > -1
      );
      this.setData(filtered_data);
    } else {
      this.setData(data);
    }
  };

  addToChosenData = (name: string) => {
    const option = document.createElement("option");
    option.value = name;
    option.appendChild(document.createTextNode(name));
    this.chosen.appendChild(option);
    this.removeFromAvailable(name);
  };

  removeFromAvailable = (name: string) => {
    this.available.querySelector(`option[value="${name}"]`).remove();
  };

  addToAvailable = (name: string) => {
    const option = document.createElement("option");
    option.value = name;
    option.appendChild(document.createTextNode(name));
    this.available.appendChild(option);
  };
}

const setUpSymptoms = (symptoms: Array<SignOrSymptom>) => {
  new Feature(
    available_symptoms,
    chosen_symptoms,
    filter_symptoms,
    addSymptomBtn,
    rmvSymptomBtn,
    symptoms
  ).start();
};

const setUpSigns = (signs: Array<SignOrSymptom>) => {
  new Feature(available_signs, chosen_signs, filter_signs, addSignBtn, rmvSignBtn, signs).start();
};

function populateDiseases(diseases: Array<Disease>, clear = true) {
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

function setUpDiseases(diseases: Array<Disease>) {
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

function showErrorMessage() {
  const parag = document.querySelector(".no-connection") as HTMLParagraphElement;
  parag.style.display = "block";
}

function hideErrorMessage() {
  const parag = document.querySelector(".no-connection") as HTMLParagraphElement;
  parag.style.display = "none";
}

function showSpinner() {
  const parag = document.querySelector(".loading") as HTMLParagraphElement;
  parag.style.display = "block";
}

function hideSpinner() {
  const parag = document.querySelector(".loading") as HTMLParagraphElement;
  parag.style.display = "none";
}

async function initializePage() {
  for (let i = 0; i < tabs.length; i++) {
    const element = tabs[i] as HTMLButtonElement;

    element.addEventListener("click", e => {
      openTab(e, element.getAttribute("data-target"));
    });

    (document.querySelector("button[defaultOpen]") as HTMLButtonElement).click();
  }

  try {
    // Fetch and display data
    showSpinner();
    let [diseases, symptoms, signs] = await Promise.all([
      fetchDiseases(),
      fetchSymptoms(),
      fetchSigns(),
    ]);

    hideErrorMessage();

    setUpSymptoms(symptoms);
    setUpSigns(signs);
    setUpDiseases(diseases);

    // Handle saving new-diseases
    addDiseaseForm.addEventListener("submit", e => {
      e.preventDefault();

      const name = (addDiseaseForm.querySelector("#name") as HTMLInputElement).value;
      const about = (addDiseaseForm.querySelector("#about") as HTMLTextAreaElement).value;

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
        name: name,
        symptoms: selectedSymptoms,
        signs: selectedSigns,
        about: about,
      };

      handleSaveNewDisease(data)
        .then(savedDisease => {
          populateDiseases([savedDisease], false);
        })
        .catch(err => {
          showNameExists(err);
        });
    });

    // Disease name validation
    addDiseaseForm.querySelector("#name").addEventListener("input", e => {
      const input = e.target as HTMLInputElement;
      const name = input.value.trim();
      const msg = `${name} is already registered`;

      if (diseases.map(d => d.name).includes(name)) {
        input.style.borderColor = "tomato";
        showNameExists(msg);
      } else {
        input.style.borderColor = "lightblue";
        hideNameExists();
      }
    });
  } catch (error) {
    showErrorMessage();
  } finally {
    hideSpinner();
  }

  // show active page(tabs or disease detail)
  const activeDisease: Disease = JSON.parse(localStorage.getItem(DISEASE));
  if (activeDisease != null && localStorage.getItem(TABS_OPEN) === States.NOT_OPEN) {
    showDiseaseDetail(activeDisease);
  } else {
    hideDiseaseDetail();
  }
}

function openTab(evt, tabName: string) {
  // Declare all variables
  let i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  (evt.currentTarget as HTMLButtonElement).className += " active";
}

function showDiseaseDetail(disease: Disease) {
  const tabWidget = document.querySelector(".tabWidget") as HTMLDivElement;
  tabWidget.style.display = "none";

  const diseaseDetail = document.querySelector(".disease-detail") as HTMLDivElement;
  diseaseDetail.innerHTML = "";

  // Show card for disease
  const diseaseStr = `
  <div>
    <h2 id="disease__name">${disease.name}</h2>
    <hr />
    ${disease?.about?.length > 0 ? `<h4 class="section">Description</h4>` : ""}
    <p id="disease__about">${disease.about}</p>
    ${disease.symptoms.length > 0 ? `<h4 class="section">Symptoms</h4>` : ""}
    <ul id="disease__symptoms">
    ${disease.symptoms
      .map(symptom => `<li>${symptom.name}<br>${symptom.description}</li>`)
      .join("\n")}
    </ul>
    ${disease.signs.length > 0 ? `<h4 class="section">Signs</h4>` : ""}
    <ul id="disease__symptoms">
    ${disease.signs.map(sign => `<li>${sign.name}<br>${sign.description}</li>`).join("\n")}</ul>
    <button id="backButton" class="btn" onclick="hideDiseaseDetail();"><span>&#8592; Back</span></button>
  </div>
  `;

  diseaseDetail.innerHTML = diseaseStr;
  diseaseDetail.style.display = "block";
  localStorage.setItem(TABS_OPEN, States.NOT_OPEN);
  localStorage.setItem(DISEASE, JSON.stringify(disease));
}

function hideDiseaseDetail() {
  const tabWidget = document.querySelector(".tabWidget") as HTMLDivElement;
  tabWidget.style.display = "block";

  const diseaseDetail = document.querySelector(".disease-detail") as HTMLDivElement;
  diseaseDetail.innerHTML = "";
  diseaseDetail.style.display = "none";

  localStorage.setItem(TABS_OPEN, States.OPEN);
  localStorage.setItem(DISEASE, JSON.stringify(null));
}

async function handleSaveNewDisease(data: NewDiseasData): Promise<Disease> {
  const config = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  };

  const res = await fetch("/api/diseases/", config);
  const disease = await res.json();

  if (res.status === 201) {
    return disease;
  } else {
    if (typeof disease === "object" && Object?.keys(disease).includes("name")) {
      throw new Error(`${data.name} has already been registered`);
    }

    throw new Error(res.statusText);
  }
}

function showNameExists(err) {
  const errorResponses = document.querySelectorAll(".error-response") as NodeList;

  for (let i = 0; i < errorResponses.length; i++) {
    const elem = errorResponses[i] as HTMLParagraphElement;
    elem.innerHTML = err;
    elem.style.visibility = "visible";
  }
}

function hideNameExists() {
  const errorResponses = document.querySelectorAll(".error-response") as NodeList;

  for (let i = 0; i < errorResponses.length; i++) {
    const elem = errorResponses[i] as HTMLParagraphElement;
    elem.style.visibility = "hidden";
  }
}

document.addEventListener("DOMContentLoaded", initializePage);
