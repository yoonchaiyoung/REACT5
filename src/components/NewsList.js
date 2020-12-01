import axios from "axios";
import React from "react";
import styled from "styled-components";
import usePromise from "../lib/usePromise";
import NewsItem from "./NewsItem";

const NewsListBlock = styled.div`
  box-sizing: border-box;
  padding-bottom: 3rem;
  width: 768px;
  margin: 0 auto;
  margin-top: 2rem;
  @media screen and (max-width: 768px) {
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

// 비동기 통신이 일어나는 컴포넌트
// 1) 비동기 통신이 일어나야 하는 "타이밍"을 잘 생각해야 한다.
// -> useEffect를 이용해 타이밍 정의(의존성 리스트)
// 2) 데이터의 수신 상태 (로딩, 완료, 에러)

const API_KEY = "536fa50ec1c0421583ca92919afb2282";

// NewsPage에서 category를 전달하고, NewsList에서 받는다.
const NewsList = ({ category }) => {
  const [loading, response, error] = usePromise(() => {
    const query = category === "all" ? "" : `&category=${category}`;
    return axios.get(
      `https://newsapi.org/v2/top-headlines?country=kr${query}&apiKey=${API_KEY}`
    );
  }, [category]);

  // 로딩중에 표시해줄 내용
  if (loading) {
    return <NewsListBlock>뉴스 로딩중...</NewsListBlock>;
  }

  // 응답된 게 없으면 아무것도 표시 X
  if (!response) {
    return null;
  }

  // 에러 발생시에는 에러 발생 메세지
  if (error) {
    return <NewsListBlock>에러 발생</NewsListBlock>;
  }
  //   console.log(response);
  // response -> data -> articles에 뉴스기사들 있는 것 확인
  const { articles } = response.data; // unpacking

  return (
    <NewsListBlock>
      {articles.map((article) => (
        <NewsItem key={article.url} article={article} />
      ))}
    </NewsListBlock>
  );
};

export default NewsList;
