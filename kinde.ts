import {createKindeServerClient, GrantType, SessionManager, UserType} from "@kinde-oss/kinde-typescript-sdk";
import dotenv from "dotenv"
import {Context} from "hono";
import { setCookie,getCookie, deleteCookie } from "hono/cookie";
import { createMiddleware } from 'hono/factory'


dotenv.config();

export const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: process.env.KINDE_DOMAIN!,
  clientId: process.env.KINDE_CLIENT_ID!,
  clientSecret: process.env.KINDE_CLIENT_SECRET!,
  redirectURL: process.env.KINDE_REDIRECT_URI!,
  logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI!,
});


let store: Record<string, unknown> = {};

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "Lax",
}as const

export const sessionManager = (c:Context): SessionManager => ({
  async getSessionItem(key: string) {
    const result = getCookie(c, key);
    return result
  },
  async setSessionItem(key: string, value: unknown) {
    if(typeof value === "string"){
      setCookie(c, key, value, cookieOptions);
    }else{
      setCookie(c, key, JSON.stringify(value), cookieOptions);
    }
  },
  async removeSessionItem(key: string) {
    deleteCookie(c, key);
  },
  async destroySession() {
    store = {};
  }
});


type Env = {
  Variables: {
    user: UserType
  }
}

export const getUser = createMiddleware<Env>(async (c, next) => {
try {
    const isAuth = await kindeClient.isAuthenticated(sessionManager(c))
    if(!isAuth){
      return c.json({error: "Unauthorated"},401);
    }
    const user = await kindeClient.getUserProfile(sessionManager(c));
    c.set("user", user);
    return next();
} catch (error) {
  console.log(error)
  return c.json({error: "Unauthorized"},401);
}
});