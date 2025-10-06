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
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast, Toaster } from "sonner";

import { email, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSWRMutation from "swr/mutation";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
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

const formSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  email: z.string().email("Ingrese un correo electrónico válido"),
  phone: z
    .string()
    .length(9, "El número debe tener exactamente 9 dígitos")
    .regex(/^9/, "El número debe empezar con 9")
    .regex(/^\d+$/, "Solo se permiten números"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(50, "La contraseña no puede exceder 50 caracteres"),
  channel: z.string().min(1, "Seleccione un canal"),
});

async function fetchRegister(url: string, { arg }: { arg: any }) {
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

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { trigger, data, error, isMutating } = useSWRMutation(
    "/api/register",
    fetchRegister
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      channel: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const request = {
      name: values.name,
      email: values.email,
      phone_e164: `+51${values.phone}`,
      password: values.password,
      channel: values.channel,
      location: {
        lat: -14.049772786847141,
        lng: -75.75019562271035,
        label: "Lima, Perú",
        country_code: "PE",
      },
    };

    try {
      const response = await trigger(request);
      if (response.error?.detail) {
        toast(
          `An error occurred while registering the user.\n \n ${response.error.detail}`
        );
      } else {
        toast.success("User registered successfully!");
        form.reset();
        router.push("/");
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
                Already have an account? <Link href="/login">Login</Link>
              </FieldDescription>
            </div>
            <div className="grid gap-4 py-4 grid-cols-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Names</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
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
                      <Input placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="channel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Elegir canal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem disabled value="Telegram">
                            Telegram
                          </SelectItem>
                          <SelectItem disabled value="Email">
                            Email
                          </SelectItem>
                          <SelectItem disabled value="SMS">
                            SMS
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Field>
              {isMutating ? (
                <Button disabled size="sm">
                  <Spinner />
                  Loading...
                </Button>
              ) : (
                <Button type="submit">Create Account</Button>
              )}
            </Field>
            <FieldSeparator></FieldSeparator>
          </FieldGroup>
        </form>
        <FieldDescription className="px-6 text-center">
          By clicking continue, you accept our <a href="#">Terms of Service</a>{" "}
          and <a href="#">Privacy Policy.</a>
        </FieldDescription>
      </Form>
    </div>
  );
}
