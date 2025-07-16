import Link from "next/link";

const LoginPage = () => {
  return (
    <Link href={`${process.env.NEXT_APP_API_URL}/oauth2/authorization/google`}>
      Login With Google
    </Link>
  );
};

export default LoginPage;
