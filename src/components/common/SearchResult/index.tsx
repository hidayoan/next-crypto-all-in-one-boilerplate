import React, { useEffect, useState } from 'react'
import { Balance } from '@/components'
import { checkSymbol } from '@/crypto-all-in-one';
import './style.scss'
import { SearchResult, SearchResultPropsType } from '@/helpers/type';

function SearchResult({ list, search, onChange }: SearchResultPropsType) {
  const [result, setResult] = useState<SearchResult>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    showName(search)
  }, [search])

  const showName = async (key: string) => {
    try {
      setLoading(true)
      const find = list.find((item) => item.key === key)
      if (find) {
        setResult(find)
      } else {
        const res = await checkSymbol(null, key) as string;
        if (res) {
          setResult({
            key: search,
            value: res,
            link: `/tokens/unknown.png`
          })
        }
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setResult({})
      console.log(error);
    }
  }

  return (
    <>
      {
        loading ? (
          <div className="search-result-loading">
            Loading...
          </div>
        ) : (
          <>
            {
              result.key && (
                <div className="search-result" onClick={
                  () => {
                    onChange && onChange(result)
                  }
                }>
                  <div className="search-result__data">
                    <img src={result.link} alt="" />
                    <span>{result.value}</span>
                  </div>
                  <div className="search-result__balance">
                    <Balance tokenAddress={result.key as `0x${string}`} />
                  </div>
                </div>
              )
            }
          </>
        )
      }
    </>
  )
}

export default SearchResult