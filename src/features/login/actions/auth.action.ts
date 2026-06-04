"use server";

import { signIn } from "@/auth";

export async function loginAction(data: {
  taxcode: string;
  email: string;
  password: string;
}) {
  try {
    const rs = await signIn("credentials", {
      taxcode: data.taxcode,
      email: data.email,
      password: data.password,
      redirect: false,
    });
  } catch (error) {
    return {
      success: false,
      message: "Tài khoản hoặc mật khẩu không chính xác",
    };
  }
}
