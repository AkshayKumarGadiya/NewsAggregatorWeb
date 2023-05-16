import axios from 'axios';
// NewsAPIs
// export const getNews = async (query) => {
//     const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=68c22b5e6aa148a3a71b34c6233ddd2a`;
//     const response = await fetch(url);
//     const data = await response.json();
//     return data.articles;
// };

const API_KEY = 'd8b710f93d0c4843aeb62b057be3cb77';
const BASE_URL = 'https://newsapi.org/v2/everything';

export const getNews = async (query) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          q: query,
          apiKey: API_KEY,
        },
      });
      return response.data.articles;
    } catch (error) {
      console.error(error);
      return [];
    }
};

// export const fetchAuthors = async () => {
//     const url = `https://newsapi.org/v2/everything/sources?apiKey=68c22b5e6aa148a3a71b34c6233ddd2a`;
//     const response = await axios.get(url);
//     const sources = response.data.sources;
//     const authors = sources.reduce((acc, curr) => {
//         acc.push(...curr.sortBysAvailable);
//         return acc;
//     }, []);
//     return [...new Set(authors)];
// };

// The Guardian APIs
export const getGuardianNews = async (query) => {
    const url = `https://content.guardianapis.com/search?q=${query}&api-key=9871de79-9b42-4f5b-8de3-88f596816722`;
    const response = await fetch(url);
    const data = await response.json();
    return data.response.results;
};

// const BASE_URL_GUARDIAN = 'https://content.guardianapis.com';

// const guardianApi = axios.create({
//   baseURL: BASE_URL_GUARDIAN,
//   params: {
//     'api-key': "test",
//   },
// });

// // Function to fetch news from The Guardian API
// export const getGuardianNews = (query) => {
//   const url = '/search';
//   const params = {
//     q: query
//   };

//   return guardianApi.get(url, { params }).then((response) => {
//     return response.data.response.results;
//   });
// };

// The New York APIs
export const getNewYorkNews = async (query) => {
  const NEWYORK_API_KEY = '4AFcjArkL8hodtrrFBU5YTpPSBmV7Nk3';
  const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=${NEWYORK_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.response?.docs || [];
  } catch (error) {
    console.error('Error fetching news from The New York Times API:', error);
    throw error;
  }
};