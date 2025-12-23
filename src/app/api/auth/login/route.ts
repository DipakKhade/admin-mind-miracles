import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export async function POST(req: NextRequest) {
    try {
    const { username, password: user_password } = await req.json();

    let admin_username = process.env.ADMIN_USERNAME;
    let admin_password = process.env.ADMIN_PASSWORD;

    if(!username || !user_password) {
        return  NextResponse.json({
            success: false,
            message: "insufficient params"
        })
    }
    
    let token = "";

    console.log(admin_password, admin_username)

    if(username === admin_username && user_password === admin_password) {
        token = jwt.sign({username}, process.env.JWT_SEC!, {
            algorithm:'HS256'
        })

        const res =  NextResponse.json({
            success: true,
            message: "Sign in successful",
            token
        })
    
        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        })

        return res
    }
    
    return NextResponse.json({
        success: false,
        message: "Sign in failed"
    })

    } catch(error) {
        return NextResponse.json({
            success: false,
            message:'sign in failed'
        })
    }

}