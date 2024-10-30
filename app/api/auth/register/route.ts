import {sanityCreate} from "@/sanity/lib/userdao";


async function signupSanityUser(email: string, name: string) {

    const user = {
        _type: "user",
        email: email,
        name: name,
    }
    return await sanityCreate({document: user});
}

export async function POST(req : Request, res: Response) {
    const { email, name } = await req.json()
    console.log("email received for signup request: ", email);

    if (!email ) {
      return new Response("Email is required", { status: 400 });
    }
    const user = await signupSanityUser(email, name);
    console.log("user created: ", user);
    return new Response(JSON.stringify(user), { status: 200 });
}