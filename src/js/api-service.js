import axios from 'axios';

const API_KEY = '34617221-40fb3a679d52688cd42ce20c8';
const BASE_URL = 'https://pixabay.com/api/';
const URL_OPTIONS =
  '&image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

export default class PhotoApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = 0;
  }

  async fetchPhotos() {
    const response = await axios.get(
      `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}${URL_OPTIONS}&page=${this.page}`
    );

    this.incrementPage();

    if (
      response.data.totalHits !== undefined &&
      response.data.totalHits !== null
    ) {
      this.totalHits = response.data.totalHits;
    }
    return response.data.hits;
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newSearchQuery) {
    this.searchQuery = newSearchQuery;
  }
}
