import { useEffect, useState } from "react";
import { useFormik } from "formik";
import style from "./Profile.module.css";
import profilepic from "../../assets/profilepc.jpg";
import { useCookies } from "react-cookie";

const Profile = () => {
  const [editSection, setEditSection] = useState(null);
  const [cookies, ,] = useCookies(["token"]);
  // let email = "";
  // if (cookies.token) {
  //   const decodeCookie = atob(cookies.token);
  //   email = JSON.parse(decodeCookie).email;
  // }

  const [user, setUser] = useState<any>({});
  const [role, setRole] = useState<any>({});
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (cookies.token) {
          const decodeCookie = await atob(cookies.token);
          const email = await JSON.parse(decodeCookie).email;
          const res = await fetch(`https://groceries-to-go-back-end.vercel.app/api/users/${email}`);
          if (res.ok) {
            const data = await res.json();

            setUser(data?.data?.user);
            setRole(data?.data?.role);
            console.log(data);
          }
        }
      } catch (error) { }
    };
    fetchUser();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
    },
  } as any);
  const handleEdit = (section:any) => {
    setEditSection(section);
  };
  const handleBlur = () => {
    setEditSection(null);
  };
  return (
    <div className={style.profilecontainer}>
      <div
        className={style.profilesection}
        onClick={() => handleEdit("profile")}
      >
        <img src={profilepic} alt="Profile" className={style.profilepic} />
        <div>
          <h2
            contentEditable={editSection === "profile"}
            className={style.editabletext}
          >{`${user?.first_name} ${user?.last_name}`}</h2>
          <p
            contentEditable={editSection === "profile"}
            className={style.editabletext}
          >
            {user.role}
          </p>
        </div>
      </div>
      <form className={style.formsection} onSubmit={formik.handleSubmit}>
        <div className={style.formblock} onClick={() => handleEdit("personal")}>
          <h3>Personal Information</h3>
          <br />
          <div className={style.inputcontainer}>
            <div className={style.inputflex}>
              <label className={style.plabel} htmlFor="">
                User Name
              </label>
              <input
                className={style.inputbox}
                name="username"
                value={formik.values.username || user.username}
                onChange={formik.handleChange}
                onBlur={handleBlur}
              />
              <label className={style.plabel} htmlFor="">
                First Name
              </label>
              <input
                className={style.inputbox}
                name="firstName"
                value={formik.values.firstName || user.first_name}
                onChange={formik.handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className={style.inputflex}>
              <label className={style.plabel} htmlFor="">
                Last Name
              </label>
              <input
                className={style.inputbox}
                name="lastName"
                value={formik.values.lastName || user.last_name}
                onChange={formik.handleChange}
                onBlur={handleBlur}
              />
              <label className={style.plabel} htmlFor="">
                Email
              </label>
              <input
                className={style.inputbox}
                name="email"
                value={formik.values.email || user.email}
                onChange={formik.handleChange}
                onBlur={handleBlur}
              />
            </div>
          </div>
        </div>

        <div className={style.formblock} onClick={() => handleEdit("contact")}>
          <h3>Contact Information</h3>
          <br />
          <div className={style.inputcontainer}>
            <div className={style.inputflex}>
              <label className={style.plabel} htmlFor="">
                Phone Number
              </label>
              <input
                className={style.inputbox}
                name="phone"
                value={formik.values.phone || user.phone_number}
                onChange={formik.handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className={style.inputflex}>
              <label className={style.plabel} htmlFor="">
                Role
              </label>
              <input
                className={style.inputbox}
                name="address"
                value={formik.values.address || role.role_name}
                onChange={formik.handleChange}
                onBlur={handleBlur}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
