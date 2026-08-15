export type GarmentType =
  | 'Lehenga Choli'
  | 'Gharara'
  | 'Sharara'
  | 'Peshwas'
  | 'Anarkali'
  | 'Saree'
  | 'Maxi/Gown'
  | 'Shalwar/Kameez'
  | 'Kurti with palazzo/pants'
  | 'Angrakha'
  | 'Other';

export type DifficultyLevel = 'Easy (tailor can do)' | 'Medium' | 'Needs designer';

export interface RestyleIdea {
  idea_id: number;
  garment_type: GarmentType;
  dominant_color: string;
  fabric_type: string[];
  original_style_tags: string[];
  restyle_output: string;
  restyle_description: string;
  difficulty_level: DifficultyLevel;
  source_link: string;
  after_image_reference: string;
}

export interface RestyleRequest {
  photoDataUrl: string | null;
  garment_type: GarmentType | '';
  dominant_color: string;
  fabric_type: string[];
  original_style_tags: string[];
  wish: string;
}

export interface ScoredIdea {
  idea: RestyleIdea;
  score: number;
  reasons: string[];
}
