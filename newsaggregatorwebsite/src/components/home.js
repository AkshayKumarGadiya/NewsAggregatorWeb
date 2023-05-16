import { useState, useEffect } from 'react';
import { getNews, getGuardianNews, getNewYorkNews } from '../services/newsapi';
import Select from "react-select";
// import ReactPaginate from 'react-paginate';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const defaultImageLink = 'https://via.placeholder.com/300x200.png?text=No+Image';

const Home = ({author,source}) => {
    // console.log(author + " " + source);

    var [initialData, SetinitialData] = useState([])
    const [searchNews, setSearchNews] = useState('europe');
    const [totalResults, setTotalResults] = useState(0);
    // const [currentPage, setCurrentPage] = useState(0);

    const [selectedAuthors, setSelectedAuthors] = useState();
    const [uniqueAuthorSet, setUniqueAuthorSet] = useState(new Set());
    const [selectedSouces, setSelectedSoucess] = useState();
    const [uniqueSourceSet, setUniqueSourceSet] = useState(new Set());
    const [filteredData, setFilteredData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);


    useEffect(() => {
        const fetchNewsData = async () => {
            const newsFromNewsApi = await getNews(searchNews);
            const newsFromGuardianApi = await getGuardianNews(searchNews);
            const newsFromNewYorkApi = await getNewYorkNews(searchNews);
            console.log(newsFromNewYorkApi);
            // Defined results to pericular keys
            const articlesCollectionFromNews = newsFromNewsApi.map((article) => ({
                apiname: "NewsAPI",
                title: article.title,
                description: article.description,
                url: article.url,
                source: article.source.name,
                author: article.author,
                urlToImage: article.urlToImage,
                publishedAt: article.publishedAt
            }));
            const articlesCollectionFromGuardian = newsFromGuardianApi.map((article) => {
                const fields = article.fields || {};
                return {
                apiname: "The Gurdian",
                title: article.webTitle,
                description: fields.trailText || "",
                url: article.webUrl,
                source: "The Gurdian",
                author: article.author,
                urlToImage: fields.thumbnail,
                publishedAt: article.webPublicationDate
                }
            });
            const articlesCollectionFromNYT = newsFromNewYorkApi.map((article) => ({
                apiname: 'The New York Times',
                title: article.headline.main,
                description: article.snippet,
                url: article.web_url,
                source: 'The New York Times',
                author: article.byline?.original,
                urlToImage: article.multimedia?.[0]?.url,
                publishedAt: article.pub_date,
              }));
            
            const mergedNews = [...articlesCollectionFromNews, ...articlesCollectionFromGuardian, ...articlesCollectionFromNYT];

            const uniqueSourceSet = new Set();
            const uniqueAuthorSet = new Set();
            mergedNews.forEach(article => {
                if (article.author && !uniqueAuthorSet.has(article.author)) {
                    uniqueAuthorSet.add(article.author);
                }
                const sourceName = typeof article.source === 'string' ? article.source : article.source.name;
                if (article.source && !uniqueSourceSet.has(sourceName)) {
                    uniqueSourceSet.add(sourceName);
                    setUniqueSourceSet(prevState => [...prevState, sourceName]);
                }
            });
            setUniqueAuthorSet(uniqueAuthorSet);

            // Check if user has set any preferences in past or today OR user has selected something in Authors or Sources dropdowns

            const selectedAuthorName = Array.from(author);
            const selectedSourceName = Array.from(source);
            
            if(selectedAuthorName.length || selectedSourceName.length){
                const filteredArticlesByBoth = mergedNews.filter((article) => {
                    const authorMatch = !selectedAuthorName.length || selectedAuthorName.includes(article.author);
                    const sourceMatch = !selectedSourceName.length || selectedSourceName.includes(article.source);

                    return authorMatch && sourceMatch;
                });
                if(filteredArticlesByBoth.length){
                    SetinitialData(filteredArticlesByBoth);
                    setTotalResults(filteredArticlesByBoth.length);
                }else{
                    // Message Not Found
                    SetinitialData(mergedNews);
                }
            }else{
                SetinitialData(mergedNews);
                setTotalResults(mergedNews.length);
            }
        };
        fetchNewsData();
    }, [ searchNews, author, source ], totalResults); 

    // Get search news by users
    function getInputedNewsValue(event){
        setSearchNews(event.target.value);
        setFilteredData([]);
    }
    
    // function handlePageClick(data) {
    //     console.log(data);
    //     setCurrentPage(data.selected);
    // }
    const authorOptionList = Array.from(uniqueAuthorSet).map((author) => {
        return {
          value: author,
          label: author
        }
    });
    const sourceOptionList = Array.from(uniqueSourceSet).map((author) => {
        return {
          value: author,
          label: author
        }
    });

    function handleSelect(data) {
        setSelectedAuthors(data);
        const formattedAuthorData = data.map(item => `${item.value}`);
        if(!selectedSouces || selectedSouces.length === 0){
            var filteredArticlesByAuthor = initialData.filter((article) =>
                article.author && formattedAuthorData.includes(article.author)
            );
            if(filteredArticlesByAuthor.length){
                setFilteredData(filteredArticlesByAuthor);
            }else{
                alert("Data Not Found");
                setFilteredData(initialData);
            }
        }else{
            const formattedSourceData = selectedSouces.map(item => `${item.value}`)
            var filteredArticlesByBoth = initialData.filter((article) => {
                const authorMatch = article.author && formattedAuthorData.includes(article.author);
                const sourceMatch = formattedSourceData.includes(article.source);
                return authorMatch && sourceMatch;
            });
            if(filteredArticlesByBoth.length){
                setFilteredData(filteredArticlesByBoth);
            }else{
                alert("Data Not Found");
                setFilteredData(initialData);
            }
        }
    }
    function searchBySelectedSources(source) {
        setSelectedSoucess(source);
        const formattedSourceData = source.map(item => `${item.value}`);
        if(!selectedAuthors || selectedAuthors.length === 0){
            var filteredArticlesBySource = initialData.filter((article) =>
                formattedSourceData.includes(article.source)
            );
            if(filteredArticlesBySource.length){
                setFilteredData(filteredArticlesBySource);
            }else{
                alert("Data Not Found");
                setFilteredData(initialData);
            }
        }
        else{
            const formattedAuthorData = selectedAuthors.map(item => `${item.value}`);
            var filteredArticlesByBoth = initialData.filter((article) => {
                const authorMatch = article.author && formattedAuthorData.includes(article.author);
                const sourceMatch = formattedSourceData.includes(article.source);

                return authorMatch && sourceMatch;
            });
            // console.log(filteredArticlesByBoth);
            if(filteredArticlesByBoth.length){
                setFilteredData(filteredArticlesByBoth);
            }else{
                alert("Data Not Found");
                setFilteredData(initialData);
            }
        }
    }
    function filterByDateChange(date){
        setSelectedDate(date);

        const filteredNewsByDate = initialData.filter((article) => {
            const newsDate = new Date(article.publishedAt);
            return (
                newsDate.getFullYear() === date.getFullYear() && newsDate.getMonth() === date.getMonth() && newsDate.getDate() === date.getDate()
            );
        });
        if(filteredNewsByDate.length){
            setFilteredData(filteredNewsByDate);
        }else{
            alert("Data Not Found");
            setFilteredData(initialData);
        }
    }
    return(
        <>
        <div class="row">
            <h3 className='text-center mt-3'>Read the News Online</h3>
            <div class="col-sm-12 col-md-6 col-lg-4 mt-2">
                <p className='mb-1'><b>Search News By Keyword:</b></p>
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Search News" value={searchNews} onChange={getInputedNewsValue}/>
                    <button class="btn btn-success" type="submit">Go</button>
                </div>
            </div>
            <div class="col-sm-12 col-md-6 col-lg-4 mt-2">
                <p className='mb-1'><b>Filter by Authors:</b></p>
                <div className="dropdown-container">
                    <Select
                    options={authorOptionList}
                    placeholder="Select color"
                    value={selectedAuthors}
                    onChange={handleSelect}
                    isSearchable={true}
                    isMulti
                    />
                </div>
            </div>
            <div class="col-sm-12 col-md-6 col-lg-4 mt-2">
                <p className='mb-1'><b>Filter by Source:</b></p>
                <div className="dropdown-container">
                    <Select
                    options={sourceOptionList}
                    placeholder="Select color"
                    value={selectedSouces}
                    onChange={searchBySelectedSources}
                    isSearchable={true}
                    isMulti
                    />
                </div>
            </div>
            <div class="col-sm-12 col-md-6 col-lg-4 mt-2">
                <p className='mb-1'><label htmlFor='date-picker'><b>Filter by Date:</b></label></p>
                <DatePicker id='date-picker' selected={selectedDate} onChange={filterByDateChange}></DatePicker>
            </div>
        </div>
        <div className="container">
            <p><b>Total {totalResults} news found in this criteria:</b></p>
            <div class="row">
            {filteredData.length > 0 ? (
                filteredData.map((value) => (
                // Render the articles
                    <div class="col-sm-12 col-md-6 col-lg-4 mb-2-">
                        <div className="card mb-2">
                            {value.urlToImage ? (
                                <img src={value.urlToImage} className="card-img-top" alt={value.title} />
                            ) : (
                                <img src={defaultImageLink} className="card-img-top" alt="Not Found" style={{width: "100%", height: "192px"}}/>
                            )}
                            <div className="card-body">
                                <p>{value.apiname} | {value.source}</p>
                                {value.title ? (
                                    <p className="card-title">{value.title}</p>
                                ) : (
                                    <p className="card-title">&nbsp;</p>
                                )}
                                {value.description ? (
                                    <p className="card-text">{value.description}</p>
                                ) : (
                                    <p className="card-text">&nbsp;</p>
                                )}
                                {value.author ? (
                                    <p className='mt-2 mb-0'>{value.author}</p>
                                ) : (
                                    <p className="mt-2 mb-0">&nbsp;</p>
                                )}
                                {value.publishedAt ? (
                                    <p>{value.publishedAt}</p>
                                ) : (
                                    <p>&nbsp;</p>
                                )}
                                {value.url ? (
                                    <a href={value.url} className="btn btn-primary">Read More</a>
                                ) : (
                                    <p>&nbsp;</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
            initialData.map((value) => (
                // Render the articles
                    <div class="col-sm-12 col-md-6 col-lg-4 mb-2-">
                        <div className="card mb-2">
                            {value.urlToImage ? (
                                <img src={value.urlToImage} className="card-img-top" alt={value.title} />
                            ) : (
                                <img src={defaultImageLink} className="card-img-top" alt="Not Found" style={{width: "100%", height: "192px"}}/>
                            )}
                            <div className="card-body">
                                <p>{value.apiname} | {value.source}</p>
                                {value.title ? (
                                    <p className="card-title">{value.title}</p>
                                ) : (
                                    <p className="card-title">&nbsp;</p>
                                )}
                                {value.description ? (
                                    <p className="card-text">{value.description}</p>
                                ) : (
                                    <p className="card-text">&nbsp;</p>
                                )}
                                {value.author ? (
                                    <p className='mt-2 mb-0'>{value.author}</p>
                                ) : (
                                    <p className="mt-2 mb-0">&nbsp;</p>
                                )}
                                {value.publishedAt ? (
                                    <p>{value.publishedAt}</p>
                                ) : (
                                    <p>&nbsp;</p>
                                )}
                                {value.url ? (
                                    <a href={value.url} className="btn btn-primary">Read More</a>
                                ) : (
                                    <p>&nbsp;</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
                {/* Comment In */}
                {/* {
                    initialData.map((value) => {
                        return(
                        <div class="col-sm-12 col-md-6 col-lg-4 mb-2-">
                            <div className="card mb-2">
                                {value.urlToImage ? (
                                    <img src={value.urlToImage} className="card-img-top" alt={value.title} />
                                ) : (
                                    <img src={defaultImageLink} className="card-img-top" alt="Not Found" style={{width: "100%", height: "192px"}}/>
                                )}
                                <div className="card-body">
                                    <p>{value.apiname} | {value.source}</p>
                                    {value.title ? (
                                        <p className="card-title">{value.title}</p>
                                    ) : (
                                        <p className="card-title">&nbsp;</p>
                                    )}
                                    {value.description ? (
                                        <p className="card-text">{value.description}</p>
                                    ) : (
                                        <p className="card-text">&nbsp;</p>
                                    )}
                                    {value.author ? (
                                        <p className='mt-2 mb-0'>{value.author}</p>
                                    ) : (
                                        <p className="mt-2 mb-0">&nbsp;</p>
                                    )}
                                    {value.publishedAt ? (
                                        <p>{value.publishedAt}</p>
                                    ) : (
                                        <p>&nbsp;</p>
                                    )}
                                    {value.url ? (
                                        <a href={value.url} className="btn btn-primary">Read More</a>
                                    ) : (
                                        <p>&nbsp;</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        )
                    })
                } */}
                {/* Comment Out */}
            </div>
            {/* <ReactPaginate
            nextLabel=">>"
            previousLabel="<<"
            breakLabel="..."
            forcePage={currentPage}
            pageCount={totalResults}
            renderOnZeroPageCount={null}
            onPageChange={handlePageClick}
            className="pagination"
            activeClassName="active-page"
            previousClassName="previous-page"
            nextClassName="next-page"
            /> */}
        </div>
        </>
    )
}
export default Home;