import { useRouter } from "next/router";
import { useUser } from "@/services/member";

const IdPage = () => {
  const router = useRouter();
  const { id } = router.query;

  useUser({
    identifier: String(id),
    redirectIfFound: true,
    enabled: !!id,
  });

  return <div>Loading...</div>;
};

export default IdPage;
