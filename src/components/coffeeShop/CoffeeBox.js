import { styled } from "styled-components";
import noImageIcon from "../../assets/no-image-icon.png";
import routes from "../../routes";
import { currentUserIDVar } from "../../apollo";
import { useNavigate } from "react-router-dom";

const SCoffeeBox = styled.li`
  width: 100%;
  background-color: #efe1d1;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.35);
  overflow: hidden;

  img {
    width: 100%;
    height: 80%;
    ${(props) => (props.readmodestyled === 1 ? "" : "max-height: 300px;")}
    object-fit: cover;
    transform: scale(1);
    transition-duration: 0.3s;
    transform-origin: 50% 100%;
  }
`;

const CoffeeName = styled.p`
  font-size: 16px;
  padding: 12px;
  font-weight: 600;
  margin-top: 6px;
`;
const CoffeeUsername = styled.p`
  padding: 12px;
  font-weight: 400;
  padding-top: 0;
  color: rgba(63, 46, 62, 0.8);
`;

const CategoryWrap = styled.div`
  display: flex;
  padding: 4px 8px;
  margin-bottom: 6px;
  overflow-x: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Category = styled.span`
  background-color: #3f2e3e;
  color: #efe1d1;
  padding: 10px 24px;
  margin: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const BtnWrap = styled.div`
  padding: 6px;
  margin-bottom: 12px;
`;

const Btn = styled.button`
  color: #efe1d1;
  background: #a78295;
  border-radius: 24px;
  padding: 8px 24px;
  margin: 0 4px;
  cursor: pointer;
  transition-duration: 0.3s;

  &:hover {
    color: #a78295;
    background: #efe1d1;
  }
`;

function CoffeeBox({ coffeeShop, readMode }) {
  const navigate = useNavigate();
  const currentUserID = currentUserIDVar();

  return (
    <SCoffeeBox readmodestyled={readMode}>
      {coffeeShop["photos"] ? (
        <img
          src={
            coffeeShop["photos"][coffeeShop["photos"].length - 1]?.url
              ? coffeeShop["photos"][coffeeShop["photos"].length - 1]?.url
              : noImageIcon
          }
          alt={coffeeShop["photos"][coffeeShop["photos"].length - 1]?.name}
        />
      ) : null}
      <CoffeeName>{coffeeShop.name}</CoffeeName>
      <CoffeeUsername>{coffeeShop.user.name}</CoffeeUsername>
      {coffeeShop["categories"] ? (
        <CategoryWrap>
          {coffeeShop["categories"].map((category) => (
            <Category key={`category_${category.id}`}>{category.name}</Category>
          ))}
        </CategoryWrap>
      ) : null}
      {!readMode ? (
        <BtnWrap>
          <Btn
            onClick={() => navigate(`${routes.coffeeShop}/${coffeeShop.id}`)}
          >
            상세 보기
          </Btn>
          {currentUserID.toString() === coffeeShop.user.id ? (
            <Btn
              onClick={() =>
                navigate(`${routes.editCoffeeShop}/${coffeeShop.id}`)
              }
            >
              수정
            </Btn>
          ) : null}
        </BtnWrap>
      ) : null}
    </SCoffeeBox>
  );
}

export default CoffeeBox;
