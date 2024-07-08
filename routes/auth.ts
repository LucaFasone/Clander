import { Hono } from "hono";
import {getUser, kindeClient, sessionManager} from "../kinde";

export const authRoute = new Hono()
.get("/login",async (c) => {
    const loginUrl = await kindeClient.login(sessionManager(c))
    return c.redirect(loginUrl.toString());
}).get("/register",async (c) => {
    const registerUrl = await kindeClient.register(sessionManager(c))
    return c.redirect(registerUrl.toString());
}).get("/callback",async (c) => {
    try{
        const url = new URL(c.req.url)
        await kindeClient.handleRedirectToApp(sessionManager(c), url);
        return c.redirect("/");
    }catch(e){
        console.log(e)
    }
}).get("/logout",async (c) => {
    await kindeClient.logout(sessionManager(c))
    return c.redirect("/");
}).get("/me",getUser,async (c) => {
        const user = c.var.user;
        return c.json({user})
});