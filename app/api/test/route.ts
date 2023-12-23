import Users from '../../../models/UserModel';
import dbConnect from '../../../lib/db';

export const GET = async () => {
    await dbConnect();
    try {
        const user = await Users.find();
        return Response.json({ success: true, data: user });
    } catch {
        return Response.json({ success: false });
    }
}

// export const POST = async (req: any) => {
//     await dbConnect();
//     const { title, description, price } = await req.json();
//     const user = await Users.create({
//         title, description, price,
//     })

//     return Response.json(user);
// }
