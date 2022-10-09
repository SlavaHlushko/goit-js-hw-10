'use strict';
import './css/styles.css';
import debounce from "lodash.debounce";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';


const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    box: document.querySelector('.country-info'),
};

const handleInput = (event) => {
    event.preventDefault();
    const searchCountries = event.target.value.trim().toLowerCase();
    clearResult();
    if (searchCountries !== '') {
        fetchCountries(searchCountries)
        .then(country => {
            if (country.length > 10) {
                Notify.info(
                    'Too many matches found. Please enter a more specific name.',
                    {
                        position: 'center-top',
                    }
                );
                clearResult()
                return;
            } else if (country.length === 1) {
                clearResult();
                createMarkupInfo(country);
            } else if (country.length > 1 && country.length <= 10) {
                clearResult();
                createMarkup(country);
            }
        })
            .catch(error => {
                clearResult();
                Notify.failure('Oops, there is no country with that name', {
                    position: 'center-top',
                });
                return error;

            });
    }
};

const createMarkup = (country) => {
    const result = country.map(({ name, flags }) => {
        return `<li><img src="${flags.svg}" alt="${name.official}" width="35"> &nbsp ${name.official}</li>`;
    })
        .join('');
    refs.list.insertAdjacentHTML('beforeend', result);
};

const createMarkupInfo = (country) => {
    const result = country.map(({ name, capital, population, flags, languages }) => {
        return `<h1><div><img src="${flags.svg}" alt="${
        name.official
      }" width="30"> ${name.official}</h1>
      <p><b>Capital:</b>  ${capital}</p>
      <p><b>Population:</b> ${population}</p>
      <p><b>Languages:</b> ${Object.values(languages)}</p></div>`;
    })
        .join('');
    refs.box.insertAdjacentHTML('beforeend', result);
}

function clearResult() {
  refs.list.innerHTML = '';
  refs.box.innerHTML = '';
}


refs.input.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));
