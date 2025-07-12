import Link from "next/link";

const LoginPage = () => {
  return (
    <Link href="http://localhost:8080/oauth2/authorization/google">
      Login With Google
    </Link>
  );
};

export default LoginPage;
