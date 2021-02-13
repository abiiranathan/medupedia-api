import { Disease, SignOrSymptom } from "./types";

const getSymptom = (symptom: SignOrSymptom) => {
  return `
        <li>
            <small><b>${symptom.name}</b></small><br>
            <small>${symptom.description}</small>
        </li>`;
};

const getSign = (sign: SignOrSymptom) => {
  return `
        <li>
            <small><b>${sign.name}</b></small><br>
            <small>${sign.description}</small>
        </li>`;
};

export default function getDiseaseHTML(disease: Disease) {
  return `
  <div>
    <h2 id="disease__name">
        <span style="cursor: pointer; transform:scale(2)">&#8592;</span> 
        ${disease.name}
    </h2>
    <hr />
    ${disease?.about?.length > 0 ? `<h4 class="section">Description</h4>` : ""}
    <p id="disease__about">${disease.about}</p>
    ${disease.symptoms.length > 0 ? `<h4 class="section">Symptoms</h4>` : ""}
    <ul id="disease__symptoms">
        ${disease.symptoms.map(getSymptom).join("\n")}
    </ul>
    ${disease.signs.length > 0 ? `<h4 class="section">Signs</h4>` : ""}
    <ul id="disease__symptoms">
        ${disease.signs.map(getSign).join("\n")}
    </ul>
    <button id="backButton" class="btn">Back</span></button>
    <button id="editButton" class="btn">Edit</button>
  </div>
  `;
}
