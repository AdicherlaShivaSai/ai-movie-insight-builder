export interface CastMember {
  name: string;
  character: string;
}

export interface MovieData {
  title: string;
  poster: string;
  releaseYear: string;
  rating: number;
  plot: string;
  cast: CastMember[];
}