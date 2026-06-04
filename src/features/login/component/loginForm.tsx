"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { loginAction } from "@/features/login/actions/auth.action";
import { Toast } from "@/utils/Toast";
import { sendRequest } from "@/utils/api";

const formSchema = z.object({
  taxcode: z.string().min(1, "Vui lòng nhập mã số thuế"),
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  password: z
    .string()
    .min(6, "Password tối thiểu 6 ký tự")
    .max(100, "Password tối đa 100 ký tự"),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taxcode: "0101613901",
      email: "nvt2k.beo@gmail.com",
      password: "1234567tam",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const result = await loginAction(data);
      if (result && !result.success) {
        Toast({
          message: result.message || "Đăng nhập thất bại",
          type: "error",
        });
      } else {
        window.location.href = "/dashboard";
      }
    } catch (e: any) {
      Toast({ message: "Có lỗi xảy ra, vui lòng thử lại.", type: "error" });
    }
  };

  const aoo = async () => {
    console.log("[TEST] Calling /api/quick-view from Client Component...");
    const result = await sendRequest({
      url: "/api/quick-view",
      method: "GET",
      queryParams: {
        endTime: "1798736399999",
        serviceId: "VP",
        startTime: "1767200400000",
      },
    });
    console.log("[TEST] Response:", result);
    // Lưu ý: Nếu token = null tức là bạn chưa đăng nhập.
    // Client Component gọi /api/... thì browser tự gửi cookie session.
    // Nhưng ở trang /login, user chưa có session nên token sẽ trống.
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-8 sm:py-12">
      <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-border bg-card/60 p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
        <div className="flex flex-col space-y-2 text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Đăng nhập
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Nhập thông tin tài khoản của bạn để tiếp tục
          </p>
        </div>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-4">
            <Controller
              name="taxcode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-taxcode">
                    Tax code
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-taxcode"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-email"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    type="email"
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    type="password"
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <div className="pt-8 flex flex-col-reverse sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => aoo()}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form="form-rhf-demo"
            className="w-full sm:flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
