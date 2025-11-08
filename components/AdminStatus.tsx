"use server";
import { cookies } from 'next/headers';
import jsonwebtoken from "jsonwebtoken";
import { getpayloadValue } from '@/libs/Tools';

export default async function is_admin() {
    try{
        const cookie = await cookies();
        const token = cookie.get('token')?.value || "";
    if (token) {
        const payload = await jsonwebtoken.decode(token);
        const branch = getpayloadValue(JSON.stringify(payload), 'branch_id');
        if (branch == '0'){
            return (true);
        }else {
            return (false); 
        }
    }
    }catch (e){
        return (false);
    }
    
}
