import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthLayout from "../components/auth/AuthLayout";
import FormBox from "../components/auth/FormBox";
import Input from "../components/auth/Input";
import Button from "../components/auth/Button";
import BottomBox from "../components/auth/BottomBox";
import routes from "../routes";
import { styled } from "styled-components";
import { FatLink } from "../components/shared";
import PageTitle from "../components/pageTitle";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import FormError from "../components/auth/FormError";
import { useNavigate } from "react-router-dom";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Subtitle = styled(FatLink)`
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`;

const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccount(
    $name: String!
    $username: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      name: $name
      username: $username
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
  });
  const onCompleted = (data) => {
    const {
      createAccount: { ok, error },
    } = data;
    if (!ok) {
      return setError("result", {
        message: error,
      });
    }

    const { username, password } = getValues();

    navigate(routes.home, {
      state: { message: "Account created. Please log in.", username, password },
    });
  };
  const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });
  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }

    createAccount({
      variables: { ...data },
    });
  };
  const clearLoginError = () => {
    clearErrors("result");
  };
  return (
    <AuthLayout>
      <PageTitle title="Sign up" />
      <FormBox>
        <HeaderContainer>
          <FontAwesomeIcon icon={faCoffee} size="3x" />
          <Subtitle>Sign up to manage your coffee shop.</Subtitle>
        </HeaderContainer>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("name", { required: "name is required" })}
            onFocus={clearLoginError}
            type="text"
            placeholder="Name"
            error={errors?.name?.message ? 1 : 0}
          />
          <FormError message={errors?.name?.message} />
          <Input
            {...register("email", { required: "Email is required" })}
            onFocus={clearLoginError}
            type="text"
            placeholder="Email"
            error={errors?.email?.message ? 1 : 0}
          />
          <FormError message={errors?.email?.message} />
          <Input
            {...register("username", { required: "Username is required" })}
            onFocus={clearLoginError}
            type="text"
            placeholder="Username"
            error={errors?.username?.message ? 1 : 0}
          />
          <FormError message={errors?.username?.message} />
          <Input
            {...register("password", { required: "Password is required" })}
            onFocus={clearLoginError}
            type="password"
            placeholder="Password"
            error={errors?.password?.message ? 1 : 0}
          />
          <FormError message={errors?.password?.message} />
          <Button
            type="submit"
            value={loading ? "Loading..." : "Sign Up"}
            disabled={!isValid || loading}
          />
          <FormError message={errors?.result?.message} />
        </form>
      </FormBox>
      <BottomBox
        cta={"Have an account?"}
        link={routes.home}
        linkText={"Log in"}
      />
    </AuthLayout>
  );
}

export default SignUp;
