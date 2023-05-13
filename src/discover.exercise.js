/** @jsx jsx */
import { jsx } from '@emotion/core'
import { useState, useEffect } from 'react'
import './bootstrap'
import Tooltip from '@reach/tooltip'
import { FaSearch, FaTimes } from 'react-icons/fa'
import { Input, BookListUL, Spinner } from './components/lib'
import { BookRow } from './components/book-row'
// 🐨 import the client from './utils/api-client'
import { client } from './utils/api-client';
import * as colors from './styles/colors';
import { useAsync } from 'utils/hooks'


function DiscoverBooksScreen() {

  const [query, setQuery] = useState('');
  const { data, error, run, isIdle, isLoading, isError, isSuccess } = useAsync()

  useEffect(() => {
    if (!query) return;
    run(client(`books?query=${encodeURIComponent(query)}`))
  }, [run, query])

  function handleSearchSubmit(event) {
    event.preventDefault();
    setQuery(event.target.elements.search.value);
  }

  return (
    <div
      css={{ maxWidth: 800, margin: 'auto', width: '90vw', padding: '40px 0' }}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Search books..."
          id="search"
          css={{ width: '100%' }}
        />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: '0',
                position: 'relative',
                marginLeft: '-35px',
                background: 'transparent',
              }}
            >
              {isLoading ? <Spinner /> : null}
              {isSuccess || isIdle ? <FaSearch aria-label="search" /> : null}
              {isError ? <FaTimes aria-label="error" css={{ color: colors.danger }} /> : null}
            </button>
          </label>
        </Tooltip>
      </form>
      {isIdle ? (
        <div css={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
          <h1>Welcome to the Bookshelf App</h1>
        </div>
      ) : null}
      {
        isError ? (
          <div css={{ color: colors.danger }}>
            <p>There was an error:</p>
            <pre>{error.message}</pre>
          </div>
        ) : null
      }
      {isSuccess ? (
        data?.books?.length ? (
          <BookListUL css={{ marginTop: 20 }}>
            {data.books.map(book => (
              <li key={book.id} aria-label={book.title}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <p>No books found. Try another search.</p>
        )
      ) : null}
    </div>
  )
}

export { DiscoverBooksScreen }
