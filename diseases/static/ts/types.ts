export interface SignOrSymptom {
  id: number;
  name: string;
  description: string;
}

export interface Disease {
  id: number;
  name: string;
  about: string;
  symptoms: SignOrSymptom[];
  signs: SignOrSymptom[];
}

export interface NewDiseaseData {
  name: string;
  about: string;
  symptoms: SignOrSymptom[];
  signs: SignOrSymptom[];
}

export interface UpdatedDisease {
  about: string;
  symptoms: SignOrSymptom[];
  signs: SignOrSymptom[];
}

export type Features = Array<SignOrSymptom>;
export type Diseases = Array<Disease>;
