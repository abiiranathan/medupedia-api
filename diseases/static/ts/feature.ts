"use strict";

import { Features } from "./types";

export default class Feature {
  available: HTMLSelectElement;
  chosen: HTMLSelectElement;
  filter: HTMLInputElement;
  addBtn: HTMLButtonElement;
  removeBtn: HTMLButtonElement;
  initialData: Features;

  constructor(
    available: HTMLSelectElement,
    chosen: HTMLSelectElement,
    filter: HTMLInputElement,
    addBtn: HTMLButtonElement,
    removeBtn: HTMLButtonElement,
    initialData: Features
  ) {
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
        this.chosen.querySelector(`option[value="${option}"]`)?.remove();
        this.addToAvailable(option);
      }
    });

    this.filter.addEventListener("input", e =>
      this.filterData((e.target as HTMLInputElement).value, this.initialData)
    );

    this.setData(this.initialData);
  };

  setData = (data: Features) => {
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

  filterData = (query: string, data: Features) => {
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
    this.available.querySelector(`option[value="${name}"]`)?.remove();
  };

  addToAvailable = (name: string) => {
    const option = document.createElement("option");
    option.value = name;
    option.appendChild(document.createTextNode(name));
    this.available.appendChild(option);
  };
}
