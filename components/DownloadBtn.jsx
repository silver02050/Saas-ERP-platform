import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as XLSX from "xlsx/xlsx.mjs";

export const DownloadBtn = ({ data = [], fileName }) => {
  return (
    <button
    title="Download as EXCEL."
      className="download-btn flex items-center justify-center"
      onClick={() => {
        const datas = data?.length ? data : [];
        const worksheet = XLSX.utils.json_to_sheet(datas);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, fileName ? `${fileName}.xlsx` : "data.xlsx");
      }}
    > <FontAwesomeIcon icon={faFileArrowDown} size="2x" className="ml-2" color='#0050C8' />
    </button>
  );
};
