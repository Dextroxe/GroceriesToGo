import { jwtVerify } from "jose";
const secret = "userTokens";
const jwtKey = new TextEncoder().encode(secret);

export const decrypt = async (input: string) => {
  // const  time = moment();

  try {
    const payload = jwtVerify(input, jwtKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return error;
  }
};
