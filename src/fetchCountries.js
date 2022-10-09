'use strict';
const url = 'https://restcountries.com/v3.1/name/';
const fields = 'name,capital,population,flags,languages';

export function fetchCountries(name) {
  return fetch(`${url}${name}?fields=${fields}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}