import PhotoApiService from './js/api-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const refs = {
  searchForm: document.querySelector('#search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  photosContainer: document.querySelector('.gallery'),
};

const photoApiService = new PhotoApiService();
const lightbox = new SimpleLightbox('.gallery a');

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  clearPhotosContainer();
  photoApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  hideLoadMoreBtn();

  photoApiService.resetPage();
  photoApiService.fetchPhotos().then(images => {
    if (images.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      hideLoadMoreBtn();
    } else {
      showLoadMoreBtn();
    }

    renderImages(images);
    Notiflix.Notify.success(
      `Hooray! We found ${photoApiService.totalHits} images.`
    );
  });
}

function onLoadMore() {
  photoApiService.fetchPhotos().then(images => {
    renderImages(images);

    if (
      photoApiService.totalHits !== null &&
      photoApiService.page * 40 >= photoApiService.totalHits
    ) {
      hideLoadMoreBtn();
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}

function renderImages(images) {
  const cardsMarkup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        likes,
        views,
        comments,
        downloads,
        tags,
      }) => `
      <a href="${largeImageURL}">
        <div class="photo-card">
          <img src="${webformatURL}" alt="${tags}" width="320"  loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes</b> ${likes}
            </p>
            <p class="info-item">
              <b>Views</b> ${views}
            </p>
            <p class="info-item">
              <b>Comments</b> ${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b> ${downloads}
            </p>
          </div>
        </div>
      </a>
    `
    )
    .join('');

  refs.photosContainer.innerHTML = cardsMarkup;
  lightbox.refresh();
}

function clearPhotosContainer() {
  refs.photosContainer.innerHTML = '';
}

function showLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}

function hideLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
}
