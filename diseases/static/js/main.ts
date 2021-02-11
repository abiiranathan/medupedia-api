"use strict";

// Javascript for Medupedia -> Could have been easier with a framework(like React)
// but why not use typescript and keep the dependency graph to zero(other than TS)
// Feel free to submit Pull Requests and Issues
// Use this code in any project you desire.
// Sample project is hosted at: https://medupedia.pythonanywhere.com
// Dr. Abiira Nathan via @abiiranathan

const tabs = document.querySelectorAll(".tablinks") as NodeList;
const tabWidget = document.querySelector(".tabWidget") as HTMLDivElement;
// symptoms
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

const editForm = document.getElementById("edit-disease-form") as HTMLFormElement;

const TABS_OPEN = "tabs-open";
const DISEASE = "disease";

// Could have used enum here
const STATES = {
  OPEN: "yes",
  NOT_OPEN: "no",
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

interface NewDiseaseData {
  name: string;
  about: string;
  symptoms: SignOrSymptom[];
  signs: SignOrSymptom[];
}

// Store signs and symptoms as global variables

let signs: SignOrSymptom[], symptoms: SignOrSymptom[], diseases: Disease[];

// The feature encapsulates the logic for a django-admin-style multi-select dropdowns
// Easy to add and remove signs or symptoms when registering a new disease.

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
  const url = "/api/symptoms/?query={id, name, description}";
  return await fetchData(url);
};

const fetchSigns = async (): Promise<Array<SignOrSymptom>> => {
  const url = "/api/signs/?query={id, name, description}";
  return await fetchData(url);
};

const fetchDiseases = async (): Promise<Array<Disease>> => {
  const url = "/api/diseases/?query={id, name, signs, symptoms, about}";
  return await fetchData(url);
};

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

// Handle saving new-disease
addDiseaseForm.addEventListener("submit", e => {
  e.preventDefault();

  if (!symptoms || !signs || !diseases) return;

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
    name,
    symptoms: selectedSymptoms,
    signs: selectedSigns,
    about,
  };

  handleSaveNewDisease(data)
    .then(savedDisease => {
      populateDiseases([savedDisease], false);
      hideDiseaseDetail();
      alert(`${savedDisease.name} registered successfully!`);
    })
    .catch(err => {
      showNameExists(err);
    });
});

// Disease name validation(onChange)
// onChange sometimes does not fire(Happy with input event for now)
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

editForm.addEventListener("submit", async e => {
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
      const disease = await handleUpdateDisease(id, data);
      diseases = diseases.map(d => (d.id === disease.id ? disease : d));
      populateDiseases(diseases, true);
      hideDiseaseDetail();
      editForm.style.display = "none";

      alert(`${disease.name} updated successfully!`);
    } catch (error) {
      console.log(error);
    }
  }
});

async function initializePage() {
  for (let i = 0; i < tabs.length; i++) {
    const element = tabs[i] as HTMLButtonElement;

    element.addEventListener("click", e => {
      openTab(e, element.getAttribute("data-target"));
    });

    (document.querySelector("button[defaultOpen]") as HTMLButtonElement).click();
  }

  try {
    showSpinner();
    let [diseasesList, symptomsList, signsList] = await Promise.all([
      fetchDiseases(),
      fetchSymptoms(),
      fetchSigns(),
    ]);

    hideErrorMessage();

    symptoms = symptomsList;
    signs = signsList;
    diseases = diseasesList;

    setUpSymptoms(symptoms);
    setUpSigns(signs);
    setUpDiseases(diseases);
  } catch (error) {
    showErrorMessage();
  } finally {
    hideSpinner();
  }

  // show active page (tabs or disease detail)
  // Restores state after page reload to improve the user experience
  const activeDisease: Disease = JSON.parse(localStorage.getItem(DISEASE));
  if (activeDisease != null && localStorage.getItem(TABS_OPEN) === STATES.NOT_OPEN) {
    // Get active disease from updated data
    const match = diseases.find(d => d.id === activeDisease?.id);

    if (match) {
      showDiseaseDetail(match);
    } else {
      localStorage.removeItem(DISEASE);
      hideDiseaseDetail();
    }
  } else {
    hideDiseaseDetail();
  }
}

