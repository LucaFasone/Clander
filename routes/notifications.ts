import {Hono} from "hono";
import { getUser } from "../kinde";

const notifications = new Hono()
    .get('notifications', getUser,async (c) => {

        
    })
    .post('notifications', getUser,async (c) => {
        console.log(c);
        
        
    })
