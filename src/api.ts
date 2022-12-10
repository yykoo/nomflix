const API_KEY = "63d6a4568b856a293b197991ef4506ed";
const BASE_PATH = "https://api.themoviedb.org/3";

interface iMovie {
    id: number,
    backdrop_path: string,
    overview: string,
    poster_path: string,
    title: string,
    vote_average: number,
    vote_count: number,
    release_date: string,
}

export interface IGetMoviesResult {
    dates: {
        maximum: string,
        minimum: string,
    },
    page: number,
    results: iMovie[],
    total_pages: number,
    total_results:number,
}

export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}

/*
https://api.themoviedb.org/3/search/multi?api_key=<<api_key>>&language=en-US&query=dune&page=1&include_adult=false
*/
