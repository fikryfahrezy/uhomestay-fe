import type { StructurePositonOut } from "@/services/period";
import { useRef } from "react";
import DynamicSelect from "@/components/dynamicselect";
import styles from "./Styles.module.css";

type OrgStructAddFormProps = {
  prevData?: StructurePositonOut[] | null;
};

const OrgStructDetail = ({ prevData = null }: OrgStructAddFormProps) => {
  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <>
      <h2 className={styles.drawerTitle}>Struktur Organisasi</h2>
      <form
        ref={formRef}
        className={styles.drawerBody}
        onSubmit={(e) => e.preventDefault()}
        data-testid="add-struct-form"
      >
        <div className={styles.drawerContent}>
          {prevData
            ?.sort((a, b) => a.level - b.level)
            .map(({ id, name, members }) => (
              <div className={styles.inputGroup} key={id}>
                <DynamicSelect
                  label={name}
                  disabled={true}
                  selects={members.map(({ id }) => ({
                    key: id,
                    value: id,
                    defaultValue: id,
                  }))}
                >
                  {members.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </DynamicSelect>
              </div>
            ))}
        </div>
      </form>
    </>
  );
};

export default OrgStructDetail;
