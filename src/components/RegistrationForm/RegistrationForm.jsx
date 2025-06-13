import style from "../../components/ContactForm/ContactForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useId, useState } from "react";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { apiRegister } from "../../redux/auth/operations";
import { NavLink } from "react-router-dom";
import AnimatedEyeIcon from "../AnimatedEyeIcon/AnimatedEyeIcon.jsx";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RegisterSchema = Yup.object().shape({
    name: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("Username is required!"),
    email: Yup.string().min(3, "Too Short!").max(50, "Too Long!").email("Invalid email format").required("Email is required!"),
    password: Yup.string().min(3, "Too Short!").max(35, "Too Long!").required("Password is required!"),
});

export default function RegistrationForm() {
    const dispatch = useDispatch();
    const nameFieldId = useId();
    const emailFieldId = useId();
    const passwordFieldId = useId();
    const [showPassword, setShowPassword] = useState(false);
    const [passwordValue, setPasswordValue] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (values, actions) => {
        try {
            await dispatch(apiRegister(values)).unwrap();
            actions.resetForm();
            setPasswordValue("");
            console.log(values);
            toast.success("Successfully registered!", {
                duration: 6000,
                style: {
                    borderRadius: '10px',
                    textAlign: 'center',
                },
            });
            setTimeout(() => {
                toast("Tip: All modals can be closed by pressing Escape!", {
                icon: '🗿',
                duration: 4000,
                style: {
                    borderRadius: '10px',
                    textAlign: 'center',
                },
            });
            }, 4000);
        } catch (error) {
            toast.error("Some of the data had been earlier used by another user!", {
            duration: 6000,
            style: {
                borderRadius: '10px',
                textAlign: 'center',
            },
            });
            navigate("/login");
        }
    };

    return (
        <Formik
            initialValues={{ name: "", email: "", password: "" }}
            onSubmit={handleSubmit}
            validationSchema={RegisterSchema}
        >
        {({ values, handleChange }) => (
            <Form className={style.register_login_form}>
            <h2 className={style.login_register_title}>Register</h2>
    
            <div className={style.name_number_container}>
                <label htmlFor={nameFieldId} className={style.label}>Name</label>
                <Field type="name" name="name" id={nameFieldId} className={style.input} />
                <ErrorMessage className={style.error_message} name="name" component="span" />
            </div>
    
            <div className={style.name_number_container}>
                <label htmlFor={emailFieldId} className={style.label}>Email</label>
                <Field type="email" name="email" id={emailFieldId} className={style.input} />
                <ErrorMessage className={style.error_message} name="email" component="span" />
            </div>
    

            <div className={style.name_number_container} style={{ position: "relative" }}>
                <label htmlFor={passwordFieldId} className={style.label}>Password</label>
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id={passwordFieldId}
                    value={values.password}
                    onChange={(e) => {
                    handleChange(e);
                    setPasswordValue(e.target.value);
                    }}
                    className={style.input}
                />
    
                {passwordValue && (
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className={style.eye_button}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                <AnimatedEyeIcon active={showPassword} />
                </button>
                )}
                <ErrorMessage className={style.error_message} name="password" component="span" />
            </div>
    
                <button type="submit" className={style.button}>Sign up</button>
                <p className={style.no_account_text}>Already have an account?😱</p>
                <NavLink className={style.to_register_link} to="/login">Login</NavLink>
            </Form>
        )}
        </Formik>
    );
}