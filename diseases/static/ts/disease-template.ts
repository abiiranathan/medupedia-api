import { Disease, SignOrSymptom } from "./types";

const getSymptom = (symptom: SignOrSymptom) => {
  return `
        <li>
            <span>${symptom.name}</span><br>
            <span>${symptom.description}</span>
        </li>`;
};

const getSign = (sign: SignOrSymptom) => {
  return `
        <li>
            <span>${sign.name}</span><br>
            <span>${sign.description}</span>
        </li>`;
};

export default function getDiseaseHTML(disease: Disease) {
  return `
  <div class="disease-detail">
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
  </div>
  `;
}
