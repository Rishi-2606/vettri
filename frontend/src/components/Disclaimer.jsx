import { useTranslation } from "react-i18next";

export default function Disclaimer() {
  const { t } = useTranslation();
  return (
    <div className="disclaimer">
      <strong>{t("disclaimer.label")}</strong> {t("disclaimer.body")}
    </div>
  );
}