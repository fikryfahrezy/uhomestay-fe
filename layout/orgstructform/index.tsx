import type { PositionIn } from "@/services/period";
import type { ChangeEvent } from "react";
import type { StructurePositonOut } from "@/services/period";
import { useState, useEffect, useRef } from "react";
import { useMembersQuery } from "@/services/member";
import { usePositionsQuery } from "@/services/position";
import DynamicSelect from "@/components/dynamicselect";
import Button from "@/components/button";
import EmptyMsg from "@/layout/emptymsg";
import ErrMsg from "@/layout/errmsg";
import styles from "./Styles.module.css";

const defaultFunc = () => {};

type MemberId = {
  id: string;
};

type OrgStructAddFormProps = {
  isPositionSaved?: boolean;
  isEditable?: boolean;
  onSave?: (positions: PositionIn[]) => void;
  prevData?: StructurePositonOut[] | null;
};

const OrgStructAddForm = ({
  isPositionSaved = false,
  isEditable = false,
  prevData = null,
  onSave = defaultFunc,
}: OrgStructAddFormProps) => {
  const [memberCache, setMemberCache] = useState<Record<string, number>>({});
  const positionsQuery = usePositionsQuery();
  const membersQuery = useMembersQuery();
  const formRef = useRef<HTMLFormElement | null>(null);

  const onSaveClick = (memberCache: Record<string, number>) => {
    const positions: Record<string, { members: MemberId[] }> = {};
    Object.entries(memberCache).forEach(([k, v]) => {
      if (!(v in positions)) {
        positions[v] = { members: [] };
      }

      if (!("members" in positions[v])) {
        positions[v].members = [];
      }
      positions[v].members.push({ id: k });
    });

    const positionsArr: PositionIn[] = [];
    Object.entries(positions).forEach(([k, v]) => {
      positionsArr.push({
        id: Number(k),
        members: v.members,
      });
    });

    onSave(positionsArr);
  };

  const onSelectMember = (
    positionId: number,
    _: string,
    prevValue: string,
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    setMemberCache((prevState) => {
      const newState = { ...prevState };
      delete newState[prevValue];
      newState[e.target.value] = positionId;

      return newState;
    });
  };

  const onDeleteMember = (val: string) => {
    setMemberCache((prevState) => {
      const newState = { ...prevState };
      delete newState[val];

      return newState;
    });
  };

  useEffect(() => {
    if (isPositionSaved === false) {
      setMemberCache({});
      formRef.current?.reset();
    }
  }, [isPositionSaved]);

  useEffect(() => {
    if (prevData === null) {
      return;
    }

    const prevMember: Record<string, number> = {};
    prevData.forEach(({ id: posId, members }) => {
      members.forEach(({ id }) => {
        prevMember[id] = posId;
      });
    });

    setMemberCache(prevMember);
  }, [prevData]);

  return (
    <>
      {prevData ? (
        isEditable ? (
          <h2 className={styles.drawerTitle}>Ubah Struktur Organisasi</h2>
        ) : (
          <h2 className={styles.drawerTitle}>Struktur Organisasi</h2>
        )
      ) : (
        <h2 className={styles.drawerTitle}>Buat Struktur Organisasi</h2>
      )}
      <form
        ref={formRef}
        className={styles.drawerBody}
        onSubmit={(e) => e.preventDefault()}
      >
        <div className={styles.drawerContent}>
          {positionsQuery.isLoading ? (
            "Loading..."
          ) : positionsQuery.error ? (
            <ErrMsg />
          ) : positionsQuery.data?.data.positions.length === 0 ? (
            <EmptyMsg />
          ) : (
            positionsQuery.data?.data.positions
              .sort((a, b) => a.level - b.level)
              .map(({ id, name }) => (
                <div className={styles.inputGroup} key={id}>
                  {membersQuery.isLoading ? (
                    "Loading..."
                  ) : membersQuery.error ? (
                    <ErrMsg />
                  ) : (
                    <>
                      <DynamicSelect
                        label={name}
                        disabled={!isEditable}
                        onFieldDelete={(v) => onDeleteMember(v)}
                        onFieldChange={(cv, pv, e) =>
                          onSelectMember(id, cv, pv, e)
                        }
                        selects={Object.entries(memberCache)
                          .filter(([_, v]) => v === id)
                          .map(([id]) => ({
                            key: id,
                            value: id,
                            defaultValue: id,
                          }))}
                      >
                        <option value="">Pilih Anggota</option>
                        {membersQuery.data?.data.members.map(({ id, name }) => (
                          <option
                            key={id}
                            value={id}
                            disabled={memberCache[id] !== undefined}
                          >
                            {name}
                          </option>
                        ))}
                      </DynamicSelect>
                    </>
                  )}
                </div>
              ))
          )}
        </div>
        <div>
          {isEditable ? (
            <Button
              className={styles.formBtn}
              colorScheme="green"
              type="button"
              onClick={() => onSaveClick(memberCache)}
            >
              Simpan
            </Button>
          ) : (
            <></>
          )}
        </div>
      </form>
    </>
  );
};

export default OrgStructAddForm;
