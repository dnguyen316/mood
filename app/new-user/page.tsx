import { createNewUser } from "../_actions/user";

const NewUserPage = async () => {
  await createNewUser();

  return <h1>NewUser Page</h1>;
};

export default NewUserPage;
