import type { MemberDetailRes } from "@/services/member";
import styles from "./Styles.module.css";

type ProfileTableProps = {
  data: MemberDetailRes;
};

const ProfileTable = ({ data }: ProfileTableProps) => {
  return (
    <table className={styles.profileData}>
      <tbody>
        <tr>
          <td>Nomor WA</td>
          <td>:</td>
          <td>{data["wa_phone"]}</td>
        </tr>
        <tr>
          <td>Nomor Lainnya</td>
          <td>:</td>
          <td>{data["other_phone"]}</td>
        </tr>
        <tr>
          <td>Jabatan</td>
          <td>:</td>
          <td>
            <ol>
              {data.positions
                .sort((a, b) => a.level - b.level)
                .map(({ id, name }) => {
                  return <li key={id}>{name}</li>;
                })}
            </ol>
          </td>
        </tr>
        <tr>
          <td>Periode</td>
          <td>:</td>
          <td>{data.period}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default ProfileTable;
