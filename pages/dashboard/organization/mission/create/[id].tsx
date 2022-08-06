import type { ReactElement } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useMutation } from "react-query";
import { RiCloseLine, RiCheckFill } from "react-icons/ri";
import { getPlainText } from "@/lib/blogmeta";
import { useFindPeriodGoal } from "@/services/period";
import { addGoal } from "@/services/period";
import Button from "@/components/button";
import LinkButton from "@/components/linkbutton";
import Toast, { useToast } from "@/components/toast";
import AdminLayout from "@/layouts/adminpage";
import ToastComponent from "@/layouts/toastcomponent";
import styles from "./Styles.module.css";

const RichText = dynamic(() => import("@/layouts/richtext/write"));

const CreateMission = () => {
  const router = useRouter();
  const { id } = router.query;
  const periodGoal = useFindPeriodGoal(Number(id), {
    enabled: !!id,
  });
  const { toast, updateToast, props } = useToast();

  const editorVisionStateRef = useRef();
  const editorMissionStateRef = useRef();

  const addGoalMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof addGoal>[0]
  >((data) => {
    return addGoal(data);
  });

  const onClick = (id: string) => {
    if (editorVisionStateRef.current && editorMissionStateRef.current) {
      const visionContent = JSON.stringify(editorVisionStateRef.current);
      let visionContentText = "";

      if (editorVisionStateRef.current && visionContent !== "") {
        visionContentText = getPlainText(editorVisionStateRef.current);
      }

      const missionContent = JSON.stringify(editorMissionStateRef.current);
      let missionContentText = "";

      if (editorMissionStateRef.current && missionContent !== "") {
        missionContentText = getPlainText(editorMissionStateRef.current);
      }

      const data = {
        mission: missionContent,
        mission_text: missionContentText,
        vision: visionContent,
        vision_text: visionContentText,
        org_period_id: Number(id),
      };

      const lastId = toast({
        status: "info",
        duration: 999999,
        render: () => <ToastComponent title={`Loading mengubah visi & misi`} />,
      });

      addGoalMutation
        .mutateAsync(data)
        .then(() => {
          window.location.replace(`${router.pathname}/../../view/${id}`);
        })
        .catch((e) => {
          updateToast(lastId, {
            status: "error",
            render: () => (
              <ToastComponent
                title={`Error visi & misi`}
                message={e.message}
                data-testid="toast-modal"
              />
            ),
          });
        });
    }
  };

  return (
    <>
      <div className={styles.editableButtons}>
        <Button
          colorScheme="green"
          leftIcon={<RiCheckFill />}
          onClick={() => onClick(id as string)}
          className={styles.actionBtn}
          data-testid="mission-update-btn"
        >
          Ubah
        </Button>
        <Link
          href={{
            pathname: `${router.pathname}/../../view/[id]`,
            query: { id },
          }}
          passHref
        >
          <LinkButton
            colorScheme="red"
            leftIcon={<RiCloseLine />}
            className={styles.actionBtn}
          >
            Batal
          </LinkButton>
        </Link>
      </div>
      <h2 className={styles.pageTitle}>Visi</h2>
      {periodGoal.isIdle || periodGoal.isLoading ? (
        "Loading..."
      ) : periodGoal.error ? (
        <RichText
          editorStateRef={editorVisionStateRef}
          editorStateJSON={null}
        />
      ) : (
        <RichText
          editorStateRef={editorVisionStateRef}
          editorStateJSON={periodGoal.data.data.vision}
        />
      )}
      <h2 className={styles.pageTitle}>Misi</h2>
      {periodGoal.isIdle || periodGoal.isLoading ? (
        "Loading..."
      ) : periodGoal.error ? (
        <RichText
          editorStateRef={editorMissionStateRef}
          editorStateJSON={null}
        />
      ) : (
        <RichText
          editorStateRef={editorMissionStateRef}
          editorStateJSON={periodGoal.data.data.mission}
        />
      )}
      <Toast {...props} />
    </>
  );
};

CreateMission.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default CreateMission;