function editDisease() {
  // Edit the currently selected disease
  // Get it from local storage

  const storedDisease: Disease = JSON.parse(localStorage.getItem(DISEASE));
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
    const filter_signs = editForm.querySelector("#filter_signs") as HTMLSelectElement;

    const addSignBtn = editForm.querySelector("button.arrow.right.sign") as HTMLButtonElement;
    const rmvSignBtn = editForm.querySelector("button.arrow.left.sign") as HTMLButtonElement;

    const setUpNewDiseaseSymptoms = (symptoms: Array<SignOrSymptom>) => {
      new Feature(
        available_symptoms,
        chosen_symptoms,
        filter_symptoms,
        addSymptomBtn,
        rmvSymptomBtn,
        symptoms
      ).start();
    };

    const setUpNewDiseaseSigns = (signs: Array<SignOrSymptom>) => {
      new Feature(
        available_signs,
        chosen_signs,
        filter_signs,
        addSignBtn,
        rmvSignBtn,
        signs
      ).start();
    };

    const selectItems = (selectElem: HTMLSelectElement, data: SignOrSymptom[], callback) => {
      // Set current signs and symptoms
      // First select symptoms programmatically
      for (let i = 0; i < selectElem.options.length; i++) {
        const option = selectElem.options[i];

        if (data.map(item => item.name).includes(option.value)) {
          option.setAttribute("selected", "selected");
        } else {
          option.removeAttribute("selected");
        }
      }

      callback();
    };

    setUpNewDiseaseSymptoms(symptoms);
    setUpNewDiseaseSigns(signs);

    selectItems(available_symptoms, activeDisease.symptoms, () => {
      addSymptomBtn.click();
    });
    selectItems(available_signs, activeDisease.signs, () => {
      addSignBtn.click();
    });

    cancelBtn.onclick = () => {
      showDiseaseDetail(activeDisease);
    };
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

function hideDiseaseDetail() {
  const tabWidget = document.querySelector(".tabWidget") as HTMLDivElement;
  tabWidget.style.display = "block";

  const diseaseDetail = document.querySelector(".disease-detail") as HTMLDivElement;
  diseaseDetail.innerHTML = "";
  diseaseDetail.style.display = "none";

  localStorage.setItem(TABS_OPEN, STATES.OPEN);
  localStorage.setItem(DISEASE, JSON.stringify(null));
}

async function handleSaveNewDisease(data: NewDiseaseData): Promise<Disease> {
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

async function handleUpdateDisease(id: string, data: object): Promise<Disease> {
  const config = {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  };

  const res = await fetch(`/api/diseases/${id}/`, config);
  const disease = await res.json();

  if (res.ok) {
    return disease;
  } else {
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

function showDiseaseDetail(disease: Disease) {
  tabWidget.style.display = "none";
  editForm.style.display = "none";

  const diseaseDetail = document.querySelector(".disease-detail") as HTMLDivElement;
  diseaseDetail.innerHTML = "";

  // Show card for disease
  const diseaseStr = `
  <div>
    <h2 id="disease__name"><span style="cursor: pointer; transform:scale(2)" onclick="hideDiseaseDetail()">&#8592;</span> ${
      disease.name
    }</h2>
    <hr />
    ${disease?.about?.length > 0 ? `<h4 class="section">Description</h4>` : ""}
    <p id="disease__about">${disease.about}</p>
    ${disease.symptoms.length > 0 ? `<h4 class="section">Symptoms</h4>` : ""}
    <ul id="disease__symptoms">
    ${disease.symptoms
      .map(
        symptom =>
          `<li><small><b>${symptom.name}</b></small><br><small>${symptom.description}</small></li>`
      )
      .join("\n")}
    </ul>
    ${disease.signs.length > 0 ? `<h4 class="section">Signs</h4>` : ""}
    <ul id="disease__symptoms">
    ${disease.signs
      .map(
        sign => `<li><small><b>${sign.name}</b><br></small><small>${sign.description}</small></li>`
      )
      .join("\n")}</ul>
    <button id="backButton" class="btn" onclick="hideDiseaseDetail();">Back</span></button>
    <button id="editButton" class="btn" onclick="editDisease();">Edit</button>
  </div>
  `;

  diseaseDetail.innerHTML = diseaseStr;
  diseaseDetail.style.display = "block";
  localStorage.setItem(TABS_OPEN, STATES.NOT_OPEN);
  localStorage.setItem(DISEASE, JSON.stringify(disease));
}

document.addEventListener("DOMContentLoaded", initializePage);
