import { auth } from "@/auth";
import { LoginForm } from "@/features/login/component/loginForm";
import { sendRequest } from "@/lib/api";

export default async function Login() {
  const res = await fetch(

    "https://jsonplaceholder.typicode.com/posts",

    // {

    //   next: {

    //     revalidate: 60,

    //   },

    // }

  );

  const data = await res.json();
  console.log("da0a0a0aaaaaaata", data)
  // const data = await sendRequest<{ items: any[] }>({
  //   url: `${process.env.NEXT_PUBLIC_APP_URL}/api/quick-view`,
  //   method: "GET",
  //   queryParams: {
  //     endTime: "1798736399999",
  //     serviceId: "VP",
  //     startTime: "1767200400000"
  //   },
  // });
  // const session = await auth();
  // console.log("sessio8a8a8aa8n", session)

  return (
    <>
      <LoginForm />
    </>
  );
}
