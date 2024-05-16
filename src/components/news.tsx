/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useState } from "react";

import { NewsInterface } from "@/libs/types";

export function News() {
  const [news, setNews] = useState<NewsInterface[]>([]);
  const [articleNumber, setArticleNumber] = useState(3);

  useEffect(() => {
    async function getNews() {
      const response = await fetch(
        "https://saurav.tech/NewsAPI/top-headlines/category/general/us.json"
      );
      const data = await response.json();

      setNews(data.articles);
    }

    getNews();
  }, []);

  function handleClickLoadMoreNews() {
    setArticleNumber(articleNumber + 3);
  }

  return (
    <div className="space-y-3 bg-gray-100 rounded-xl pt-2">
      <h4 className="font-bold text-xl px-4">What&apos;s happening</h4>
      {news &&
        news.slice(0, articleNumber).map((article, index) => {
          return (
            <div key={index}>
              <a href={article.url} target="_blank">
                <div className="flex items-center justify-between px-4 py-2 space-x-1 hover:bg-gray-200 transition-all duration-200">
                  <div className="space-y-0.5">
                    <h6 className="text-sm font-bold">{article.title}</h6>
                    <p className="text-xs font-medium text-gray-500">
                      {article.source.name}
                    </p>
                  </div>
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    width={70}
                    className="rounded-xl"
                  />
                </div>
              </a>
            </div>
          );
        })}
      <button
        onClick={handleClickLoadMoreNews}
        className="text-sky-400 px-4 pb-3 hover:brightness-90 text-sm"
      >
        Load more
      </button>
    </div>
  );
}
