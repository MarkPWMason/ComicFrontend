import React, { useEffect, useState } from 'react';
import { Timeline } from 'react-twitter-widgets';
import ReactPaginate from 'react-paginate';
import styles from './Content.module.css';
import 'react-select-search/style.css';
import SearchDropdown from './SearchDropdown';
import viewType from '../enums/viewType.enum';

const Content = () => {
  const [searchedComic, setSearchedComic] = useState<any>([]);
  const [view, setView] = useState<viewType>(viewType.pagination);
  const [offset, setOffset] = useState<number>(0);
  const [loadMore, setLoadMore] = useState<boolean>(true);

  const [characters, setCharacters] = useState<any>(null);
  const [searchedCharacter, setSearchedCharacter] = useState<any>('');
  const [searchedId, setSearchedId] = useState<number>();
  const [page, setPage] = useState(0);

  const comicsPerPage = 1;
  const pagesVisted = page * comicsPerPage;
  const pageCount = Math.ceil(searchedComic.length / comicsPerPage);
  const [width, setWidth] = useState(window.innerWidth ?? 1920)
  const [height, setHeight] = useState(window.innerHeight ?? 1080)

  useEffect(() => {
    function reRender() {
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
    }

    window.addEventListener('resize', reRender);
    reRender();

    return () => window.removeEventListener('resize', reRender);
}, []);



  if (characters === null) {
    //fetch the data from /getAllCharecters if it returns do setCha...
    //if it doesn't then setCh... to [] so that it doesn't loop
    fetch('http://localhost:5000/getAllCharacters', { method: 'GET' })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        if (data === null) {
          setCharacters([]);
        } else {
          setCharacters(data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const search = (
    character: string,
    id: number,
    offset: number,
    resetSearch: boolean
  ) => {
    if (character !== '') {
      const url = `http://localhost:5000/comics?id=${id}&offset=${offset}`;
      fetch(url, { method: 'GET' })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          }
        })
        .then((data) => {
          if (
            typeof data.data !== 'undefined' &&
            typeof data.data.results !== 'undefined'
          ) {
            //work out length without state to avoid race condition
            const length = resetSearch
              ? data.data.results.length
              : [...searchedComic, ...data.data.results].length;
            if (resetSearch) {
              setSearchedComic(data.data.results);
              setPage(0);
            } else {
              setSearchedComic((comics: any) => [
                ...comics,
                ...data.data.results,
              ]);
            }
            setSearchedCharacter(character);
            setSearchedId(id);
            setOffset(offset);
            const total = data.data.total;
            if (length >= total) {
              setLoadMore(false);
            } else {
              setLoadMore(true);
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const changePage = ({ selected }: any) => {
    setPage(selected);
  };

  const setPageNumber = (): number => {
    if(width < 800 && width > 550){
      return 3;
    } else if(width <= 550){
      return 1;
    }
    return 5
  }

  const setBreakLabel = (): string => {
    if(width < 500){
      return ""
    }
    return "..."
  }

  const setHeightThing = (): string => {
    if(height < 1500 && height >= 1200){
      return '1000'
    } else if (height < 1200 && height >= 950){
      return "800"
    } else if(height < 950 && height >= 800){
      return "650";
    }
    return '500'
  }

  return (
    <div className={styles.contentContainer}>
      <div className={styles.inputContainer}>
        {characters !== null && (
          <SearchDropdown
            callback={(name: string, id: number) => {
              search(name, id, 0, true);
            }}
            setSearch={setSearchedCharacter}
            search={searchedCharacter}
            values={characters}
          />
        )}
      </div>
      <div className={styles.bodyContent}>
        <div className={styles.marvelFeed}>
          <div className={styles.marvelFeedTitle}>
            <a
              className={styles.marvelFeedTitle_a}
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.marvel.com/"
            >
              {' '}
              MARVEL NEWS
            </a>
          </div>
          <div className={styles.marvelTwitter}>
            <Timeline
              dataSource={{
                sourceType: 'profile',
                screenName: 'Marvel',
              }}
              options={{height: setHeightThing()}}
            />
          </div>
        </div>
        <div className={styles.comicsContent}>
          {searchedComic.length > 0 && (
            <button
              className={styles.viewBtn}
              onClick={() => {
                setView((view) =>
                  view === viewType.pagination
                    ? viewType.list
                    : viewType.pagination
                );
              }}
            >
              {view === viewType.list
                ? 'Show Pagination View'
                : 'Show List View'}
            </button>
          )}
          {searchedComic.length === 0 && typeof searchedId !== 'undefined' && (
            <div className={styles.noComicsContainer}>
              <h1 className={styles.noComicsText}>No comics for {searchedCharacter}</h1>
              <img
                className={styles.noComicsImg}
                src="/images/sadSpidey.webp"
                alt=""
              />
            </div>
          )}
          {view === viewType.pagination && searchedComic.length > 0 && (
            <>
              {searchedComic.length > 0 &&
                typeof searchedComic[0].error === 'undefined' &&
                searchedComic
                  .slice(pagesVisted, pagesVisted + comicsPerPage)
                  .map((comic: any, index: number) => {
                    return (
                      <div key={index} className={styles.comics}>
                        <h1 className={styles.comicsContentTitle}>
                          {comic.title}
                        </h1>
                        <div className={styles.comicDetails}>
                          <img
                            className={styles.comicImage}
                            src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                            alt=""
                          />
                          
                          {
                            // dangerouslySetInnerHTML will take a string that contains html n then renders it.
                          (comic.description !== null && comic.description.trim().length !== 0) &&
                          <p className={styles.comicDescription} dangerouslySetInnerHTML={{__html: comic.description}} />}
                          {
                            (comic.description === null || comic.description.trim().length === 0) &&
                            <p className={styles.comicDescription}>No Description</p>
                          }
                        </div>
                        <button className={styles.purchaseBtn}
                          onClick={()=> {
                            window.open(comic.urls[0].url, '_blank')
                          }}
                        >
                          PURCHASE
                        </button>
                      </div>
                    );
                  })}
              {searchedComic.length > 0 && (
                <ReactPaginate
                  forcePage={page}
                  previousLabel={'PREV'}
                  nextLabel={'NEXT'}
                  pageCount={pageCount}
                  pageRangeDisplayed={setPageNumber()}
                  breakLabel={setBreakLabel()}
                  marginPagesDisplayed={setPageNumber()} 
                  onPageChange={(pageSelected) => {
                    if (
                      pageSelected.selected === pageCount - 1 &&
                      typeof searchedId !== 'undefined'
                    ) {
                      search(searchedCharacter, searchedId, offset + 20, false);
                    }
                    changePage(pageSelected);
                  }}
                  containerClassName={styles.paginationBtn}
                  previousLinkClassName={styles.prevBtn}
                  nextLinkClassName={styles.nextBtn}
                  disabledLinkClassName={styles.paginationDisabled}
                  activeLinkClassName={styles.paginationActive}
                />
              )}
              {searchedComic.length > 0 &&
                typeof searchedComic[0].error !== 'undefined' && (
                  <div>
                    <p>{searchedComic[0].error}</p>
                  </div>
                )}
            </>
          )}
          {/* Pagination View Ends */}
          {view === viewType.list && searchedComic.length > 0 && (
            <div className={styles.comicList}>
              {searchedComic.length > 0 &&
                typeof searchedComic[0].error === 'undefined' && (
                  <>
                    {searchedComic.map((comic: any, index: number) => {
                      return <p onClick={()=> {
                        setPage(index);
                        setView(viewType.pagination);
                      }} className={styles.comicsListItems}>{comic.title}</p>;
                    })}
                    {loadMore && (
                      <button
                      className={styles.loadMoreBtn}
                        onClick={() => {
                          if (typeof searchedId !== 'undefined')
                            search(
                              searchedCharacter,
                              searchedId,
                              offset + 20,
                              false
                            );
                        }}
                      >
                        Load More...
                      </button>
                    )}
                  </>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Content;
