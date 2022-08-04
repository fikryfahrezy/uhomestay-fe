import type { PositionIn } from "@/services/period";
import { useRef } from "react";
import { useMembersQuery } from "@/services/member";
import { usePositionsQuery } from "@/services/position";
import DynamicSelect from "@/components/dynamicselect";
import Button from "@/components/button";
import EmptyMsg from "@/layouts/emptymsg";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const defaultFunc = () => {};

type MemberId = {
  id: string;
};

type OrgStructAddFormProps = {
  onSave?: (positions: PositionIn[]) => void;
};

type MemberCache = { id: number; members: MemberId[] };

const OrgStructAddForm = ({ onSave = defaultFunc }: OrgStructAddFormProps) => {
  const positionsQuery = usePositionsQuery();
  const membersQuery = useMembersQuery("");

  const memberCache = useRef<MemberCache[]>([]);
  const formRef = useRef<HTMLFormElement | null>(null);
  const selectList = useRef([
    {
      key: 0,
      value: "",
    },
  ]);

  const onSaveClick = (memberCache: MemberCache[]) => {
    const newMemberCache = memberCache.map(({ id, members }) => {
      const memberSet = new Set<string>();
      members.forEach(({ id }) => {
        memberSet.add(id);
      });

      const newMembers: MemberId[] = [];
      memberSet.forEach((v) => {
        newMembers.push({ id: v });
      });

      return {
        id,
        members: newMembers,
      };
    });

    onSave(newMemberCache);
  };

  const onSelectMember = (
    positionId: number,
    currentValue: string,
    prevValue: string
  ) => {
    let chcIdx = memberCache.current.findIndex(({ id }) => id === positionId);
    if (chcIdx === -1) {
      memberCache.current.push({ id: positionId, members: [] });
      chcIdx = memberCache.current.length - 1;
    }

    const prevMem = memberCache.current[chcIdx];

    const firstIdx = prevMem.members.findIndex(({ id }) => id === prevValue);
    if (firstIdx !== -1) {
      prevMem.members.splice(firstIdx, 1);
    }

    prevMem.members.push({ id: currentValue });
    memberCache.current[chcIdx] = prevMem;
  };

  const onDeleteMember = (positionId: number, val: string) => {
    const chcIdx = memberCache.current.findIndex(({ id }) => id === positionId);
    if (chcIdx === -1) {
      return;
    }

    const prevMem = memberCache.current[chcIdx];

    const firstIdx = prevMem.members.findIndex(({ id }) => id === val);
    if (firstIdx !== -1) {
      prevMem.members.splice(firstIdx, 1);
    }

    memberCache.current[chcIdx].members = prevMem.members;
  };

  return (
    <>
      <h2 className={styles.drawerTitle}>Buat Struktur Organisasi</h2>
      <form
        ref={formRef}
        className={styles.drawerBody}
        onSubmit={(e) => e.preventDefault()}
        data-testid="add-struct-form"
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
                    <DynamicSelect
                      label={name}
                      disabled={false}
                      onFieldDelete={(v) => onDeleteMember(id, v)}
                      onFieldChange={(cv, pv) => onSelectMember(id, cv, pv)}
                      selects={selectList.current}
                    >
                      <option value="">Pilih Anggota</option>
                      {membersQuery.data?.data.members
                        .filter(
                          ({ is_approved: isApproved }) => isApproved === true
                        )
                        .map(({ id, name }) => (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        ))}
                    </DynamicSelect>
                  )}
                </div>
              ))
          )}
        </div>
        <div>
          <Button
            className={styles.formBtn}
            colorScheme="green"
            type="button"
            onClick={() => onSaveClick(memberCache.current)}
          >
            Simpan
          </Button>
        </div>
      </form>
    </>
  );
};

export default OrgStructAddForm;
