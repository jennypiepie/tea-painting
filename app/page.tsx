import Login from "@/components/login/page";

export default async function Home() {
  const user = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/test`);
  const { data } = await user.json();

  return (<>
    {!!data && <div>TEA{data[0].username}</div>}
    <Login />
  </>)
}
