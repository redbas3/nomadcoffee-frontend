import { useNavigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { styled } from "styled-components";
import Header from "../components/UI/Header";
import CoffeeBox from "../components/coffeeShop/CoffeeBox";
import Paginate from "react-js-pagination";
import { useState } from "react";
import { currentPageVar } from "../apollo";

export const COFFEESHOPS_QUERY = gql`
  query SeeCoffeeShops($page: Int!) {
    seeCoffeeShops(page: $page) {
      error
      totalPages
      coffeeShops {
        name
        photos {
          id
          url
        }
        id
        categories {
          id
          name
        }
        user {
          id
          name
        }
      }
    }
  }
`;

const StyledPaginateContainer = styled.div`
  margin-bottom: 80px;
  .pagination {
    display: flex;
    margin: 0 auto;
    justify-content: center;

    li {
      padding: 12px;

      a {
        cursor: pointer;
        color: #3f2e3e;
        border: 1px solid rgba(63, 46, 62, 0.5);
        background-color: rgba(239, 225, 209, 0.2);
        padding: 5px 12px;
        border-radius: 4px;
      }
    }
  }
  .break-me {
    cursor: default;
  }
  .active {
    a {
      cursor: default !important;
      color: rgba(239, 225, 209, 1) !important;
      border: 1px solid rgba(63, 46, 62, 0.5) !important;
      background-color: #3f2e3e !important;
    }
  }
`;

const CoffeeContainer = styled.ul`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-auto-rows: auto;
  padding: 0 30px;
  gap: 20px;
  margin: 30px auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    padding: 0 60px;
    gap: 40px;
    margin: 60px auto;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1800px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

function Home() {
  const currentPage = currentPageVar();
  const [page, setPage] = useState(currentPage);
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(COFFEESHOPS_QUERY, {
    variables: { page: page },
  });

  const handlePageChange = (page) => {
    setPage(page);
    currentPageVar(page);
  };

  if (loading) return null;
  if (error) return `Error! ${error}`;

  const {
    seeCoffeeShops: { coffeeShops, totalPages },
  } = data;

  return (
    <div>
      <Header navigate={navigate}></Header>
      <main>
        {loading ? null : (
          <CoffeeContainer>
            {coffeeShops.map((coffeeShop) => (
              <CoffeeBox
                key={`coffeeShop_${coffeeShop.id}`}
                coffeeShop={coffeeShop}
                readMode={0}
              />
            ))}
          </CoffeeContainer>
        )}

        <StyledPaginateContainer>
          <Paginate
            activePage={page}
            itemsCountPerPage={12}
            totalItemsCount={totalPages * 12}
            pageRangeDisplayed={5}
            prevPageText={"‹"}
            nextPageText={"›"}
            onChange={handlePageChange}
          />
        </StyledPaginateContainer>
      </main>
    </div>
  );
}

export default Home;
