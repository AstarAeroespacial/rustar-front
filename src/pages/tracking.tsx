import { type NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Tracking: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page since tracking is now the main page
    router.replace('/');
  }, [router]);

  return null;
};

export default Tracking;
