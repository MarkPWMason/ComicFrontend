import React, { useState } from 'react';

import styles from './SearchDropdown.module.css';

const SearchDropdown = ({
  values,
  search,
  setSearch,
  callback,
}: {
  values: any;
  search: any;
  setSearch: any;
  callback: any;
}) => {
  const [display, setDisplay] = useState<boolean>(false);
  const filteredSearch = values.filter((v: any) => {
    return v.value.toLowerCase().includes(search.toLowerCase());
  });
  return (
    <div className={styles.dropdown}>
      <input
        className={styles.dropbtn}
        placeholder="Search for character"
        value={search}
        onChange={(e) => {
          setDisplay(true);
          setSearch(e.currentTarget.value);
        }}
      />
      {search.length > 0 && (
        <div
          className={styles.dropdownContent}
          style={{ display: display === true ? 'block' : 'none' }}
        >
          <ul className={styles.searchList}>
            {filteredSearch.map((p: any, index: number) => {
              return (
                <li
                  key={index}
                  onClick={(e) => {
                    setDisplay(false);
                    callback(e.currentTarget.innerHTML, p.id);
                  }}
                >
                  {p.value}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
