import React, { useState, useEffect } from 'react';
import { getNews, getGuardianNews, getNewYorkNews } from '../services/newsapi';
import AuthUser from "../services/authenticationapi";

const Preference = ({ setAuthor, setSourcesInfo }) => {
    const [authors, setAuthors] = useState([]);
    const [sources, setSources] = useState([]);
    const [savedAuthors, setSavedAuthors] = useState(new Set());
    const [savedSources, setSavedSources] = useState([]);
    const {http} = AuthUser();
  
    useEffect(() => {
        const fetchAuthorData = async () => {
            const articlesFromNews = await getNews("europe");
            const articlesFromGuradian = await getGuardianNews("europe");
            const articlesFromNYT = await getNewYorkNews("europe");

            // Defined results to pericular keys
            const authorCollectionFromNews = articlesFromNews.map((article) => ({
                source: article.source.name,
                author: article.author
            }));
            const authorCollectionFromGuardian = articlesFromGuradian.map((article) => ({
                source: "The Gurdian",
                author: article.fields?.byline || ""
            }));
            const authorCollectionFromNYT = articlesFromNYT.map((article) => ({
                source: 'The New York Times',
                author: article.byline?.original
            }));

            const articles = [...authorCollectionFromNews, ...authorCollectionFromGuardian, ...authorCollectionFromNYT];
            
            const uniqueSourceSet = new Set();
            const uniqueAuthorSet = new Set();
            articles.forEach(article => {
                if (article.author && !uniqueAuthorSet.has(article.author)) {
                    uniqueAuthorSet.add(article.author);
                }
                const sourceName = typeof article.source === 'string' ? article.source : article.source.name;
                if (article.source && !uniqueSourceSet.has(sourceName)) {
                    uniqueSourceSet.add(sourceName);
                    setSources(prevState => [...prevState, sourceName]);
                }
            });
            setAuthors(Array.from(uniqueAuthorSet));
        };
        fetchAuthorData();
    }, []);

    // Get and Stored Authors and Sources
    useEffect(() => {
        //  Authors
        const savedAuthorsJson = localStorage.getItem('authors');
        if (savedAuthorsJson) {
            const savedAuthorsSet = new Set(JSON.parse(savedAuthorsJson));
            setSavedAuthors(savedAuthorsSet);
        }
        //  Sources
        const savedSourcesJson= JSON.parse(localStorage.getItem("sources"));
        if (savedSourcesJson) {
            setSavedSources(savedSourcesJson);
        }
    }, []);

    useEffect(() => {
        //  Store Sources
        const savedSourceJson = JSON.stringify(Array.from(savedSources));
        localStorage.setItem('sources', savedSourceJson);
        // localStorage.setItem("sources", JSON.stringify(savedSources));

        //  Store Authors
        const savedAuthorsJson = JSON.stringify(Array.from(savedAuthors));
        localStorage.setItem('authors', savedAuthorsJson);
        
        // Save user preferences as well as sources in datatable
        // http.post('/preferences', {authors: savedAuthorsJson, sources: savedSourceJson}).then(response => {
        //     console.log(response.data.message)
        // }).catch(error => {
        //     console.log(error);
        // })

        setAuthor(Array.from(savedAuthors));
        setSourcesInfo(Array.from(savedSources));
    }, [savedAuthors, savedSources]);

    const saveSelectedAuthorInformation = (event) => {
        const authorName = event.target.name;
        const isChecked = event.target.checked;
        if (isChecked) {
            savedAuthors.add(authorName);
            alert(`${authorName} is successfully set`);
        } else {
            savedAuthors.delete(authorName);
            alert(`${authorName} is successfully removed`);
        }
        setSavedAuthors(new Set(savedAuthors));
    };

    const saveSelectedSourceInformation = event => {
        const selectedSourceId = event.target.name;
        const isChecked = event.target.checked;
        if (isChecked) {
            setSavedSources(prevState => [...prevState, selectedSourceId]);
            alert(`${selectedSourceId} is successfully set`);
        } else {
            setSavedSources(prevState => prevState.filter(source => source !== selectedSourceId));
            alert(`${selectedSourceId} is successfully removed`);
        }
    };

    const clearPreferences = () => {
        localStorage.clear();
        alert("All preferences are clear")
        // Delete all preferences from database
    }    
  
    return (
        <div>
            <h1 className='text-center'>Preferences</h1>
            <p className='text-center'>Adjust settings to personalize your experience on this platform.</p>
            <hr />
            <div className='row'>
                <div class="col-sm-12 col-md-6 col-lg-6">
                    <h3>Authors</h3>
                    <p>I would like to read news only from the authors listed below.</p>
                    {authors.map((author) => (
                        <div key={author}>
                            <input type="checkbox" name={author} checked={savedAuthors.has(author)} onChange={saveSelectedAuthorInformation} />
                            <label style={{margin: "5px"}}>{author}</label>
                        </div>
                    ))}
                </div>
                <div class="col-sm-12 col-md-6 col-lg-6">
                    <h3>Sources</h3>
                    <p>Show me news only from the sources listed below.</p>
                    {sources.map(source => (
                        <div key={source}>
                        <input type="checkbox" name={source} onChange={saveSelectedSourceInformation} checked={savedSources.includes(source)}
                        />
                        <label style={{ margin: "5px" }}>{source}</label>
                        </div>
                    ))}
                    <button type="button" className="btn btn-primary mt-5" onClick={clearPreferences}>Clear All Preferences</button>   
                </div>
                
            </div>
        </div>
    );
  }
  
  export default Preference;