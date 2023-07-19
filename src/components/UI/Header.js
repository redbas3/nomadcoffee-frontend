import { Link } from "react-router-dom";
import { styled } from "styled-components";
import routes from "../../routes";
import { logUserOut } from "../../apollo";

const SHeader = styled.header`
  width: 100%;
  height: 60px;
  background: #efe1d1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 30px;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25);

  @media (min-width: 768px) {
    padding: 12px 60px;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: #331d2c;
  cursor: pointer;
  transition-duration: 0.3s;

  &:hover {
    opacity: 0.6;
  }
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

function Header({ navigate }) {
  return (
    <SHeader>
      <HeaderTitle>
        <Link to={routes.home}>Coffee Shops</Link>
      </HeaderTitle>
      <div>
        <Btn onClick={() => navigate(routes.add)}>Add CoffeeShop</Btn>
        <Btn onClick={() => logUserOut(navigate)}>logout</Btn>
      </div>
    </SHeader>
  );
}

export default Header;
