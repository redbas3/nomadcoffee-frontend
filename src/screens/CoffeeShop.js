import { Link, useMatch, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import Header from "../components/UI/Header";
import { gql, useMutation, useQuery } from "@apollo/client";
import routes from "../routes";
import CoffeeBox from "../components/coffeeShop/CoffeeBox";
import { IoIosArrowBack } from "react-icons/io";
import { CiEdit, CiTrash } from "react-icons/ci";
import { currentPageVar, currentUserIDVar } from "../apollo";
import { COFFEESHOPS_QUERY } from "./Home";

const COFFEESHOP_QUERY = gql`
  query SeeCoffeeShop($id: Int!) {
    seeCoffeeShop(id: $id) {
      categories {
        id
        name
      }
      name
      id
      photos {
        url
      }
      user {
        id
        name
      }
    }
  }
`;

const DELETE_COFFEESHOP_MUTAION = gql`
  mutation DeleteCoffeeShop($id: Int!) {
    deleteCoffeeShop(id: $id) {
      error
      ok
    }
  }
`;

const CoffeeContainer = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 30px;
  margin: 30px auto;

  @media (min-width: 768px) {
    padding: 0 60px;
    margin: 60px auto;
    width: 80%;
  }

  @media (min-width: 1024px) {
    width: 60%;
  }

  @media (min-width: 1800px) {
    width: 50%;
  }
`;

const BtnWrap = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;

  svg {
    margin: 0 8px;
    transition-duration: 0.3s;
    cursor: pointer;

    &:hover {
      opacity: 0.6;
    }
  }
`;

function CoffeeShop() {
  const currentPage = currentPageVar();
  const navigate = useNavigate();
  const currentUserID = currentUserIDVar();
  const {
    params: { id },
  } = useMatch(`${routes.coffeeShop}/:id`);

  const onCompleted = (data) => {
    const {
      deleteCoffeeShop: { ok, error },
    } = data;
    if (ok) {
      navigate(routes.home);
    } else {
      console.log(error);
    }
  };

  const [deleteCoffeeShop, { loading: loadingDelete }] = useMutation(
    DELETE_COFFEESHOP_MUTAION,
    {
      onCompleted,
      refetchQueries: [
        { query: COFFEESHOPS_QUERY, variables: { page: currentPage } },
      ],
    }
  );

  const { loading, error, data } = useQuery(COFFEESHOP_QUERY, {
    variables: { id: +id },
  });

  if (loading) return null;
  if (error) return `Error! ${error}`;

  const { seeCoffeeShop: coffeeShop } = data;

  const onDeleting = () => {
    if (loadingDelete) {
      return;
    }
    deleteCoffeeShop({
      variables: {
        id: +id,
      },
    });
  };

  return (
    <div>
      <Header navigate={navigate}></Header>
      <main>
        {loading ? null : (
          <CoffeeContainer>
            <BtnWrap>
              <Link to={routes.home}>
                <IoIosArrowBack size={24} />
              </Link>
              {currentUserID === coffeeShop.user.id ? (
                <div>
                  <Link to={`${routes.editCoffeeShop}/${id}`}>
                    <CiEdit size={24} />
                  </Link>
                  <CiTrash onClick={onDeleting} size={24} />
                </div>
              ) : null}
            </BtnWrap>
            <CoffeeBox coffeeShop={coffeeShop} readMode={1} />
          </CoffeeContainer>
        )}
      </main>
    </div>
  );
}

export default CoffeeShop;
