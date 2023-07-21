import { useMatch, useNavigate } from "react-router-dom";
import Header from "../components/UI/Header";
import Input from "../components/auth/Input";
import FormError from "../components/auth/FormError";
import Button from "../components/auth/Button";
import { useForm } from "react-hook-form";
import routes from "../routes";
import { gql, useMutation, useQuery } from "@apollo/client";
import { styled } from "styled-components";
import { useEffect } from "react";
import { COFFEESHOPS_QUERY } from "./Home";
import { currentPageVar, currentUserIDVar } from "../apollo";

const COFFEESHOP_QUERY = gql`
  query SeeCoffeeShop($id: Int!) {
    seeCoffeeShop(id: $id) {
      id
      name
      latitude
      longitude
      categories {
        id
        name
      }
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

const EDIT_COFFEESHOP_MUTATION = gql`
  mutation EditCoffeeShop(
    $id: Int!
    $name: String
    $latitude: String
    $longitude: String
    $categories: String
    $photo: Upload
  ) {
    editCoffeeShop(
      id: $id
      name: $name
      latitude: $latitude
      longitude: $longitude
      categories: $categories
      photo: $photo
    ) {
      error
      ok
    }
  }
`;

const FromWrap = styled.div`
  width: 50%;
  max-width: 350px;
  margin: 60px auto 0;
`;

function EditCoffeeShop() {
  const currentUserID = currentUserIDVar();
  const currentPage = currentPageVar();
  const navigate = useNavigate();
  const {
    params: { id },
  } = useMatch(`${routes.editCoffeeShop}/:id`);

  if (currentUserID !== id) {
    navigate(routes.home);
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    clearErrors,
    setValue,
  } = useForm({
    mode: "onChange",
  });

  const onCompleted = (data) => {
    const {
      editCoffeeShop: { ok, error },
    } = data;
    if (!ok) {
      return setError("result", {
        message: error,
      });
    }

    navigate(`${routes.coffeeShop}/${id}`);
  };
  const [editCoffeeShop, { loadingEdit }] = useMutation(
    EDIT_COFFEESHOP_MUTATION,
    {
      onCompleted,
      refetchQueries: [
        { query: COFFEESHOPS_QUERY, variables: { page: currentPage } },
      ],
    }
  );
  const onSubmitValid = (data) => {
    if (loadingEdit) {
      return;
    }

    let categories = data.categories;
    if (categories && categories.length > 0) {
      categories = categories.trim();
      categories = categories.replace(" ", "");
    }

    editCoffeeShop({
      variables: {
        id: +id,
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

  const { loading, error, data } = useQuery(COFFEESHOP_QUERY, {
    variables: { id: +id },
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      const { seeCoffeeShop: coffeeShop } = data;
      setValue("name", coffeeShop.name);
      setValue("latitude", coffeeShop.latitude);
      setValue("longitude", coffeeShop.longitude);
      let categoryStr = "";
      coffeeShop.categories.map((category) => {
        categoryStr = categoryStr + category.name + ",";
        return null;
      });
      if (categoryStr) {
        categoryStr = categoryStr.substring(0, categoryStr.length - 1);
      }
      setValue("categories", categoryStr);
    }
  }, [data, setValue]);

  if (loading) return null;
  if (error) return `Error! ${error}`;

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
            value={loadingEdit ? "Loading..." : "Edit CoffeeShop"}
            disabled={!isValid || loadingEdit}
          />
          <FormError message={errors?.result?.message} />
        </form>
      </FromWrap>
    </div>
  );
}

export default EditCoffeeShop;
