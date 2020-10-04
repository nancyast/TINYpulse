import React, {useState, useMemo} from "react";
import Highlighter from "react-highlight-words";
import {debounce} from 'lodash';
import "./styles.css";

export default function App() {
  const [search, setSearch] = useState({
    queryString: '',
    result: [],
  });

  const fetchData = debounce((queryString) => {
    console.log("queryString", queryString);
    fetch(`https://hn.algolia.com/api/v1/search?query=${queryString}`)
      .then(res => res.json())
      .then(data => data.hits)
      .then(result => {
        const filtered = result.filter(r => r.title).map(r => r.title);
        setSearch({
          queryString,
          result: filtered,
        });
      });
  }, 700);

  const handleOnChange = (event) => {
    const queryString = event.target.value;
    fetchData(queryString);
  }

  const renderedResult = useMemo(() => {
    return search.result.map(title => (
      <Highlighter
      key={title}
      searchWords={[search.queryString]}
      autoEscape={true}
      textToHighlight={title}
      />
    ))
  }, [search]);

  return (
    <div className="App">
      <div>
        <input onChange={handleOnChange}/>
        <div>
          {renderedResult}
        </div>
      </div>
    </div>
  );
}
