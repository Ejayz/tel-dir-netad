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

export const ReturnToken = async () => {
  const cookies = document ? document.cookie.split("token=")[1] : "";
  console.log(cookies)
  const decoded = await jsonwebtoken.decode(cookies);
  console.log(decoded)
  return decoded
};

export const getcookieValue = (
  cookies: string,
  name: string
) => {
  let token = '';
  const cArray = cookies.split(';');
  for (let i = 0; i < cArray.length; i++) {
    const row = cArray[i];
    if (row.includes(name)) {
      token = row.slice(row.indexOf('=') + 1, row.length).trim();
    }
  }
  return token;
};

export const getpayloadValue = (
  payload: string,
  name: string
) => {
  let value = '';
  
  const cArray = payload.split(',');
  // console.log("tools: ",cArray);
  for(let i=0; i<cArray.length; i++){
    const row = cArray[i];
    // console.log(row,'--->',typeof row);
    if (row.includes(name)){
      value = row.slice(row.indexOf(':')+1, row.length).trim();
      // console.log('tools:', value);
    }
  }
  return value;
};

export const querryAll = (


) => {

};