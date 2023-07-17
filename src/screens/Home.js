import { useNavigate } from "react-router-dom";
import { logUserOut } from "../apollo";

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Welcom we did it!</h1>
      <button onClick={() => logUserOut(navigate)}>log out now!</button>
    </div>
  );
}

export default Home;
