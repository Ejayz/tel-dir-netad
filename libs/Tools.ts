import jsonwebtoken from "jsonwebtoken";
interface UserInfo {
  uuid: string;
  username: string;
  email: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  created_at: string;
}

export const ObtainIP = async (request: Request) => {
  const requestorIP: string =
    request.headers.get("x-forwarded-for")?.split("::ffff:")[1] || "";
  return requestorIP;
};

export const JWTGenerator = async (
  payload: object,
  jwtSecret: string,
  options: object
) => {
  const createToken = await jsonwebtoken.sign(payload, jwtSecret, options);
  return createToken;
};

export const ReturnToken = async() => {
  const cookies = document ? document.cookie.split("token=")[1] : "";
  console.log(cookies )
  const decoded = await jsonwebtoken.decode(cookies);
  console.log(decoded)
  return decoded
};
