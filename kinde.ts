import { createKindeServerClient, GrantType, SessionManager, UserType } from "@kinde-oss/kinde-typescript-sdk";
import dotenv from "dotenv"
import { Context } from "hono";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import { createMiddleware } from 'hono/factory'


dotenv.config();

export const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: "https://test12345678.kinde.com",
  clientId: "e3893931aa56469b97a59587be5d9d9b",
  clientSecret: "gGXh3cx6DPmvCIq1sSHMuOcsEfNS6thWqNtg5i6yDxbiXddlfLi",
  redirectURL: "https://clander-production.up.railway.app/api/callback",
  logoutRedirectURL: "https://clander.netlify.app",
});



const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
} as const

export const sessionManager = (c: Context): SessionManager => ({
  async getSessionItem(key: string) {
    const result = getCookie(c, key);    
    return result
  },
  async setSessionItem(key: string, value: unknown) {
    if (typeof value === "string") {
      setCookie(c, key, value, cookieOptions);
    } else {
      setCookie(c, key, JSON.stringify(value), cookieOptions);
    }
  },
  async removeSessionItem(key: string) {
    deleteCookie(c, key);
  },
  async destroySession() {
    ["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
      deleteCookie(c, key);
    });
  }
});


type Env = {
  Variables: {
    user: UserType
    timezone: string
  }
}

export const getUser = createMiddleware<Env>(async (c, next) => {
  try {
    const isAuth = await kindeClient.isAuthenticated(sessionManager(c))
    if (!isAuth) {
      console.log('not auth');
      return c.json({ error: "Unauthorized" }, 401);
    }
    const user = await kindeClient.getUserProfile(sessionManager(c));
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    c.set("user", user);
    c.set("timezone", timezone);
    await next();
  } catch (error) {
    console.log(error)
    return c.json({ error: "Unauthorized" }, 401);
  }
});