"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Javascript for Medupedia -> Could have been easier with a framework(like React)
// but why not use typescript and keep the dependency graph to zero(other than TS)
// Feel free to submit Pull Requests and Issues
// Use this code in any project you desire.
// Sample project is hosted at: https://medupedia.pythonanywhere.com
// Dr. Abiira Nathan via @abiiranathan
var tabs = document.querySelectorAll(".tablinks");
var tabWidget = document.querySelector(".tabWidget");
// symptoms
var available_symptoms = document.getElementById("available_symptoms");
var chosen_symptoms = document.getElementById("chosen_symptoms");
var filter_symptoms = document.getElementById("filter_symptoms");
var addSymptomBtn = document.querySelector("button.arrow.right");
var rmvSymptomBtn = document.querySelector("button.arrow.left");
// Signs
var available_signs = document.getElementById("available_signs");
var chosen_signs = document.getElementById("chosen_signs");
var filter_signs = document.getElementById("filter_signs");
var addSignBtn = document.querySelector("button.arrow.right.sign");
var rmvSignBtn = document.querySelector("button.arrow.left.sign");
// diseases
var searchInput = document.querySelector(".search-diseases");
var diseaseList = document.querySelector("#disease_list");
var addDiseaseForm = document.querySelector("#add-disease-form");
var editForm = document.getElementById("edit-disease-form");
var TABS_OPEN = "tabs-open";
var DISEASE = "disease";
// Could have used enum here
var STATES = {
    OPEN: "yes",
    NOT_OPEN: "no"
};
// Store signs and symptoms as global variables
var signs, symptoms, diseases;
// The feature encapsulates the logic for a django-admin-style multi-select dropdowns
// Easy to add and remove signs or symptoms when registering a new disease.
var Feature = /** @class */ (function () {
    function Feature(available, chosen, filter, addBtn, removeBtn, initialData) {
        var _this = this;
        this.start = function () {
            _this.addBtn.addEventListener("click", function () {
                var selected = Array.from(_this.available.selectedOptions).map(function (o) { return o.value; });
                var alreadySelected = Array.from(_this.chosen.options).map(function (o) { return o.value; });
                for (var _i = 0, selected_1 = selected; _i < selected_1.length; _i++) {
                    var name_1 = selected_1[_i];
                    if (!alreadySelected.includes(name_1)) {
                        _this.addToChosenData(name_1);
                    }
                }
            });
            _this.removeBtn.addEventListener("click", function () {
                var optionsToRemove = Array.from(_this.chosen.selectedOptions).map(function (o) { return o.value; });
                for (var _i = 0, optionsToRemove_1 = optionsToRemove; _i < optionsToRemove_1.length; _i++) {
                    var option = optionsToRemove_1[_i];
                    _this.chosen.querySelector("option[value=\"" + option + "\"]").remove();
                    _this.addToAvailable(option);
                }
            });
            _this.filter.addEventListener("input", function (e) {
                return _this.filterData(e.target.value, _this.initialData);
            });
            _this.setData(_this.initialData);
        };
        this.setData = function (data) {
            _this.available.innerHTML = "";
            var alreadySelected = Array.from(_this.chosen.options).map(function (o) { return o.value; });
            data
                .filter(function (s) { return !alreadySelected.includes(s.name); })
                .forEach(function (_a) {
                var name = _a.name;
                var option = document.createElement("option");
                option.value = name;
                option.appendChild(document.createTextNode(name));
                _this.available.appendChild(option);
            });
        };
        this.filterData = function (query, data) {
            if (query !== "") {
                var filtered_data = data.filter(function (s) { return s.name.toLowerCase().indexOf(query.toLowerCase()) > -1; });
                _this.setData(filtered_data);
            }
            else {
                _this.setData(data);
            }
        };
        this.addToChosenData = function (name) {
            var option = document.createElement("option");
            option.value = name;
            option.appendChild(document.createTextNode(name));
            _this.chosen.appendChild(option);
            _this.removeFromAvailable(name);
        };
        this.removeFromAvailable = function (name) {
            _this.available.querySelector("option[value=\"" + name + "\"]").remove();
        };
        this.addToAvailable = function (name) {
            var option = document.createElement("option");
            option.value = name;
            option.appendChild(document.createTextNode(name));
            _this.available.appendChild(option);
        };
        this.available = available;
        this.chosen = chosen;
        this.filter = filter;
        this.addBtn = addBtn;
        this.removeBtn = removeBtn;
        this.initialData = initialData;
    }
    return Feature;
}());
function fetchData(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _a.sent();
                    if (!(response.status == 200)) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 3: throw new Error(response.statusText);
            }
        });
    });
}
var fetchSymptoms = function () { return __awaiter(void 0, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "/api/symptoms/?query={id, name, description}";
                return [4 /*yield*/, fetchData(url)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var fetchSigns = function () { return __awaiter(void 0, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "/api/signs/?query={id, name, description}";
                return [4 /*yield*/, fetchData(url)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var fetchDiseases = function () { return __awaiter(void 0, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "/api/diseases/?query={id, name, signs, symptoms, about}";
                return [4 /*yield*/, fetchData(url)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var setUpSymptoms = function (symptoms) {
    new Feature(available_symptoms, chosen_symptoms, filter_symptoms, addSymptomBtn, rmvSymptomBtn, symptoms).start();
};
var setUpSigns = function (signs) {
    new Feature(available_signs, chosen_signs, filter_signs, addSignBtn, rmvSignBtn, signs).start();
};
function populateDiseases(diseases, clear) {
    var _a, _b;
    if (clear === void 0) { clear = true; }
    if (clear) {
        diseaseList.innerHTML = "";
    }
    var _loop_1 = function (disease) {
        var item = document.createElement("li");
        var txtNode = document.createTextNode(disease.name);
        item.setAttribute("id", disease.id.toString());
        item.title = (_b = (_a = disease.about) === null || _a === void 0 ? void 0 : _a.slice(0, 20)) !== null && _b !== void 0 ? _b : "";
        item.appendChild(txtNode);
        item.addEventListener("click", function () {
            showDiseaseDetail(disease);
        });
        diseaseList.appendChild(item);
    };
    for (var _i = 0, diseases_1 = diseases; _i < diseases_1.length; _i++) {
        var disease = diseases_1[_i];
        _loop_1(disease);
    }
}
function setUpDiseases(diseases) {
    populateDiseases(diseases);
    searchInput.addEventListener("input", function (e) {
        var filteredDiseases = diseases.filter(function (d) {
            return d.name
                .toLocaleLowerCase()
                .indexOf(e.target.value.toLocaleLowerCase()) > -1;
        });
        populateDiseases(filteredDiseases);
    });
}
function showErrorMessage() {
    var parag = document.querySelector(".no-connection");
    parag.style.display = "block";
}
function hideErrorMessage() {
    var parag = document.querySelector(".no-connection");
    parag.style.display = "none";
}
function showSpinner() {
    var parag = document.querySelector(".loading");
    parag.style.display = "block";
}
function hideSpinner() {
    var parag = document.querySelector(".loading");
    parag.style.display = "none";
}
// Handle saving new-disease
addDiseaseForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!symptoms || !signs || !diseases)
        return;
    var name = addDiseaseForm.querySelector("#name").value;
    var about = addDiseaseForm.querySelector("#about").value;
    var selectedSymptoms = symptoms.filter(function (s) {
        return Array.from(chosen_symptoms.options)
            .map(function (option) { return option.value; })
            .includes(s.name);
    });
    var selectedSigns = signs.filter(function (s) {
        return Array.from(chosen_signs.options)
            .map(function (option) { return option.value; })
            .includes(s.name);
    });
    var data = {
        name: name,
        symptoms: selectedSymptoms,
        signs: selectedSigns,
        about: about
    };
    handleSaveNewDisease(data)
        .then(function (savedDisease) {
        populateDiseases([savedDisease], false);
        hideDiseaseDetail();
        alert(savedDisease.name + " registered successfully!");
    })["catch"](function (err) {
        showNameExists(err);
    });
});
// Disease name validation(onChange)
// onChange sometimes does not fire(Happy with input event for now)
addDiseaseForm.querySelector("#name").addEventListener("input", function (e) {
    var input = e.target;
    var name = input.value.trim();
    var msg = name + " is already registered";
    if (diseases.map(function (d) { return d.name; }).includes(name)) {
        input.style.borderColor = "tomato";
        showNameExists(msg);
    }
    else {
        input.style.borderColor = "lightblue";
        hideNameExists();
    }
});
editForm.addEventListener("submit", function (e) { return __awaiter(void 0, void 0, void 0, function () {
    var form, chosen_symptoms, chosen_signs, id, about, selectedSymptoms, selectedSigns, data, disease_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                form = e.currentTarget;
                chosen_symptoms = form.querySelector("#chosen_symptoms");
                chosen_signs = form.querySelector("#chosen_signs");
                id = form.getAttribute("data-id");
                if (!id) return [3 /*break*/, 4];
                about = form.querySelector("#about").value;
                selectedSymptoms = symptoms.filter(function (s) {
                    return Array.from(chosen_symptoms.options)
                        .map(function (option) { return option.value; })
                        .includes(s.name);
                });
                selectedSigns = signs.filter(function (s) {
                    return Array.from(chosen_signs.options)
                        .map(function (option) { return option.value; })
                        .includes(s.name);
                });
                data = {
                    symptoms: selectedSymptoms,
                    signs: selectedSigns,
                    about: about
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, handleUpdateDisease(id, data)];
            case 2:
                disease_1 = _a.sent();
                diseases = diseases.map(function (d) { return (d.id === disease_1.id ? disease_1 : d); });
                populateDiseases(diseases, true);
                hideDiseaseDetail();
                editForm.style.display = "none";
                alert(disease_1.name + " updated successfully!");
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
function initializePage() {
    return __awaiter(this, void 0, void 0, function () {
        var _loop_2, i, _a, diseasesList, symptomsList, signsList, error_2, activeDisease, match;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _loop_2 = function (i) {
                        var element = tabs[i];
                        element.addEventListener("click", function (e) {
                            openTab(e, element.getAttribute("data-target"));
                        });
                        document.querySelector("button[defaultOpen]").click();
                    };
                    for (i = 0; i < tabs.length; i++) {
                        _loop_2(i);
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    showSpinner();
                    return [4 /*yield*/, Promise.all([
                            fetchDiseases(),
                            fetchSymptoms(),
                            fetchSigns(),
                        ])];
                case 2:
                    _a = _b.sent(), diseasesList = _a[0], symptomsList = _a[1], signsList = _a[2];
                    hideErrorMessage();
                    symptoms = symptomsList;
                    signs = signsList;
                    diseases = diseasesList;
                    setUpSymptoms(symptoms);
                    setUpSigns(signs);
                    setUpDiseases(diseases);
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _b.sent();
                    showErrorMessage();
                    return [3 /*break*/, 5];
                case 4:
                    hideSpinner();
                    return [7 /*endfinally*/];
                case 5:
                    activeDisease = JSON.parse(localStorage.getItem(DISEASE));
                    if (activeDisease != null && localStorage.getItem(TABS_OPEN) === STATES.NOT_OPEN) {
                        match = diseases.find(function (d) { return d.id === (activeDisease === null || activeDisease === void 0 ? void 0 : activeDisease.id); });
                        if (match) {
                            showDiseaseDetail(match);
                        }
                        else {
                            localStorage.removeItem(DISEASE);
                            hideDiseaseDetail();
                        }
                    }
                    else {
                        hideDiseaseDetail();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function editDisease() {
    // Edit the currently selected disease
    // Get it from local storage
    var storedDisease = JSON.parse(localStorage.getItem(DISEASE));
    var activeDisease = diseases.find(function (d) { return d.id === (storedDisease === null || storedDisease === void 0 ? void 0 : storedDisease.id); });
    if (activeDisease) {
        hideDiseaseDetail();
        tabWidget.style.display = "none";
        editForm.style.display = "block";
        // Set the name
        editForm.querySelector(".disease-name").innerHTML = activeDisease.name;
        editForm.querySelector("#about").innerHTML = activeDisease.about;
        editForm.setAttribute("data-id", activeDisease.id.toString());
        var cancelBtn = editForm.querySelector("#cancel-disease-edit");
        // symptoms
        var available_symptoms_1 = editForm.querySelector("#available_symptoms");
        var chosen_symptoms_1 = editForm.querySelector("#chosen_symptoms");
        var filter_symptoms_1 = editForm.querySelector("#filter_symptoms");
        var addSymptomBtn_1 = editForm.querySelector("button.arrow.right");
        var rmvSymptomBtn_1 = editForm.querySelector("button.arrow.left");
        // Signs
        var available_signs_1 = editForm.querySelector("#available_signs");
        var chosen_signs_1 = editForm.querySelector("#chosen_signs");
        var filter_signs_1 = editForm.querySelector("#filter_signs");
        var addSignBtn_1 = editForm.querySelector("button.arrow.right.sign");
        var rmvSignBtn_1 = editForm.querySelector("button.arrow.left.sign");
        var setUpNewDiseaseSymptoms = function (symptoms) {
            new Feature(available_symptoms_1, chosen_symptoms_1, filter_symptoms_1, addSymptomBtn_1, rmvSymptomBtn_1, symptoms).start();
        };
        var setUpNewDiseaseSigns = function (signs) {
            new Feature(available_signs_1, chosen_signs_1, filter_signs_1, addSignBtn_1, rmvSignBtn_1, signs).start();
        };
        var selectItems = function (selectElem, data, callback) {
            // Set current signs and symptoms
            // First select symptoms programmatically
            for (var i = 0; i < selectElem.options.length; i++) {
                var option = selectElem.options[i];
                if (data.map(function (item) { return item.name; }).includes(option.value)) {
                    option.setAttribute("selected", "selected");
                }
                else {
                    option.removeAttribute("selected");
                }
            }
            callback();
        };
        setUpNewDiseaseSymptoms(symptoms);
        setUpNewDiseaseSigns(signs);
        selectItems(available_symptoms_1, activeDisease.symptoms, function () {
            addSymptomBtn_1.click();
        });
        selectItems(available_signs_1, activeDisease.signs, function () {
            addSignBtn_1.click();
        });
        cancelBtn.onclick = function () {
            showDiseaseDetail(activeDisease);
        };
    }
}
function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;
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
    evt.currentTarget.className += " active";
}
function hideDiseaseDetail() {
    var tabWidget = document.querySelector(".tabWidget");
    tabWidget.style.display = "block";
    var diseaseDetail = document.querySelector(".disease-detail");
    diseaseDetail.innerHTML = "";
    diseaseDetail.style.display = "none";
    localStorage.setItem(TABS_OPEN, STATES.OPEN);
    localStorage.setItem(DISEASE, JSON.stringify(null));
}
function handleSaveNewDisease(data) {
    return __awaiter(this, void 0, void 0, function () {
        var config, res, disease;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: {
                            "content-type": "application/json"
                        }
                    };
                    return [4 /*yield*/, fetch("/api/diseases/", config)];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    disease = _a.sent();
                    if (res.status === 201) {
                        return [2 /*return*/, disease];
                    }
                    else {
                        if (typeof disease === "object" && (Object === null || Object === void 0 ? void 0 : Object.keys(disease).includes("name"))) {
                            throw new Error(data.name + " has already been registered");
                        }
                        throw new Error(res.statusText);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function handleUpdateDisease(id, data) {
    return __awaiter(this, void 0, void 0, function () {
        var config, res, disease;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = {
                        method: "PATCH",
                        body: JSON.stringify(data),
                        headers: {
                            "content-type": "application/json"
                        }
                    };
                    return [4 /*yield*/, fetch("/api/diseases/" + id + "/", config)];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    disease = _a.sent();
                    if (res.ok) {
                        return [2 /*return*/, disease];
                    }
                    else {
                        throw new Error(res.statusText);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function showNameExists(err) {
    var errorResponses = document.querySelectorAll(".error-response");
    for (var i = 0; i < errorResponses.length; i++) {
        var elem = errorResponses[i];
        elem.innerHTML = err;
        elem.style.visibility = "visible";
    }
}
function hideNameExists() {
    var errorResponses = document.querySelectorAll(".error-response");
    for (var i = 0; i < errorResponses.length; i++) {
        var elem = errorResponses[i];
        elem.style.visibility = "hidden";
    }
}
function showDiseaseDetail(disease) {
    var _a;
    tabWidget.style.display = "none";
    editForm.style.display = "none";
    var diseaseDetail = document.querySelector(".disease-detail");
    diseaseDetail.innerHTML = "";
    // Show card for disease
    var diseaseStr = "\n  <div>\n    <h2 id=\"disease__name\"><span style=\"cursor: pointer; transform:scale(2)\" onclick=\"hideDiseaseDetail()\">&#8592;</span> " + disease.name + "</h2>\n    <hr />\n    " + (((_a = disease === null || disease === void 0 ? void 0 : disease.about) === null || _a === void 0 ? void 0 : _a.length) > 0 ? "<h4 class=\"section\">Description</h4>" : "") + "\n    <p id=\"disease__about\">" + disease.about + "</p>\n    " + (disease.symptoms.length > 0 ? "<h4 class=\"section\">Symptoms</h4>" : "") + "\n    <ul id=\"disease__symptoms\">\n    " + disease.symptoms
        .map(function (symptom) {
        return "<li><small><b>" + symptom.name + "</b></small><br><small>" + symptom.description + "</small></li>";
    })
        .join("\n") + "\n    </ul>\n    " + (disease.signs.length > 0 ? "<h4 class=\"section\">Signs</h4>" : "") + "\n    <ul id=\"disease__symptoms\">\n    " + disease.signs
        .map(function (sign) { return "<li><small><b>" + sign.name + "</b><br></small><small>" + sign.description + "</small></li>"; })
        .join("\n") + "</ul>\n    <button id=\"backButton\" class=\"btn\" onclick=\"hideDiseaseDetail();\">Back</span></button>\n    <button id=\"editButton\" class=\"btn\" onclick=\"editDisease();\">Edit</button>\n  </div>\n  ";
    diseaseDetail.innerHTML = diseaseStr;
    diseaseDetail.style.display = "block";
    localStorage.setItem(TABS_OPEN, STATES.NOT_OPEN);
    localStorage.setItem(DISEASE, JSON.stringify(disease));
}
document.addEventListener("DOMContentLoaded", initializePage);
