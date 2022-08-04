import { MemberDuesOut } from "@/services/member-dues";
import { RiTimeLine } from "react-icons/ri";
import { DUES_STATUS } from "@/services/member-dues";
import Input from "@/components/input";
import InputFile from "@/components/inputfile";
import Checkbox from "@/components/checkbox";
import styles from "./Styles.module.css";

type MemberDuesDetailProps = {
  prevData: MemberDuesOut;
};

const MemberDuesDetail = ({ prevData }: MemberDuesDetailProps) => {
  const status = (() => {
    switch (prevData.status) {
      case DUES_STATUS.PAID:
        return (
          <Checkbox checked disabled>
            Lunas
          </Checkbox>
        );
      default:
        return (
          <Checkbox checked disabled colorScheme="yellow" icon={<RiTimeLine />}>
            Menunggu Konfirmasi
          </Checkbox>
        );
    }
  })();

  return (
    <>
      <h2 className={styles.drawerTitle} data-testid="detail-dues-title">
        Detail Iuran Anggota
      </h2>
      <div className={styles.drawerBody}>
        <div className={styles.drawerContent}>
          <div className={styles.inputGroup}>
            <Input
              autoComplete="off"
              type="month"
              min={prevData.date}
              required={true}
              label="Tanggal:"
              readOnly={true}
              defaultValue={prevData.date.split("-").splice(0, 2).join("-")}
            />
          </div>
          <div className={styles.inputGroup}>
            <Input
              autoComplete="off"
              type="number"
              required={true}
              label="Jumlah:"
              readOnly={true}
              defaultValue={prevData["idr_amount"]}
            />
          </div>
          <div className={styles.inputGroup}>
            <InputFile
              label="File:"
              required={true}
              value={prevData["prove_file_url"]}
              src={prevData["prove_file_url"]}
              disabled={true}
            >
              Pilih File
            </InputFile>
          </div>
          <div className={styles.inputGroup}>{status}</div>
        </div>
      </div>
    </>
  );
};

export default MemberDuesDetail;
