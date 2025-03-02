import { RegisterForm } from "@/components/register.form";

export default function Register() {
    return (
        <div className="flex min-h-svh w-full shadow-xl items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <RegisterForm />
            </div>
        </div>
    )
}