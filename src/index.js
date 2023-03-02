// завантажуєм необхідні залежності для проекту
import './css/styles.css';// стилізація сторінки
import debounce from 'lodash.debounce';// для затримки виконання функції відправки запиту на сервер
import Notiflix from 'notiflix';
import { fetchCountries} from './fetchCountries';

const DEBOUNCE_DELAY = 300;//визначає затримку для функції debounce

const searchBox = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const cleanMarkup = ref => ref.innerHTML = '';// очищує вміст HTML-елемента, переданого як параметр

const inputHandler = e => {
  const textInput = e.target.value.trim();

  if (!textInput) {
    [countryList, countryInfo].forEach(cleanMarkup);
    return;
  }

  fetchCountries(textInput)
    .then(data => {      
      data.length > 10
        ? Notiflix.Notify.info('Too many matches found. Please enter a more specific name')
        : renderMarkup(data);
    })
    .catch(() => {
      [countryList, countryInfo].forEach(cleanMarkup);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
};

const renderMarkup = data => {
  if (data.length === 1) {
    cleanMarkup(countryList);
    countryInfo.innerHTML = createInfoMarkup(data);
  } else {
    cleanMarkup(countryInfo);
    countryList.innerHTML = createListMarkup(data);
  }
};

const createListMarkup = data => data.map(({ name, flags }) => `
  <li>
    <img src="${flags.svg}" alt="${name.official}" width="80" height="50">
    ${name.official}
  </li>
`).join('');

function createInfoMarkup(data) {
  return data.map(({ name, capital, population, flags, languages }) => `
  <img src="${flags.svg}" alt="${name.official}" width="80" height="50">
  <h2>${name.official}</h2>
  <p>Capital: ${capital}</p>
  <p>Population: ${population}</p>
  <p>Languages: ${Object.values(languages)}</p>
`).join('');
}

searchBox.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));