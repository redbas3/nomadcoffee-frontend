import { useNavigate } from "react-router-dom";
import Header from "../components/UI/Header";
import Input from "../components/auth/Input";
import FormError from "../components/auth/FormError";
import Button from "../components/auth/Button";
import { useForm } from "react-hook-form";
import routes from "../routes";
import { gql, useMutation } from "@apollo/client";
import { styled } from "styled-components";

const CREATE_COFFEESHOP_MUTATION = gql`
  mutation CreateCoffeeShop(
    $name: String!
    $latitude: String
    $longitude: String
    $categories: String
    $photo: Upload
  ) {
    createCoffeeShop(
      name: $name
      latitude: $latitude
      longitude: $longitude
      categories: $categories
      photo: $photo
    ) {
      ok
      id
      error
    }
  }
`;

const FromWrap = styled.div`
  width: 50%;
  max-width: 350px;
  margin: 60px auto 0;
`;

function Add() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
  });
  const onCompleted = (data) => {
    const {
      createCoffeeShop: { ok, id: coffeeShopId, error },
    } = data;
    if (!ok) {
      return setError("result", {
        message: error,
      });
    }

    if (coffeeShopId) {
      navigate(`${routes.coffeeShop}/${coffeeShopId}`);
    }
  };
  const [createCoffeeShop, { loading }] = useMutation(
    CREATE_COFFEESHOP_MUTATION,
    {
      onCompleted,
    }
  );
  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }

    let categories = data.categories;
    categories = categories.trim();
    categories = categories.replace(" ", "");

    createCoffeeShop({
      variables: {
        id: +data.id,
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
        categories: categories,
        photo: data.photo[0],
      },
    });
  };
  const clearLoginError = () => {
    clearErrors("result");
  };
  return (
    <div>
      <Header navigate={navigate}></Header>
      <FromWrap>
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
            {...register("latitude")}
            onFocus={clearLoginError}
            type="text"
            placeholder="Latitude"
            error={0}
          />
          <Input
            {...register("longitude")}
            onFocus={clearLoginError}
            type="text"
            placeholder="Longitude"
            error={0}
          />
          <Input
            {...register("categories")}
            onFocus={clearLoginError}
            type="text"
            placeholder="example: food, italy, dessert"
            error={0}
          />
          <Input
            {...register("photo")}
            onFocus={clearLoginError}
            type="file"
            error={0}
          />
          <Button
            type="submit"
            value={loading ? "Loading..." : "Create CoffeeShop"}
            disabled={!isValid || loading}
          />
          <FormError message={errors?.result?.message} />
        </form>
      </FromWrap>
    </div>
  );
}

export default Add;
