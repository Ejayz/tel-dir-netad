"use client";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { PasswordInput, TextInput } from "./ui/InputFields";
import { useRouter } from "next/navigation";
import { Bounce, toast, ToastContainer } from "react-toastify";
import ThemeToggle from "./ThemeToggle";

export default function Login() {
  const loginValidation = yup.object({
    username: yup.string().required(),
    password: yup.string().required(),
  });

const navigate = useRouter()

  return (
    <>
      <div className="hero font-mono bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <ThemeToggle/>
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <Formik
              initialValues={{
                username: "",
                password: "",
              }}
              onSubmit={async (values) => {
                let headersList = {
                  Accept: "*/*",
                  "Content-Type": "application/json",
                };

                let bodyContent = JSON.stringify({
                  username: values.username,
                  password: values.password,
                });

                let response = await fetch("/api/authentication", {
                  method: "POST",
                  body: bodyContent,
                  headers: headersList,
                });

                let data = await response.json();
                console.log(data)
                if (data.status == 200) {
                 toast(data.statusText);
                  setTimeout(()=>{
                    navigate.push("/dashboard");
                  },1500)
                } else {
                   toast.error(data.statusText)
                }
              }}
              validationSchema={loginValidation}
            >
              {({ values, errors, handleChange, handleSubmit, touched,isSubmitting}) => (
                <Form className="card-body">
                  <fieldset className="fieldset">
                    <TextInput
                      handleChange={handleChange}
                      label="Username"
                      name="username"
                      values={values.username}
                      errors={errors.username}
                      placeholder="Username"
                      touched={touched.username}
                    ></TextInput>
                    <PasswordInput
                      handleChange={handleChange}
                      label="Password"
                      name="password"
                      values={values.password}
                      errors={errors.password}
                      placeholder="Password"
                      touched={touched.password}
                    ></PasswordInput>
                    <div>
                      <a className="link link-hover">Forgot password?</a>
                    </div>
                    <button type="submit" className={`btn ${!isSubmitting?"btn-secondary":"btn-disabled"} mt-4`}>
                      {
                        !isSubmitting?<>Log In</>:<div className="loading-infinity loading loading-xl"></div>
                      }
                    </button>
                  </fieldset>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      <ToastContainer  
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      transition={Bounce} />
    </>
  );
}
