"use client";
import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { tr } from "date-fns/locale";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";

const formSchema = z.object({
  phone_e164: z
    .string()
    .length(9, "El número debe tener exactamente 9 dígitos")
    .regex(/^9/, "El número debe empezar con 9")
    .regex(/^\d+$/, "Solo se permiten números"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(50, "La contraseña no puede exceder 50 caracteres"),
});

// Función para formatear el número mientras se escribe
const formatPhoneNumber = (value: any) => {
  // Remover todo excepto números
  const numbers = value.replace(/\D/g, "");

  // Limitar a 9 dígitos
  const limited = numbers.slice(0, 9);

  // Formatear: XXX XXX XXX
  if (limited.length <= 3) return limited;
  if (limited.length <= 6) return `${limited.slice(0, 3)} ${limited.slice(3)}`;
  return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
};
async function fetchLogin(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });

  if (!res.ok) {
    const error = await res.json();
    return error;
  }
  return res.json();
}
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone_e164: "",
      password: "",
    },
  });

  const { trigger, data, error, isMutating } = useSWRMutation(
    "/api/login",
    fetchLogin
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newsValues = {
      phone_e164: `+51${values.phone_e164}`,
      password: values.password,
    };

    try {
      //  phone_e164: '+51956400071',
      // password: '123456789',
      const response = await trigger(newsValues);
      if (response.error?.detail) {
        toast(
          `An error occurred while logging in the user.\n \n ${response.error.detail}`
        );
      } else {
        login(response.data.user, response.data.access_token);

        toast.success("User logged in successfully!");
        form.reset();
        router.push("/general");
      }
    } catch (err: any) {
      console.log(err);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <a
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="flex size-8 items-center justify-center rounded-md">
                  <GalleryVerticalEnd className="size-6" />
                </div>
                <span className="sr-only">Oxyra Inc.</span>
              </a>
              <h1 className="text-xl font-bold">Welcome to Oxyra Inc.</h1>
              <FieldDescription>
                Don't have an account? <Link href="/signup">Sign up</Link>
              </FieldDescription>
            </div>
            <FormField
              control={form.control}
              name="phone_e164"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Example: +51 956 30 54 30"
                      {...field}
                      value={formatPhoneNumber(field.value)}
                      onChange={(e) => {
                        // Guardar solo los números sin formato
                        const numbers = e.target.value.replace(/\D/g, "");
                        field.onChange(numbers.slice(0, 9));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Field>
              {isMutating ? (
                <Button disabled size="sm">
                  <Spinner />
                  Loading...
                </Button>
              ) : (
                <Button type="submit">Login</Button>
              )}
            </Field>
            <FieldSeparator></FieldSeparator>
          </FieldGroup>
        </form>
        <FieldDescription className="px-6 text-center">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy.</a>
        </FieldDescription>
      </Form>
    </div>
  );
}
