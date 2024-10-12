import { createNewUser } from "../../actions/user";

const NewUserPage = async () => {
  await createNewUser();

  return <h1>NewUser Page</h1>;
};

export default NewUserPage;
