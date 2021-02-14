import Feature from "./feature";
import {
  Features,
  Disease,
  Diseases,
  NewDiseaseData,
  UpdatedDisease,
  SignOrSymptom,
} from "./types";

async function fetchData<T>(url: string): Promise<Array<T>> {
  const response = await fetch(url);

  if (response.status == 200) {
    const data = await response.json();
    return data;
  } else {
    throw new Error(response.statusText);
  }
}

export const fetchSymptoms = async (): Promise<Features> => {
  const url = "/api/symptoms/?query={id,name,description}";
  return await fetchData(url);
};

export const fetchSigns = async (): Promise<Features> => {
  const url = "/api/signs/?query={id,name,description}";
  return await fetchData(url);
};

export const fetchDiseases = async (): Promise<Diseases> => {
  const url = "/api/diseases/?query={id,name,signs,symptoms,about}";
  return await fetchData(url);
};

export async function handleSaveNewDisease(data: NewDiseaseData): Promise<Disease> {
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

export async function handleUpdateDisease(id: string, data: UpdatedDisease): Promise<Disease> {
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

export const saveNewSymptom = async (name: string, description: string): Promise<SignOrSymptom> => {
  const config = {
    method: "POST",
    body: JSON.stringify({ name, description }),
    headers: {
      "content-type": "application/json",
    },
  };

  const res = await fetch(`/api/symptoms/`, config);
  const symptom = await res.json();

  if (res.ok) {
    return symptom;
  } else {
    throw new Error(res.statusText);
  }
};

export const saveNewSign = async (name: string, description: string): Promise<SignOrSymptom> => {
  const config = {
    method: "POST",
    body: JSON.stringify({ name, description }),
    headers: {
      "content-type": "application/json",
    },
  };

  const res = await fetch(`/api/signs/`, config);
  const sign = await res.json();

  if (res.ok) {
    return sign;
  } else {
    throw new Error(res.statusText);
  }
};
